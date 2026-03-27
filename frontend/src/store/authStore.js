import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            role: null, // "ADMIN" | "MANAGER" | "EMPLOYEE"
            isAuthenticated: false,
            token: null,

            setSession: (userData) => {
                const user = userData.user || userData;
                set({
                    user: user,
                    role: user.role?.toUpperCase(),
                    isAuthenticated: true,
                    token: localStorage.getItem('token')
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
                            token: response.data.token
                        });
                        return response.data;
                    }
                    throw new Error(response.message);
                } catch (error) {
                    throw error;
                }
            },

            logout: async () => {
                await authService.logout();
                set({ user: null, role: null, isAuthenticated: false, token: null });
            },

            switchRole: (newRole) => {
                set((state) => ({
                    role: newRole,
                    user: state.user ? { ...state.user, role: newRole } : null
                }));
            },

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
