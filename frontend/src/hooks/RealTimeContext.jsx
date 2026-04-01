import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
    intradayActivity,
    computeSummaryStats,
    liveEmployeeStats,
    weeklyProductivityTrend,
    checkAlertThresholds,
    appUsageByCategory,
    teamProductivity,
} from '../store/analyticsEngine';
import { logAction } from '../utils/logAction';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/authStore';
import { useFilterStore } from '../store/filterStore';
import employeeService from '../services/employeeService';
import activityService from '../services/activityService';
import teamService from '../services/teamService';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import goalService from '../services/goalService';
import screenshotService from '../services/screenshotService';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const RealTimeContext = createContext();
const STORAGE_KEY = 'ems_state_v5';
const TODAY = new Date().toISOString().split('T')[0];

const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const mapStatus = (status) => {
    const s = status?.toUpperCase();
    if (s === 'BACKLOG') return 'Backlog';
    if (s === 'IN_OPERATIONS') return 'In Operations';
    if (s === 'QUALITY_ASSURANCE') return 'Quality Assurance';
    if (s === 'FINALIZED') return 'Finalized';
    return status;
};

export function RealTimeProvider({ children }) {
    const { toast } = useToast();
    const [step, setStep] = useState('choice');
    const [copied, setCopied] = useState(false);

    const [state, setState] = useState({
        employees: [],
        tasks: [],
        projects: [],
        goals: [],
        teams: [],
        // Logs
        activityLogs: [],
        attendanceLogs: [],
        appUsageLogs: [],
        locationLogs: [],
        payrollData: [],
        // UI state
        timeEntries: [],
        notifications: [],
        alerts: [],
        screenshots: [],
        geofences: [
            { id: 1, name: 'Headquarters', radius: '500m', status: 'Active', enabled: true, color: 'border-blue-500 bg-blue-500/10' },
            { id: 2, name: 'Client Site A', radius: '200m', status: 'Active', enabled: true, color: 'border-purple-500 bg-purple-500/10' },
            { id: 3, name: 'Warehouse Beta', radius: '1km', status: 'Inactive', enabled: false, color: 'border-slate-500 bg-slate-500/10' },
        ],
        leaveRequests: [
            { id: 1, name: 'John Doe', type: 'Sick Leave', range: 'Feb 18 - Feb 20', status: 'Approved', color: 'bg-emerald-50 text-emerald-600' },
            { id: 2, name: 'Jane Smith', type: 'Annual Leave', range: 'Mar 05 - Mar 12', status: 'Pending', color: 'bg-amber-50 text-amber-600' },
            { id: 3, name: 'Alex Johnson', type: 'Casual Leave', range: 'Feb 25', status: 'Pending', color: 'bg-amber-50 text-amber-600' },
            { id: 4, name: 'Sarah Brown', type: 'Sick Leave', range: 'Feb 14 - Feb 15', status: 'Rejected', color: 'bg-red-50 text-red-600' },
        ],
        checkIns: [],
        travelStats: { totalDistance: '42.5 km', avgSpeed: '18 km/h', topSpeed: '45 km/h', totalTrips: 12 },
        timer: { isRunning: false, startTime: null, seconds: 0, currentTask: null },
        currentUser: { id: 0, name: 'Admin User', role: 'Admin' },
        // Compliance
        complianceSettings: {
            twoFA: false,
            encryptionEnabled: false,
            gdprRetentionDays: 365,
            consentGiven: false,
            dataMinimization: false,
            auditLogs: true,
            rolePermissions: { admin: true, manager: false, viewer: false },
        },
        // Alert thresholds
        alertThresholds: { idleThresholdHours: 2.5, unproductivePct: 40 },
        // Date filter
        selectedDate: TODAY,
    });

    const { user, role, isAuthenticated } = useAuthStore();

    const [isLoading, setIsLoading] = useState(true);
    const timerInterval = useRef(null);

    // Initial Load — merge saved session data (timer, notifications, user-added records)
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setState(prev => ({
                    ...prev,
                    // Only restore user-added / ephemeral data — NOT the seed data
                    employees: parsed.employees || prev.employees,
                    timeEntries: parsed.timeEntries || prev.timeEntries,
                    notifications: parsed.notifications || prev.notifications,
                    leaveRequests: parsed.leaveRequests || prev.leaveRequests,
                    timer: { ...prev.timer, ...(parsed.timer || {}), isRunning: false },
                    complianceSettings: parsed.complianceSettings || prev.complianceSettings,
                    alertThresholds: parsed.alertThresholds || prev.alertThresholds,
                    selectedDate: parsed.selectedDate || prev.selectedDate,
                }));
            }
        } catch (e) { /* ignore corrupt cache */ }
        setIsLoading(false);
    }, []);

    // Persistence — only save ephemeral user-interactive data (not seed logs which are huge)
    useEffect(() => {
        if (!isLoading) {
            const toSave = {
                employees: state.employees,
                timeEntries: state.timeEntries,
                notifications: state.notifications,
                leaveRequests: state.leaveRequests,
                timer: state.timer,
                complianceSettings: state.complianceSettings,
                alertThresholds: state.alertThresholds,
                selectedDate: state.selectedDate,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        }
    }, [state.employees, state.timeEntries, state.notifications, state.leaveRequests, state.timer, state.complianceSettings, state.alertThresholds, state.selectedDate, isLoading]);

    // Timer
    useEffect(() => {
        if (state.timer.isRunning) {
            timerInterval.current = setInterval(() => {
                setState(prev => ({ ...prev, timer: { ...prev.timer, seconds: prev.timer.seconds + 1 } }));
            }, 1000);
        } else {
            clearInterval(timerInterval.current);
        }
        return () => clearInterval(timerInterval.current);
    }, [state.timer.isRunning]);

    // ─── SYNC FUNCTIONS ─────────────────────────────────────────────────────
    const syncEmployees = useCallback(async () => {
        if (!isAuthenticated || (role !== 'ADMIN' && role !== 'MANAGER')) return;
        try {
            const res = await employeeService.getEmployees();
            if (res.success && res.data) {
                setState(prev => {
                    const backendEmployees = res.data.map(emp => {
                        const name = emp.fullName || emp.name || 'Unknown User';
                        const st = emp.status?.toLowerCase() || 'offline';
                        return {
                            ...emp,
                            name: name,
                            initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
                            team: emp.team?.name || emp.team || 'General',
                            status: st === 'active' ? 'online' : st,
                        };
                    });
                    return { ...prev, employees: backendEmployees };
                });
            }
        } catch (err) {
            console.error('Failed to sync employees:', err);
        }
    }, [isAuthenticated, role]);

    const syncTeams = useCallback(async () => {
        if (!isAuthenticated || (role !== 'ADMIN' && role !== 'MANAGER')) return;
        try {
            const res = await teamService.getTeams();
            if (res.success && res.data) {
                setState(prev => ({
                    ...prev,
                    teams: res.data.map(t => ({ ...t, isSeed: false }))
                }));
            }
        } catch (err) {
            console.error('Failed to sync teams:', err);
        }
    }, [isAuthenticated, role]);

    const { dateRange, selectedTeam, selectedEmployee } = useFilterStore();
    const syncLogs = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const params = {
                startDate: dateRange.start,
                endDate: dateRange.end,
                teamId: selectedTeam,
                employeeId: selectedEmployee
            };
            
            let res;
            if (role === 'ADMIN' || role === 'MANAGER') {
                res = await activityService.getOrganizationSummary(params);
            } else if (role === 'EMPLOYEE' && user?.id) {
                res = await activityService.getEmployeeSummary(user.id, params);
                if (res.success && res.data && !Array.isArray(res.data)) {
                    res.data = [res.data];
                }
            } else {
                return;
            }

            if (res && res.success && res.data) {
                setState(prev => ({ ...prev, activityLogs: res.data }));
            }
        } catch (err) {
            if (err.response?.status !== 403) {
                console.error('Failed to sync activity logs:', err);
            }
        }
    }, [isAuthenticated, role, user, dateRange, selectedTeam, selectedEmployee]);

    const syncTasks = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await taskService.getTasks(role === 'EMPLOYEE' ? user?.employeeId : null);
            if (res.success && res.data) {
                setState(prev => ({
                    ...prev,
                    tasks: res.data.map(task => ({
                        id: task.id,
                        title: task.name,
                        project: task.project?.name || 'No Project',
                        projectId: task.projectId,
                        priority: task.priority || 'Medium',
                        assignee: task.employee ? task.employee.fullName : 'Unassigned',
                        assigneeId: task.employeeId,
                        assigneeStatus: task.employee?.status?.toLowerCase() || 'offline',
                        status: mapStatus(task.status),
                        progress: task.status === 'FINALIZED' ? 100 : (task.status === 'QUALITY_ASSURANCE' ? 80 : (task.status === 'IN_OPERATIONS' ? 40 : 0)),
                        dueDate: task.dueDate ? task.dueDate.split('T')[0] : 'No Date',
                        timeSpent: (() => {
                            let totalHrs = 0;
                            state.activityLogs.forEach(log => {
                                if (log.taskHours && log.taskHours[task.id]) {
                                    totalHrs += log.taskHours[task.id];
                                }
                            });
                            return Math.round(totalHrs * 10) / 10 + 'h';
                        })(),
                        description: task.description || ''
                    }))
                }));
            }
        } catch (err) {
            console.error('Failed to sync tasks:', err);
        }
    }, [isAuthenticated]);

    const syncProjects = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await projectService.getProjects();
            if (res.success && res.data) {
                const projectsData = Array.isArray(res.data) ? res.data : (res.data.projects || []);
                setState(prev => ({
                    ...prev,
                    projects: projectsData.map(p => ({
                        id: p.id,
                        name: p.projectName || p.name,
                        client: p.client || 'Internal',
                        progress: parseInt(p.progress) || 0,
                        status: p.status || 'Active',
                        color: p.color || 'bg-indigo-500',
                        taskCount: p.tasks || 0,
                        memberIds: p.assignments?.map(a => a.employeeId) || [],
                        isSeed: false
                    }))
                }));
            }
        } catch (err) {
            console.error('Failed to sync projects:', err);
        }
    }, [isAuthenticated]);

    const syncGoals = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await goalService.getGoals();
            if (res.success && res.data) {
                setState(prev => ({ ...prev, goals: res.data }));
            }
        } catch (err) {
            console.error('Failed to sync goals:', err);
        }
    }, [isAuthenticated]);

    // ─── POLLING INTERVALS ──────────────────────────────────────────────────
    useEffect(() => {
        if (isLoading || !isAuthenticated) return;
        syncEmployees();
        syncTeams();
        syncTasks();
        syncProjects();
        syncGoals();
        syncLogs();

        const empInt = setInterval(syncEmployees, 5000);
        const logInt = setInterval(syncLogs, 5000);
        const taskInt = setInterval(syncTasks, 5000);
        const projInt = setInterval(syncProjects, 5000);
        const goalInt = setInterval(syncGoals, 10000);

        return () => {
            clearInterval(empInt);
            clearInterval(logInt);
            clearInterval(taskInt);
            clearInterval(projInt);
            clearInterval(goalInt);
        };
    }, [isLoading, isAuthenticated, syncEmployees, syncTeams, syncTasks, syncProjects, syncGoals, syncLogs]);

    const [socketInstance, setSocketInstance] = useState(null);

    // WebSocket Integration
    useEffect(() => {
        if (isLoading || !isAuthenticated || !user) return;

        const socket = io(SOCKET_URL, {
            auth: { token: useAuthStore.getState().token },
            transports: ['websocket']
        });
        setSocketInstance(socket);

        socket.on('connect', () => {
            console.log('RealTimeContext: Connected to socket');
            
            // Initial fetch of everything to be safe
            syncEmployees();
            syncLogs();
            syncTasks();
            syncProjects();
            syncGoals();
        });

        socket.on('employee:status', ({ employeeId, status }) => {
            setState(prev => ({
                ...prev,
                employees: prev.employees.map(e => 
                    e.id === employeeId ? { ...e, status: status.toLowerCase() === 'active' ? 'online' : status.toLowerCase() } : e
                )
            }));
        });

        socket.on('activity:update', (data) => {
            // Add to activity stream if we are on a page that needs it
            // For now, we update logs if it's the current date
            if (state.selectedDate === TODAY) {
                // Update specific metrics if needed or just let the stat computation handle it
            }
        });

        socket.on('screenshot:new', (data) => {
            setState(prev => ({
                ...prev,
                screenshots: [data, ...prev.screenshots].slice(0, 50)
            }));
            addNotification(`New screenshot from employee`, 'info');
        });

        socket.on('goal:update', (data) => {
            setState(prev => ({
                ...prev,
                goals: prev.goals.map(g => g.id === data.id ? data : g)
            }));
        });

        socket.on('attendance:update', (data) => {
            console.log('RealTimeContext: Attendance updated:', data);
            syncEmployees();
            syncLogs();
        });

        socket.on('task:update', (data) => {
            console.log('RealTimeContext: Task updated:', data);
            syncTasks();
        });

        socket.on('project:update', (data) => {
            console.log('RealTimeContext: Project updated:', data);
            syncProjects();
        });

        socket.on('team:update', (data) => {
            console.log('RealTimeContext: Team updated:', data);
            syncTeams();
            syncEmployees(); // Teams change might affect employee assignments visibility
        });

        socket.on('goal:new', (data) => {
            setState(prev => ({
                ...prev,
                goals: [data, ...prev.goals]
            }));
            addNotification(`New goal "${data.title}" defined`, 'success');
        });

        return () => socket.disconnect();
    }, [isLoading, isAuthenticated, user]);



    // ─── COMPUTED ANALYTICS ──────────────────────────────────────────────────

    const stats = useMemo(() => {
        const { employees, activityLogs, selectedDate } = state;

        // 1. Calculate empMetrics FIRST (today's logs for each employee)
        const todayLogs = activityLogs.filter(l => l.date === selectedDate);
        const empMetrics = employees.map(emp => {
            const log = todayLogs.find(l => l.employeeId === emp.id);
            const fullName = emp.fullName || emp.name || 'Unknown User';

            // Determine status based on presence of log today or employee's current status
            let status = emp.status?.toLowerCase() || 'offline';
            if (status === 'active') status = 'online';
            
            if (status !== 'break' && log) {
                status = log.activeHours > 0 ? 'online' : (log.idleHours > 0 ? 'idle' : 'offline');
            }

            // Find latest break start time if on break
            let breakStartedAt = log?.breakStartedAt || null;
            let breakHours = log?.breakHours || 0;
            const manualHours = log?.manualHours || 0;
            const activeHours = log?.activeHours || 0;
            const idleHours = log?.idleHours || 0;

            return {
                ...emp,
                name: fullName,
                initials: fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
                team: emp.team?.name || emp.team || 'General',
                status,
                breakStartedAt,
                breakHours,
                manualHours,
                activeHours,
                idleHours,
                totalWorkHours: activeHours + idleHours + manualHours,
                computerActivityHours: activeHours + idleHours,
                productive: log ? `${String(Math.floor(log.productiveHours)).padStart(2, '0')}:${String(Math.round((log.productiveHours % 1) * 60)).padStart(2, '0')}` : '00:00',
                unproductive: log ? `${String(Math.floor(log.unproductiveHours)).padStart(2, '0')}:${String(Math.round((log.unproductiveHours % 1) * 60)).padStart(2, '0')}` : '00:00',
                utilization: log ? log.utilizationPct : (emp.utilizationScore || 0),
                productivity: log ? log.productivityPct : (emp.productivityScore || 0),
                productivityScore: log ? log.productivityPct : (emp.productivityScore || 0),
                utilizationScore: log ? log.utilizationPct : (emp.utilizationScore || 0),
                productiveHours: log?.productiveHours || 0,
                unproductiveHours: log?.unproductiveHours || 0,
            };
        });

        // 2. Base analytics on the enriched empMetrics
        const summary = computeSummaryStats(activityLogs, selectedDate);
        const trend = weeklyProductivityTrend(activityLogs);
        const intraday = intradayActivity(activityLogs, selectedDate);
        const appUsage = appUsageByCategory(state.appUsageLogs, 7);
        const live = liveEmployeeStats(empMetrics);

        // 3. Team breakdown using actual teams (Filter out seed data if real data exists)
        const realTeams = state.teams.filter(t => !t.isSeed);
        const activeRealEmps = empMetrics.filter(e => !e.isSeed);

        // If we have real teams or real employees, use ONLY those names.
        // Otherwise fallback to seed names (state.teams will have them if no real teams synced)
        const useRealOnly = realTeams.length > 0 || activeRealEmps.length > 0;

        let teamNames;
        if (useRealOnly) {
            // Get names from real teams OR teams mentioned by real employees
            teamNames = [...new Set([
                ...realTeams.map(t => t.name),
                ...activeRealEmps.map(e => e.team)
            ])].filter(name =>
                name &&
                name !== 'General' &&
                !['Engineering', 'Sales', 'HR', 'Operations'].includes(name)
            );

            // If we filtered EVERYTHING out but we have real data, at least show the real ones
            if (teamNames.length === 0 && useRealOnly) {
                teamNames = [...new Set([
                    ...realTeams.map(t => t.name),
                    ...activeRealEmps.map(e => e.team)
                ])].filter(name => name && name !== 'General');
            }
        } else {
            teamNames = [...new Set([
                ...state.teams.map(t => t.name),
                ...empMetrics.map(e => e.team)
            ])].filter(Boolean);
        }

        const teamBreakdown = teamNames.map(name => ({
            name,
            productivity: teamProductivity(empMetrics, name, activityLogs),
            active: empMetrics.filter(e => e.team === name && e.status === 'online').length,
            total: empMetrics.filter(e => e.team === name).length,
        }));

        const totalPayroll = (state.payrollData || []).reduce((s, p) => s + (p.grossPayValue || 0), 0);
        const avgHourlyRate = Math.round(employees.reduce((s, e) => s + (e.hourlyRate || 50), 0) / Math.max(1, employees.length));

        return {
            ...live,
            totalHours: { today: summary.workTime, week: '3,840h', month: '16,400h' },
            summary,
            productivityTrend: trend,
            intradayActivity: intraday,
            departmentStats: teamBreakdown,
            appUsage,
            empMetrics,
            topProductive: [...empMetrics].sort((a, b) => b.productivity - a.productivity).slice(0, 5),
            topUnproductive: [...empMetrics].sort((a, b) => a.productivity - b.productivity).slice(0, 5),
            payroll: { total: totalPayroll, avgHourlyRate, formatted: `$${totalPayroll.toLocaleString()}` },
        };
    }, [state.employees, state.activityLogs, state.appUsageLogs, state.payrollData, state.selectedDate]);

    // ─── ACTIONS ─────────────────────────────────────────────────────────────

    const addNotification = useCallback((title, type = 'info') => {
        const n = { id: Date.now(), title, time: 'Just now', type, unread: true };
        setState(prev => ({ ...prev, notifications: [n, ...prev.notifications].slice(0, 50) }));
        
        // Route to global toast system
        if (type === 'alert' || type === 'error') toast.error(title);
        else if (type === 'success') toast.success(title);
        else if (type === 'warning') toast.warning(title);
        else toast.info(title);
    }, [toast]);

    // Employee CRUD
    const addEmployee = useCallback((employee) => {
        const id = Date.now();
        const baseEmp = {
            ...employee,
            id,
            status: employee.status || 'active',
            avatar: `https://i.pravatar.cc/150?u=${id}`,
            hourlyRate: employee.hourlyRate || 55,
            productivityScore: 82,
            utilizationScore: 85,
            team: employee.team || 'Operations',
            lat: 40.71 + Math.random() * 0.05,
            lng: -74.01 + Math.random() * 0.05,
        };

        // Generate 30 days of synthetic history
        const empArr = [baseEmp];
        const newAttendance = buildAttendanceLogs(empArr);
        const newActivity = buildActivityLogs(empArr);
        const newAppUsage = buildAppUsageLogs(empArr);
        const newLocation = buildLocationLogs(empArr);
        const newScreenshots = buildScreenshots(empArr);
        const newTasks = buildTasks(empArr);
        const newPayroll = buildPayrollData(empArr, newActivity);
        const newAlerts = buildAlerts(empArr, newActivity);

        setState(prev => ({
            ...prev,
            employees: [baseEmp, ...prev.employees],
            attendanceLogs: [...newAttendance, ...prev.attendanceLogs],
            activityLogs: [...newActivity, ...prev.activityLogs],
            appUsageLogs: [...newAppUsage, ...prev.appUsageLogs],
            locationLogs: [...newLocation, ...prev.locationLogs],
            screenshots: [...newScreenshots, ...prev.screenshots],
            tasks: [...newTasks, ...prev.tasks],
            payrollData: [...newPayroll, ...prev.payrollData],
            alerts: [...newAlerts, ...prev.alerts],
        }));

        addNotification(`New employee ${employee.name} added with 30 days of history`, 'success');
        return baseEmp;
    }, [addNotification]);

    const updateEmployee = useCallback((id, updates) => {
        setState(prev => ({ ...prev, employees: prev.employees.map(e => e.id === id ? { ...e, ...updates } : e) }));
    }, []);

    const deleteEmployee = useCallback((id) => {
        setState(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== id) }));
        addNotification('Employee removed', 'info');
    }, [addNotification]);

    const mergeEmployees = useCallback((fromId, intoId) => {
        setState(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== parseInt(fromId)) }));
        addNotification('Employees merged successfully', 'success');
    }, [addNotification]);

    // Team CRUD
    const addTeam = useCallback((team) => {
        const newTeam = { ...team, id: Date.now(), members: 0, color: 'bg-violet-500', productivity: 80 };
        setState(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
        addNotification(`Team "${team.name}" created`, 'success');
    }, [addNotification]);

    const updateTeam = useCallback((id, updates) => {
        setState(prev => ({ ...prev, teams: prev.teams.map(t => t.id === id ? { ...t, ...updates } : t) }));
    }, []);

    const deleteTeam = useCallback((id) => {
        setState(prev => ({ ...prev, teams: prev.teams.filter(t => t.id !== id) }));
        addNotification('Team removed', 'info');
    }, [addNotification]);

    // Timer
    const startTimer = useCallback((taskName) => {
        setState(prev => ({ ...prev, timer: { ...prev.timer, isRunning: true, startTime: prev.timer.startTime || Date.now(), currentTask: taskName || 'General Work' } }));
    }, []);

    const pauseTimer = useCallback(() => setState(prev => ({ ...prev, timer: { ...prev.timer, isRunning: false } })), []);

    const stopTimer = useCallback(() => {
        setState(prev => {
            const { seconds, currentTask, startTime } = prev.timer;
            const now = Date.now();
            const fmt = ts => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newEntry = {
                id: now, date: new Date().toISOString().split('T')[0],
                day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
                task: currentTask || 'General Work', project: 'General',
                duration: formatTime(seconds), time: `${fmt(startTime || now)} - ${fmt(now)}`, status: 'Verified',
            };
            return { ...prev, timeEntries: [newEntry, ...prev.timeEntries], timer: { isRunning: false, startTime: null, seconds: 0, currentTask: null } };
        });
        addNotification('Time entry saved', 'success');
    }, [addNotification]);

    const toggleTimer = useCallback((taskName = 'General Work') => {
        setState(prev => {
            if (prev.timer.isRunning) {
                const { seconds, currentTask, startTime } = prev.timer;
                const now = Date.now();
                const fmt = ts => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const entry = { id: now, date: new Date().toISOString().split('T')[0], day: new Date().toLocaleDateString('en-US', { weekday: 'long' }), task: currentTask || 'Work', project: 'General', duration: formatTime(seconds), time: `${fmt(startTime || now)} - ${fmt(now)}`, status: 'Verified' };
                return { ...prev, timeEntries: [entry, ...prev.timeEntries], timer: { isRunning: false, startTime: null, seconds: 0, currentTask: null } };
            }
            return { ...prev, timer: { isRunning: true, startTime: Date.now(), seconds: 0, currentTask: taskName } };
        });
    }, []);

    const addTimeEntry = useCallback((entry) => {
        setState(prev => ({ ...prev, timeEntries: [{ ...entry, id: Date.now() }, ...prev.timeEntries] }));
        addNotification('Time entry saved', 'success');
    }, [addNotification]);

    const updateTimeEntry = useCallback((id, updates) => {
        setState(prev => ({ ...prev, timeEntries: prev.timeEntries.map(e => e.id === id ? { ...e, ...updates } : e) }));
    }, []);

    const deleteTimeEntry = useCallback((id) => {
        setState(prev => ({ ...prev, timeEntries: prev.timeEntries.filter(e => e.id !== id) }));
    }, []);

    // Task Timer Actions
    const startTask = useCallback((taskId) => {
        setState(prev => ({
            ...prev,
            timer: {
                ...prev.timer,
                isRunning: true,
                currentTask: taskId,
                seconds: 0,
                startTime: new Date()
            }
        }));
        addNotification('Task tracking started', 'success');
    }, [addNotification]);

    const stopTask = useCallback(async () => {
        const { currentTask, seconds } = state.timer;
        if (currentTask && seconds > 0) {
            try {
                const currentEmp = state.employees.find(e => e.email === user?.email);
                await activityService.logActivity({
                    employeeId: currentEmp?.id || user?.id,
                    organizationId: currentEmp?.organizationId || user?.organizationId || 'default-org-id',
                    activityType: 'ACTIVE',
                    duration: seconds,
                    taskId: currentTask,
                    appWebsite: 'Web Dashboard'
                });
                // Sync tasks to reflect new time
                syncTasks();
            } catch (err) {
                console.error('Failed to log final task activity:', err);
            }
        }
        setState(prev => ({
            ...prev,
            timer: { ...prev.timer, isRunning: false, currentTask: null, seconds: 0 }
        }));
        addNotification('Task tracking stopped', 'success');
    }, [state.timer, user, state.employees, syncTasks, addNotification]);

    // Periodic Task Logging (every 60 seconds)
    useEffect(() => {
        let interval;
        if (state.timer.isRunning && state.timer.currentTask) {
            interval = setInterval(async () => {
                try {
                    const currentEmp = state.employees.find(e => e.email === user?.email);
                    await activityService.logActivity({
                        employeeId: currentEmp?.id || user?.id,
                        organizationId: currentEmp?.organizationId || user?.organizationId || 'default-org-id',
                        activityType: 'ACTIVE',
                        duration: 60,
                        taskId: state.timer.currentTask,
                        appWebsite: 'Web Dashboard (Heartbeat)'
                    });
                } catch (err) {
                    console.error('Task heartbeat failed:', err);
                }
            }, 60000);
        }
        return () => clearInterval(interval);
    }, [state.timer.isRunning, state.timer.currentTask, user, state.employees]);

    // Tasks
    // Tasks
    const addTask = useCallback(async (task) => {
        const tempId = `temp-${Date.now()}`;
        try {
            const statusMap = {
                'Backlog': 'BACKLOG',
                'In Operations': 'IN_OPERATIONS',
                'Quality Assurance': 'QUALITY_ASSURANCE',
                'Finalized': 'FINALIZED',
                'BACKLOG': 'BACKLOG',
                'IN_OPERATIONS': 'IN_OPERATIONS',
                'QUALITY_ASSURANCE': 'QUALITY_ASSURANCE',
                'FINALIZED': 'FINALIZED'
            };
            const backendTask = {
                name: task.title,
                projectId: task.projectId,
                employeeId: task.assigneeId,
                priority: task.priority?.toUpperCase() || 'MEDIUM',
                status: statusMap[task.status] || 'BACKLOG',
                dueDate: task.dueDate
            };

            // Optimistic Update
                const optimisticTask = {
                    id: tempId,
                    title: task.title,
                    project: task.project || 'Internal',
                    projectId: task.projectId,
                    priority: task.priority || 'Medium',
                    assignee: task.assignee || 'Unassigned',
                    assigneeId: task.assigneeId,
                    assigneeStatus: 'active', // New tasks are usually assigned to active users
                    status: mapStatus(task.status || 'BACKLOG'),
                progress: task.status?.toUpperCase() === 'FINALIZED' ? 100 : (task.status?.toUpperCase() === 'QUALITY_ASSURANCE' ? 80 : (task.status?.toUpperCase() === 'IN_OPERATIONS' ? 40 : 0)),
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : 'No Date',
                timeSpent: '0h',
                description: task.description || '',
                isOptimistic: true
            };

            setState(prev => ({ ...prev, tasks: [optimisticTask, ...prev.tasks] }));

            const res = await taskService.createTask(backendTask);
            if (res.success && res.data) {
                const b = res.data;
                const newTask = {
                    id: b.id,
                    title: b.name,
                    project: b.project?.name || task.project || 'Internal',
                    projectId: b.projectId,
                    priority: b.priority,
                    assignee: b.employee ? b.employee.fullName : (task.assignee || 'Unassigned'),
                    assigneeId: b.employeeId,
                    assigneeStatus: b.employee?.status?.toLowerCase() || 'offline',
                    status: mapStatus(b.status),
                    progress: b.status === 'FINALIZED' ? 100 : (b.status === 'QUALITY_ASSURANCE' ? 80 : (b.status === 'IN_OPERATIONS' ? 40 : 0)),
                    dueDate: b.dueDate ? b.dueDate.split('T')[0] : (task.dueDate || 'No Date'),
                    timeSpent: '0h',
                    description: b.description || ''
                };
                setState(prev => ({
                    ...prev,
                    tasks: prev.tasks.map(t => t.id === tempId ? newTask : t)
                }));
                addNotification(`Task "${newTask.title}" created`, 'success');
            } else {
                // Rollback
                setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== tempId) }));
                addNotification('Failed to create task', 'error');
            }
        } catch (error) {
            console.error('Failed to add task:', error);
            // Rollback
            setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== tempId) }));
        }
    }, [addNotification]);

    const updateTaskStatus = useCallback(async (taskId, status, progress) => {
        try {
            const statusMap = {
                'Backlog': 'BACKLOG',
                'In Operations': 'IN_OPERATIONS',
                'Quality Assurance': 'QUALITY_ASSURANCE',
                'Finalized': 'FINALIZED'
            };

            const backendStatus = statusMap[status] || 'BACKLOG';
            const res = await taskService.updateTaskStatus(taskId, backendStatus);

            if (res.success) {
                setState(prev => {
                    const task = prev.tasks.find(t => t.id === taskId);
                    if (!task) return prev;

                    let updatedEmployees = prev.employees;
                    if (status === 'Finalized' && task.status !== 'Finalized') {
                        updatedEmployees = prev.employees.map(e => {
                            if (e.id === task.assigneeId || e.name === task.assignee) {
                                const newScore = Math.min(99, (e.productivityScore || 85) + 2);
                                return { ...e, productivityScore: newScore };
                            }
                            return e;
                        });
                    }

                    return {
                        ...prev,
                        employees: updatedEmployees,
                        tasks: prev.tasks.map(t => t.id === taskId ? { 
                            ...t, 
                            status: mapStatus(status), 
                            progress: progress ?? (status === 'Finalized' ? 100 : (status === 'Quality Assurance' ? 80 : (status === 'In Operations' ? 40 : 0))) 
                        } : t)
                    };
                });
                if (status === 'Finalized') {
                    addNotification(`Task finalized! Productivity score increased for assignee.`, 'success');
                }
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    }, [addNotification]);

    const deleteTask = useCallback(async (id) => {
        try {
            const res = await taskService.deleteTask(id);
            if (res.success) {
                setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
                addNotification('Task deleted', 'info');
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
            // Error is handled by apiClient global toast
        }
    }, [addNotification]);

    const updateTask = useCallback(async (id, taskData) => {
        try {
            const statusMap = {
                'Backlog': 'BACKLOG',
                'In Operations': 'IN_OPERATIONS',
                'Quality Assurance': 'QUALITY_ASSURANCE',
                'Finalized': 'FINALIZED',
                // Also accept uppercase as keys
                'BACKLOG': 'BACKLOG',
                'IN_OPERATIONS': 'IN_OPERATIONS',
                'QUALITY_ASSURANCE': 'QUALITY_ASSURANCE',
                'FINALIZED': 'FINALIZED'
            };
            const backendPayload = {
                name: taskData.title,
                priority: taskData.priority?.toUpperCase() || 'MEDIUM',
                status: statusMap[taskData.status] || taskData.status || undefined,
                dueDate: taskData.dueDate && taskData.dueDate !== 'No Date' ? new Date(taskData.dueDate).toISOString() : undefined,
                employeeId: taskData.assigneeId || undefined,
            };
            const res = await taskService.updateTask(id, backendPayload);
            if (res.success) {
                setState(prev => ({
                    ...prev,
                    tasks: prev.tasks.map(t => {
                        if (t.id === id) {
                            const updatedStatus = mapStatus(taskData.status || t.status);
                            return { 
                                ...t, 
                                ...taskData,
                                status: updatedStatus,
                                progress: taskData.progress ?? (updatedStatus === 'Finalized' ? 100 : (updatedStatus === 'Quality Assurance' ? 80 : (updatedStatus === 'In Operations' ? 40 : t.progress)))
                            };
                        }
                        return t;
                    })
                }));
                addNotification(`Task "${taskData.title}" updated`, 'success');
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }, [addNotification]);

    // Projects
    const addProject = useCallback((project) => {
        const id = Date.now();
        const p = {
            ...project,
            id,
            progress: 0,
            color: project.color || 'bg-indigo-500',
            status: 'Planning',
            taskCount: 5 + Math.floor(Math.random() * 5)
        };

        // Generate dummy tasks for this project
        const projectTasks = [];
        const currentEmployees = state.employees;
        for (let i = 0; i < p.taskCount; i++) {
            const emp = currentEmployees[i % currentEmployees.length];
            projectTasks.push({
                id: `ptk-${id}-${i}`,
                title: `${project.name} Phase ${i + 1}`,
                project: project.name,
                priority: i === 0 ? 'High' : 'Medium',
                assignee: emp.name,
                assigneeId: emp.id,
                team: emp.team,
                status: i < 2 ? 'Finalized' : 'Backlog',
                progress: i < 2 ? 100 : 0,
                timeSpent: `${Math.floor(Math.random() * 8) + 2}h`,
                dueDate: '2026-03-15'
            });
        }

        setState(prev => ({
            ...prev,
            projects: [p, ...prev.projects],
            tasks: [...projectTasks, ...prev.tasks]
        }));
        addNotification(`Project "${project.name}" initialized with ${p.taskCount} tasks`, 'success');
    }, [addNotification, state.employees]);

    // Screenshots
    const deleteScreenshot = useCallback(async (id) => {
        try {
            await screenshotService.deleteScreenshot(id);
            setState(prev => ({ ...prev, screenshots: prev.screenshots.filter(s => s.id !== id) }));
        } catch (error) {
            console.error('Failed to delete screenshot:', error);
            throw error;
        }
    }, []);

    // Location / Geofences
    const addGeofence = useCallback((zone) => {
        setState(prev => ({ ...prev, geofences: [...prev.geofences, { ...zone, id: Date.now() }] }));
        addNotification('Geofence zone added', 'success');
    }, [addNotification]);

    const toggleGeofence = useCallback((id) => {
        setState(prev => ({ ...prev, geofences: prev.geofences.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g) }));
    }, []);

    // Leave
    const addLeaveRequest = useCallback((request) => {
        const r = { id: Date.now(), ...request, status: 'Pending', color: 'bg-amber-50 text-amber-600' };
        setState(prev => ({ ...prev, leaveRequests: [r, ...prev.leaveRequests] }));
        addNotification(`Leave request for ${request.name} submitted`, 'success');
    }, [addNotification]);

    const updateLeaveStatus = useCallback((id, status) => {
        const color = status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600';
        setState(prev => ({ ...prev, leaveRequests: prev.leaveRequests.map(r => r.id === id ? { ...r, status, color } : r) }));
        addNotification(`Leave status updated to ${status}`, 'info');
    }, [addNotification]);

    const deleteLeaveRequest = useCallback((id) => {
        setState(prev => ({ ...prev, leaveRequests: prev.leaveRequests.filter(r => r.id !== id) }));
    }, []);

    // Alerts
    const dismissAlert = useCallback((id) => {
        setState(prev => ({ ...prev, alerts: prev.alerts.map(a => a.id === id ? { ...a, read: true } : a) }));
    }, []);

    const dismissAllAlerts = useCallback(() => {
        setState(prev => ({ ...prev, alerts: prev.alerts.map(a => ({ ...a, read: true })) }));
    }, []);

    // Compliance
    const updateComplianceSetting = useCallback((key, value) => {
        setState(prev => ({ ...prev, complianceSettings: { ...prev.complianceSettings, [key]: value } }));
        addNotification(`Compliance setting "${key}" updated`, 'success');
    }, [addNotification]);

    // Date filter
    const setSelectedDate = useCallback((date) => {
        setState(prev => ({ ...prev, selectedDate: date }));
    }, []);

    // Notifications
    const markAllNotificationsRead = useCallback(() => {
        setState(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, unread: false })) }));
    }, []);
    const markNotificationAsRead = useCallback((id) => {
        setState(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, unread: false } : n) }));
    }, []);
    const deleteNotification = useCallback((id) => {
        setState(prev => ({ ...prev, notifications: prev.notifications.filter(n => n.id !== id) }));
    }, []);

    // Goals Actions
    const addGoal = useCallback(async (goalData) => {
        try {
            const res = await goalService.createGoal(goalData);
            if (res.success) {
                setState(prev => ({ ...prev, goals: [res.data, ...prev.goals] }));
                addNotification(`Goal "${goalData.title}" set`, 'success');
                return res.data;
            }
        } catch (error) {
            console.error('Failed to add goal:', error);
            // Error is handled by apiClient global toast
        }
    }, [addNotification]);

    const deleteGoal = useCallback(async (id) => {
        try {
            const res = await goalService.deleteGoal(id);
            if (res.success) {
                setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
                addNotification('Goal deleted', 'info');
            }
        } catch (error) {
            console.error('Failed to delete goal:', error);
            // Error is handled by apiClient global toast
        }
    }, [addNotification]);

    const updateGoal = useCallback(async (id, goalData) => {
        try {
            const res = await goalService.updateGoal(id, goalData);
            if (res.success) {
                setState(prev => ({
                    ...prev,
                    goals: prev.goals.map(g => g.id === id ? res.data : g)
                }));
                addNotification(`Goal "${goalData.title}" updated`, 'success');
            }
        } catch (error) {
            console.error('Failed to update goal:', error);
            // Error is handled by apiClient global toast
        }
    }, [addNotification]);

    // CheckIns
    const addCheckIn = useCallback((checkIn) => {
        setState(prev => ({ ...prev, checkIns: [{ ...checkIn, id: Date.now() }, ...prev.checkIns] }));
    }, []);

    // Filtered data based on role
    const filteredData = useMemo(() => {
        const currentEmployees = stats.empMetrics; 

        if (!isAuthenticated || role === 'ADMIN' || role === 'MANAGER') {
            return {
                employees: currentEmployees,
                tasks: state.tasks,
                projects: state.projects,
                goals: state.goals,
                teams: state.teams,
                activityLogs: state.activityLogs,
            };
        }

        if (role === 'EMPLOYEE') {
            const targetEmail = user?.email;
            const filteredEmployees = currentEmployees.filter(e => e.email === targetEmail);
            return {
                employees: filteredEmployees,
                tasks: state.tasks.filter(t => t.assigneeId === filteredEmployees[0]?.id),
                projects: state.projects.filter(p => p.employees?.includes(filteredEmployees[0]?.id)),
                goals: state.goals.filter(g => g.stakeholders?.some(s => s.employeeId === filteredEmployees[0]?.id)),
                teams: [],
                activityLogs: state.activityLogs.filter(l => l.employeeId === filteredEmployees[0]?.id),
            };
        }

        return { ...state, employees: currentEmployees };
    }, [state, role, isAuthenticated, stats.empMetrics, user]);

    const contextValue = useMemo(() => ({
        // State
        ...state,
        ...filteredData, // Inject filtered lists
        stats,
        isLoading,
        // Actions
        addEmployee, updateEmployee, deleteEmployee, mergeEmployees,
        addTeam, updateTeam, deleteTeam,
        toggleTimer, startTimer, stopTimer, pauseTimer,
        startTask, stopTask, timer: state.timer,
        addTimeEntry, updateTimeEntry, deleteTimeEntry,
        addTask, updateTaskStatus, deleteTask, updateTask,
        addProject,
        addGoal, deleteGoal, updateGoal,
        deleteScreenshot,
        addGeofence, toggleGeofence,
        addLeaveRequest, updateLeaveStatus, deleteLeaveRequest,
        dismissAlert, dismissAllAlerts,
        updateComplianceSetting,
        setSelectedDate,
        addCheckIn,
        addNotification, markAllNotificationsRead, markNotificationAsRead, deleteNotification,
        socket: socketInstance,
    }), [
        state, filteredData, stats, isLoading, socketInstance,
        addEmployee, updateEmployee, deleteEmployee, mergeEmployees,
        addTeam, updateTeam, deleteTeam,
        toggleTimer, startTimer, stopTimer, pauseTimer,
        startTask, stopTask,
        addTimeEntry, updateTimeEntry, deleteTimeEntry,
        addTask, updateTaskStatus, deleteTask, updateTask,
        addProject, addGoal, deleteGoal, updateGoal, deleteScreenshot, addGeofence, toggleGeofence,
        addLeaveRequest, updateLeaveStatus, deleteLeaveRequest,
        dismissAlert, dismissAllAlerts, updateComplianceSetting,
        setSelectedDate, addCheckIn,
        addNotification, markAllNotificationsRead, markNotificationAsRead, deleteNotification,
    ]);

    return (
        <RealTimeContext.Provider value={contextValue}>
            {children}
        </RealTimeContext.Provider>
    );
}

export const useRealTime = () => useContext(RealTimeContext);
