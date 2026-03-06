import api from './apiClient';

/**
 * Activity Service
 * Handles API calls for employee and team activity logs.
 */
const activityService = {
    /**
     * Log a new activity (usually sent by the tracking agent)
     */
    logActivity: async (data) => {
        const response = await api.post('/activity/log', data);
        return response.data;
    },

    /**
     * Get activity logs for a specific employee
     */
    getEmployeeActivity: async (employeeId, params = {}) => {
        const response = await api.get(`/activity/employee/${employeeId}`, { params });
        return response.data;
    },

    /**
     * Get activity logs for a team
     */
    getTeamActivity: async (teamId, params = {}) => {
        const response = await api.get(`/activity/team/${teamId}`, { params });
        return response.data;
    },

    /**
     * Get organization-wide activity logs (Admin/Manager only)
     */
    getOrganizationActivity: async (params = {}) => {
        const response = await api.get('/activity/organization', { params });
        return response.data;
    },

    /**
     * Get aggregated organization-wide activity summary
     */
    getOrganizationSummary: async (params = {}) => {
        const response = await api.get('/activity/summary', { params });
        return response.data;
    }
};

export default activityService;
