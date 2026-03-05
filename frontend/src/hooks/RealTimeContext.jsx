import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import {
    buildAttendanceLogs,
    buildActivityLogs,
    buildAppUsageLogs,
    buildLocationLogs,
    buildScreenshots,
    buildTasks,
    buildAlerts,
    buildPayrollData
} from '../data/seedEngine';

const RealTimeContext = createContext();
const STORAGE_KEY = 'ems_state_v5'; // bumped to force fresh seed update

const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const TODAY = new Date('2026-02-28').toISOString().split('T')[0];

export function RealTimeProvider({ children }) {
    // Generate seed data once on module load
    const seedData = useMemo(() => generateSeedData(), []);

    const [state, setState] = useState({
        employees: seedData.employees,
        tasks: seedData.tasks,
        projects: seedData.projects,
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

    // Auto-refresh: every 20s randomly mutate a few employee statuses + GPS positions
    useEffect(() => {
        if (isLoading) return;
        const interval = setInterval(() => {
            setState(prev => {
                const statuses = ['online', 'online', 'online', 'idle', 'offline'];
                const updatedEmployees = prev.employees.map(e => {
                    // 10% chance to change online status
                    if (Math.random() > 0.90) {
                        return { ...e, status: statuses[Math.floor(Math.random() * statuses.length)] };
                    }
                    return e;
                });

                // Drift GPS slightly and toggle state
                const updatedLocations = prev.locationLogs.map(l => {
                    const isMoving = Math.random() > 0.4;
                    const drift = isMoving ? (Math.random() - 0.5) * 0.002 : 0;
                    return {
                        ...l,
                        lat: l.lat + drift,
                        lng: l.lng + drift,
                        status: isMoving ? 'moving' : 'stationary',
                        speed: isMoving ? `${Math.floor(Math.random() * 30) + 10} km/h` : '0 km/h',
                        lastSync: 'Just now',
                    };
                });

                return { ...prev, employees: updatedEmployees, locationLogs: updatedLocations };
            });
        }, 20000);
        return () => clearInterval(interval);
    }, [isLoading]);

    // ─── COMPUTED ANALYTICS ──────────────────────────────────────────────────

    const stats = useMemo(() => {
        const { employees, activityLogs, selectedDate } = state;
        const live = liveEmployeeStats(employees);
        const summary = computeSummaryStats(activityLogs, selectedDate);
        const trend = weeklyProductivityTrend(activityLogs);
        const intraday = intradayActivity(activityLogs, selectedDate);
        const appUsage = appUsageByCategory(state.appUsageLogs, 7);

        // Team breakdown
        const teamBreakdown = ['Engineering', 'Sales', 'HR', 'Operations'].map(name => ({
            name,
            productivity: teamProductivity(employees, name, activityLogs),
            active: employees.filter(e => e.team === name && e.status === 'online').length,
            total: employees.filter(e => e.team === name).length,
        }));

        // Top productive / unproductive employees (by today's logs)
        const todayLogs = activityLogs.filter(l => l.date === selectedDate);
        const empMetrics = employees.map(emp => {
            const log = todayLogs.find(l => l.employeeId === emp.id);
            return {
                ...emp,
                initials: emp.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                team: emp.team || 'General',
                productive: log ? `${String(Math.floor(log.productiveHours)).padStart(2, '0')}:${String(Math.round((log.productiveHours % 1) * 60)).padStart(2, '0')}` : '00:00',
                unproductive: log ? `${String(Math.floor(log.unproductiveHours)).padStart(2, '0')}:${String(Math.round((log.unproductiveHours % 1) * 60)).padStart(2, '0')}` : '00:00',
                utilization: log ? log.utilizationPct : emp.utilizationScore || 75,
                productivity: log ? log.productivityPct : emp.productivityScore || 75,
                productiveHours: log?.productiveHours || 0,
                unproductiveHours: log?.unproductiveHours || 0,
            };
        });

        const totalPayroll = state.payrollData.reduce((s, p) => s + p.grossPayValue, 0);
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
    const addTask = useCallback((task) => {
        const t = { ...task, id: Date.now(), status: task.status || 'To Do', progress: 0 };
        setState(prev => ({ ...prev, tasks: [t, ...prev.tasks] }));
        addNotification(`Task "${task.title}" created`, 'success');
    }, [addNotification]);

    const updateTaskStatus = useCallback((taskId, status, progress) => {
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
    }, [addNotification]);

    const deleteTask = useCallback((id) => {
        setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    }, []);

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
        if (!isAuthenticated || role === 'Admin') {
            return {
                employees: state.employees,
                tasks: state.tasks,
                projects: state.projects,
                teams: state.teams,
                activityLogs: state.activityLogs,
            };
        }

        if (role === 'Manager') {
            // Managers see employees in their assigned teams (simulated first 2 teams)
            const allowedTeamIds = state.teams.slice(0, 2).map(t => t.id);
            const filteredEmployees = state.employees.filter(e => allowedTeamIds.includes(e.teamId));
            return {
                employees: filteredEmployees,
                tasks: state.tasks.filter(t => filteredEmployees.find(e => e.id === t.employeeId)),
                projects: state.projects, 
                teams: state.teams.filter(t => allowedTeamIds.includes(t.id)),
                activityLogs: state.activityLogs.filter(l => filteredEmployees.find(e => e.id === l.employeeId)),
            };
        }

        if (role === 'Employee') {
            // Employees see only themselves (simulated as Alex Johnson for now)
            const targetId = 1; 
            return {
                employees: state.employees.filter(e => e.id === targetId),
                tasks: state.tasks.filter(t => t.employeeId === targetId),
                projects: state.projects.filter(p => p.employees?.includes(targetId)),
                teams: [], 
                activityLogs: state.activityLogs.filter(l => l.employeeId === targetId),
            };
        }

        return state;
    }, [state, role, isAuthenticated]);

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
        addTask, updateTaskStatus, deleteTask,
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
        addTask, updateTaskStatus, deleteTask,
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
