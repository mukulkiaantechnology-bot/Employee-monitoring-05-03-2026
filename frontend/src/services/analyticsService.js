import apiClient from './apiClient';

const analyticsService = {
    /**
     * GET /api/analytics/dashboard
     * Returns: workTime, activeTime, idleTime, manualTime, productiveTime, unproductiveTime, neutralTime, utilization
     */
    getDashboard: async (params = {}) => {
        const res = await apiClient.get('/analytics/dashboard', { params });
        return res.data;
    },

    /**
     * GET /api/analytics/timeline
     * Returns: array of { hour, activeTime, idleTime, manualTime }
     */
    getTimeline: async (params = {}) => {
        const res = await apiClient.get('/analytics/timeline', { params });
        return res.data;
    },

    /**
     * GET /api/analytics/top-employees
     * Returns: { topProductiveEmployees, topUnproductiveEmployees }
     */
    getTopEmployees: async (params = {}) => {
        const res = await apiClient.get('/analytics/top-employees', { params });
        return res.data;
    },

    /**
     * GET /api/analytics/top-teams
     * Returns: { topProductiveTeams, topUnproductiveTeams }
     */
    getTopTeams: async (params = {}) => {
        const res = await apiClient.get('/analytics/top-teams', { params });
        return res.data;
    },

    /**
     * GET /api/analytics/category-breakdown
     * Returns: array of { category, totalUsage, percentage }
     */
    getCategoryBreakdown: async (params = {}) => {
        const res = await apiClient.get('/analytics/category-breakdown', { params });
        return res.data;
    },

    /**
     * GET /api/productivity/apps
     * Returns: array of { appName, domain, category, productivity, totalUsageHours, productivityLabel }
     */
    getApps: async (params = {}) => {
        const res = await apiClient.get('/productivity/apps', { params });
        return res.data;
    },
};

export default analyticsService;
