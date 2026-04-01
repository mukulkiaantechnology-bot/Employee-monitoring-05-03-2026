import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';
import { toast } from '../utils/toastManager';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            role: null, // "ADMIN" | "MANAGER" | "EMPLOYEE"
            isAuthenticated: false,
            token: null,
            activeAttendance: null, // Track active work session
            isClockedIn: false,
            isOnBreak: false,
            isTrackerActive: false,

            setSession: (userData) => {
                const user = userData.user || userData;
                set({
                    user: user,
                    role: user.role?.toUpperCase(),
                    isAuthenticated: true,
                    token: localStorage.getItem('token'),
                    agentStatus: user.agentStatus,
                    activeAttendance: user.activeAttendance || null,
                    isClockedIn: !!user.activeAttendance,
                    isOnBreak: user.status === 'BREAK'
                });
            },

            login: async (email, password) => {
                try {
                    const response = await authService.login(email, password);
                    if (response.success) {
                        const userData = response.data.user;
                        set({
                            user: userData,
                            role: userData.role?.toUpperCase(),
                            isAuthenticated: true,
                            token: response.data.token,
                            agentStatus: userData.agentStatus,
                            activeAttendance: userData.activeAttendance || null,
                            isClockedIn: !!userData.activeAttendance,
                            isOnBreak: userData.status === 'BREAK',
                            isTrackerActive: false
                        });
                        toast.success('Login successful');
                        return response.data;
                    }
                    throw new Error(response.message);
                } catch (error) {
                    throw error;
                }
            },

            logout: async () => {
                await authService.logout();
                set({ user: null, role: null, isAuthenticated: false, token: null, activeAttendance: null, isClockedIn: false, isOnBreak: false, isTrackerActive: false });
            },

            switchRole: (newRole) => {
                set((state) => ({
                    role: newRole,
                    user: state.user ? { ...state.user, role: newRole } : null
                }));
            },

            // Attendance Actions
            clockIn: async () => {
                const { default: attendanceService } = await import('../services/attendanceService');
                try {
                    const response = await attendanceService.clockIn();
                    if (response.success) {
                        set({ activeAttendance: response.data, isClockedIn: true });
                        toast.success('Work session started');
                    }
                    return response;
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to clock in');
                    throw error;
                }
            },

            clockOut: async () => {
                const { default: attendanceService } = await import('../services/attendanceService');
                try {
                    const response = await attendanceService.clockOut();
                    if (response.success) {
                        set({ activeAttendance: null, isClockedIn: false, isOnBreak: false });
                        toast.success('Work session ended');
                    }
                    return response;
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to clock out');
                    throw error;
                }
            },

            toggleBreak: async () => {
                const { default: attendanceService } = await import('../services/attendanceService');
                const isOnBreak = get().isOnBreak;
                try {
                    let response;
                    if (!isOnBreak) {
                        response = await attendanceService.startBreak();
                        if (response.success) {
                            set({ isOnBreak: true });
                            toast.success('Break started');
                        }
                    } else {
                        response = await attendanceService.endBreak();
                        if (response.success) {
                            set({ isOnBreak: false });
                            toast.success('Break ended');
                        }
                    }
                    return response;
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to toggle break');
                    throw error;
                }
            },
            setTrackerActive: (status) => set({ isTrackerActive: status }),

            hasAccess: (moduleKey) => {
                const role = get().role?.toUpperCase();
                const roleModules = {
                    ADMIN: [
                        "dashboard", "realtime", "alerts", "employees", "teams",
                        "screenshots", "timeAttendance", "activity", "projects",
                        "tasks", "payroll", "compliance", "reports", "settings"
                    ],
                    MANAGER: [
                        "dashboard", "realtime", "alerts", "employees", "teams", 
                        "screenshots", "timeAttendance", "activity", "projects",
                        "tasks", "reports"
                    ],
                    EMPLOYEE: [
                        "dashboard", "timeAttendance", "tasks", "screenshots"
                    ]
                };
                if (!role) return false;
                return roleModules[role]?.includes(moduleKey) || false;
            }
        }),
        {
            name: 'ems-auth-storage',
        }
    )
);
