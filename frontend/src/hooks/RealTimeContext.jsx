import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { generateSeedData } from '../data/seedEngine';
import {
    intradayActivity,
    computeSummaryStats,
    liveEmployeeStats,
    weeklyProductivityTrend,
    checkAlertThresholds,
    appUsageByCategory,
    teamProductivity,
} from '../store/analyticsEngine';
import { useAuthStore } from '../store/authStore';
import { useFilterStore } from '../store/filterStore';
import employeeService from '../services/employeeService';
import activityService from '../services/activityService';
import teamService from '../services/teamService';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
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

export function RealTimeProvider({ children }) {
    // Generate seed data once on module load
    const seedData = useMemo(() => generateSeedData(), []);

    const [state, setState] = useState({
        employees: seedData.employees,
        tasks: [],
        projects: [],
        teams: seedData.teams,
        // Logs
        activityLogs: seedData.activityLogs,
        attendanceLogs: seedData.attendanceLogs,
        appUsageLogs: seedData.appUsageLogs,
        locationLogs: seedData.locationLogs,
        payrollData: seedData.payrollData,
        // UI state
        timeEntries: [],
        notifications: [],
        alerts: seedData.alerts,
        screenshots: seedData.screenshots,
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
        checkIns: seedData.locationLogs.slice(0, 5).map((l, i) => ({
            id: i + 1, employeeId: l.employeeId, name: l.name,
            location: 'Headquarters', type: i < 3 ? 'in' : 'out', time: `0${9 + i}:00 AM`,
        })),
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

    const [activeToast, setActiveToast] = useState(null);
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

    // Live backend employee sync
    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        const syncEmployees = async () => {
            try {
                const res = await employeeService.getEmployees();
                if (res.success && res.data) {
                    setState(prev => {
                        const backendEmployees = res.data.map(emp => {
                            const name = emp.fullName || emp.name || 'Unknown User';
                            return {
                                ...emp,
                                name: name,
                                initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
                                team: emp.team?.name || emp.team || 'General',
                                status: emp.status?.toLowerCase() || 'offline',
                            };
                        });
                        return { ...prev, employees: backendEmployees };
                    });
                }
            } catch (err) {
                console.error('Failed to sync employees:', err);
            }
        };

        syncEmployees();
    }, [isLoading, isAuthenticated]);

    // Live backend team sync
    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        const syncTeams = async () => {
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
        };

        syncTeams();
    }, [isLoading, isAuthenticated]);

    // Live backend activity sync
    const { dateRange, selectedTeam, selectedEmployee } = useFilterStore();

    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        const syncLogs = async () => {
            try {
                const params = {
                    startDate: dateRange.start,
                    endDate: dateRange.end,
                    teamId: selectedTeam,
                    employeeId: selectedEmployee
                };
                const res = await activityService.getOrganizationSummary(params);
                if (res.success && res.data) {
                    setState(prev => ({
                        ...prev,
                        activityLogs: res.data
                    }));
                }
            } catch (err) {
                console.error('Failed to sync activity logs:', err);
            }
        };

        const interval = setInterval(syncLogs, 30000); // Sync every 30s
        syncLogs(); // Initial sync

        return () => clearInterval(interval);
    }, [isLoading, isAuthenticated, dateRange, selectedTeam, selectedEmployee]);

    // WebSocket Integration
    useEffect(() => {
        if (isLoading || !isAuthenticated || !user) return;

        const socket = io(SOCKET_URL, {
            auth: { token: useAuthStore.getState().token },
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('RealTimeContext: Connected to socket');
            
            // Fetch initial online statuses
            const fetchOnline = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/monitoring/online`, {
                        headers: { Authorization: `Bearer ${useAuthStore.getState().token}` }
                    });
                    if (res.data.success) {
                        setState(prev => ({
                            ...prev,
                            employees: prev.employees.map(e => {
                                const isOnline = res.data.data.some(oe => oe.id === e.id);
                                return { ...e, status: isOnline ? 'online' : 'offline' };
                            })
                        }));
                    }
                } catch (err) {
                    console.error('Failed to fetch online employees:', err);
                }
            };
            fetchOnline();
        });

        socket.on('employee:status', ({ employeeId, status }) => {
            setState(prev => ({
                ...prev,
                employees: prev.employees.map(e => 
                    e.id === employeeId ? { ...e, status: status.toLowerCase() } : e
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

        return () => socket.disconnect();
    }, [isLoading, isAuthenticated, user]);

    // Live backend tasks sync
    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        const syncTasks = async () => {
            try {
                const res = await taskService.getTasks();
                if (res.success && res.data) {
                    setState(prev => ({
                        ...prev,
                        tasks: res.data.map(task => ({
                            id: task.id,
                            title: task.name,
                            project: task.project.name,
                            projectId: task.projectId,
                            priority: task.priority,
                            assignee: task.employee ? task.employee.fullName : 'Unassigned',
                            assigneeId: task.employeeId,
                            status: task.status === 'BACKLOG' ? 'To Do' : (task.status === 'IN_PROGRESS' ? 'In Progress' : (task.status === 'QA' ? 'Review' : 'Completed')),
                            progress: task.status === 'COMPLETED' ? 100 : (task.status === 'QA' ? 80 : (task.status === 'IN_PROGRESS' ? 40 : 0)),
                            dueDate: task.dueDate ? task.dueDate.split('T')[0] : 'No Date',
                            timeSpent: '0h' // Simplified for now
                        }))
                    }));
                }
            } catch (err) {
                console.error('Failed to sync tasks:', err);
            }
        };

        const interval = setInterval(syncTasks, 30000);
        syncTasks();

        return () => clearInterval(interval);
    }, [isLoading, isAuthenticated]);

    // Live backend projects sync
    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        const syncProjects = async () => {
            try {
                const res = await projectService.getProjects();
                if (res.success && res.data) {
                    setState(prev => {
                        const backendProjects = res.data.map(p => ({
                            id: p.id,
                            name: p.projectName || p.name,
                            client: p.client || 'Internal',
                            progress: parseInt(p.progress) || 0,
                            status: p.status || 'Active',
                            color: p.color || 'bg-indigo-500',
                            taskCount: p.tasks || 0,
                            memberIds: p.assignments?.map(a => a.employeeId) || [],
                            isSeed: false
                        }));

                        return { ...prev, projects: backendProjects };
                    });
                }
            } catch (err) {
                console.error('Failed to sync projects:', err);
            }
        };

        const interval = setInterval(syncProjects, 30000);
        syncProjects();

        return () => clearInterval(interval);
    }, [isLoading, isAuthenticated]);


    // ─── COMPUTED ANALYTICS ──────────────────────────────────────────────────

    const stats = useMemo(() => {
        const { employees, activityLogs, selectedDate } = state;

        // 1. Calculate empMetrics FIRST (today's logs for each employee)
        const todayLogs = activityLogs.filter(l => l.date === selectedDate);
        const empMetrics = employees.map(emp => {
            const log = todayLogs.find(l => l.employeeId === emp.id);
            const fullName = emp.fullName || emp.name || 'Unknown User';

            // Determine status based on presence of log today
            let status = emp.status || 'offline';
            if (log) {
                status = log.activeHours > 0 ? 'online' : (log.idleHours > 0 ? 'idle' : 'offline');
            }

            return {
                ...emp,
                name: fullName,
                initials: fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
                team: emp.team?.name || emp.team || 'General',
                status,
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
        setActiveToast(n);
        setTimeout(() => setActiveToast(null), 3500);
    }, []);

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

    // Tasks
    const addTask = useCallback(async (task) => {
        try {
            // Map frontend statuses back to backend enums
            const statusMap = {
                'To Do': 'BACKLOG',
                'In Progress': 'IN_PROGRESS',
                'Review': 'QA',
                'Completed': 'COMPLETED'
            };

            const backendTask = {
                name: task.title,
                projectId: task.projectId,
                employeeId: task.assigneeId,
                priority: task.priority?.toUpperCase() || 'MEDIUM',
                status: statusMap[task.status] || 'BACKLOG',
                dueDate: task.dueDate
            };

            const res = await taskService.createTask(backendTask);
            if (res.success) {
                const newTask = {
                    ...task,
                    id: res.data.id,
                    status: task.status || 'To Do'
                };
                setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
                addNotification(`Task "${task.title}" created`, 'success');
            }
        } catch (error) {
            console.error('Failed to add task:', error);
            addNotification('Failed to create task', 'alert');
        }
    }, [addNotification]);

    const updateTaskStatus = useCallback(async (taskId, status, progress) => {
        try {
            // Map frontend statuses back to backend enums
            const statusMap = {
                'To Do': 'BACKLOG',
                'In Progress': 'IN_PROGRESS',
                'Review': 'QA',
                'Completed': 'COMPLETED'
            };

            const backendStatus = statusMap[status] || 'BACKLOG';
            const res = await taskService.updateTaskStatus(taskId, backendStatus);

            if (res.success) {
                setState(prev => {
                    const task = prev.tasks.find(t => t.id === taskId);
                    if (!task) return prev;

                    // If task is moving to Completed, boost assignee productivity
                    let updatedEmployees = prev.employees;
                    if (status === 'Completed' && task.status !== 'Completed') {
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
                        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status, progress: progress ?? (status === 'Completed' ? 100 : t.progress) } : t)
                    };
                });
                if (status === 'Completed') {
                    addNotification(`Task completed! Productivity score increased for assignee.`, 'success');
                }
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
            addNotification('Failed to update task status', 'alert');
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
            addNotification('Failed to delete task', 'alert');
        }
    }, [addNotification]);

    const updateTask = useCallback(async (id, taskData) => {
        try {
            const statusMap = {
                'To Do': 'BACKLOG',
                'In Progress': 'IN_PROGRESS',
                'Review': 'QA',
                'Completed': 'COMPLETED'
            };
            const backendPayload = {
                name: taskData.title,
                priority: taskData.priority?.toUpperCase() || 'MEDIUM',
                status: statusMap[taskData.status] || undefined,
                dueDate: taskData.dueDate || undefined,
                employeeId: taskData.assigneeId || undefined,
            };
            const res = await taskService.updateTask(id, backendPayload);
            if (res.success) {
                setState(prev => ({
                    ...prev,
                    tasks: prev.tasks.map(t => t.id === id ? { ...t, ...taskData } : t)
                }));
                addNotification(`Task "${taskData.title}" updated`, 'success');
            }
        } catch (error) {
            console.error('Failed to update task:', error);
            addNotification('Failed to update task', 'alert');
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
                status: i < 2 ? 'Completed' : 'To Do',
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
    const deleteScreenshot = useCallback((id) => {
        setState(prev => ({ ...prev, screenshots: prev.screenshots.filter(s => s.id !== id) }));
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

    // CheckIns
    const addCheckIn = useCallback((checkIn) => {
        setState(prev => ({ ...prev, checkIns: [{ ...checkIn, id: Date.now() }, ...prev.checkIns] }));
    }, []);

    // Filtered data based on role
    const filteredData = useMemo(() => {
        const currentEmployees = stats.empMetrics; // Use enriched employees

        if (!isAuthenticated || role === 'ADMIN' || role === 'MANAGER') {
            return {
                employees: currentEmployees,
                tasks: state.tasks,
                projects: state.projects,
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
                teams: [],
                activityLogs: state.activityLogs.filter(l => l.employeeId === filteredEmployees[0]?.id),
            };
        }

        return { ...state, employees: currentEmployees };
    }, [state, role, isAuthenticated, stats.empMetrics]);

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
        addTimeEntry, updateTimeEntry, deleteTimeEntry,
        addTask, updateTaskStatus, deleteTask, updateTask,
        addProject,
        deleteScreenshot,
        addGeofence, toggleGeofence,
        addLeaveRequest, updateLeaveStatus, deleteLeaveRequest,
        dismissAlert, dismissAllAlerts,
        updateComplianceSetting,
        setSelectedDate,
        addCheckIn,
        addNotification, markAllNotificationsRead, markNotificationAsRead, deleteNotification,
    }), [
        state, filteredData, stats, isLoading,
        addEmployee, updateEmployee, deleteEmployee, mergeEmployees,
        addTeam, updateTeam, deleteTeam,
        toggleTimer, startTimer, stopTimer, pauseTimer,
        addTimeEntry, updateTimeEntry, deleteTimeEntry,
        addTask, updateTaskStatus, deleteTask, updateTask,
        addProject, deleteScreenshot, addGeofence, toggleGeofence,
        addLeaveRequest, updateLeaveStatus, deleteLeaveRequest,
        dismissAlert, dismissAllAlerts, updateComplianceSetting,
        setSelectedDate, addCheckIn,
        addNotification, markAllNotificationsRead, markNotificationAsRead, deleteNotification,
    ]);

    return (
        <RealTimeContext.Provider value={contextValue}>
            {children}
            {activeToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
                    <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md font-bold text-sm ${activeToast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
                        activeToast.type === 'alert' ? 'bg-red-500/90 border-red-400 text-white' :
                            'bg-slate-900/90 border-slate-700 text-white'
                        }`}>
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        {activeToast.title}
                    </div>
                </div>
            )}
        </RealTimeContext.Provider>
    );
}

export const useRealTime = () => useContext(RealTimeContext);
