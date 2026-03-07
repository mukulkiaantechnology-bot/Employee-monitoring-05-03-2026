import { create } from 'zustand';
import analyticsService from '../services/analyticsService';

const useAnalyticsStore = create((set, get) => ({
    // State
    dashboardMetrics: null,
    timelineData: [],
    topEmployees: { topProductiveEmployees: [], topUnproductiveEmployees: [] },
    topTeams: { topProductiveTeams: [], topUnproductiveTeams: [] },
    categoryBreakdown: [],
    appUsage: [],
    loading: false,
    error: null,

    // Fetch all dashboard data
    fetchDashboard: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const res = await analyticsService.getDashboard(params);
            if (res.success) set({ dashboardMetrics: res.data });
        } catch (err) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchTimeline: async (params = {}) => {
        try {
            const res = await analyticsService.getTimeline(params);
            if (res.success) set({ timelineData: res.data });
        } catch (err) {
            console.error('Timeline fetch error:', err);
        }
    },

    fetchTopEmployees: async (params = {}) => {
        try {
            const res = await analyticsService.getTopEmployees(params);
            if (res.success) set({ topEmployees: res.data });
        } catch (err) {
            console.error('Top employees fetch error:', err);
        }
    },

    fetchTopTeams: async (params = {}) => {
        try {
            const res = await analyticsService.getTopTeams(params);
            if (res.success) set({ topTeams: res.data });
        } catch (err) {
            console.error('Top teams fetch error:', err);
        }
    },

    fetchCategoryBreakdown: async (params = {}) => {
        try {
            const res = await analyticsService.getCategoryBreakdown(params);
            if (res.success) set({ categoryBreakdown: res.data });
        } catch (err) {
            console.error('Category breakdown fetch error:', err);
        }
    },

    fetchAppUsage: async (params = {}) => {
        try {
            const res = await analyticsService.getApps(params);
            if (res.success) set({ appUsage: res.data });
        } catch (err) {
            console.error('App usage fetch error:', err);
        }
    },

    // Fetch all at once
    fetchAll: async (params = {}) => {
        const store = get();
        await Promise.allSettled([
            store.fetchDashboard(params),
            store.fetchTimeline(params),
            store.fetchTopEmployees(params),
            store.fetchTopTeams(params),
            store.fetchCategoryBreakdown(params),
            store.fetchAppUsage(params),
        ]);
    },
}));

export default useAnalyticsStore;
