import apiClient from './apiClient';

const screenshotService = {
    /**
     * Get all screenshots - role-based filtering handled by backend
     * @param {Object} params - optional query params (employeeId, date, productivity)
     */
    getScreenshots: async (params = {}) => {
        const response = await apiClient.get('/screenshots', { params });
        return response.data;
    },

    /**
     * Get screenshots for a specific employee
     * @param {string} employeeId
     * @param {Object} params - optional (date)
     */
    getEmployeeScreenshots: async (employeeId, params = {}) => {
        const response = await apiClient.get(`/screenshots/employee/${employeeId}`, { params });
        return response.data;
    },

    /**
     * Toggle blur (privacy) for a screenshot
     * @param {string} id - screenshot id
     */
    toggleBlur: async (id) => {
        const response = await apiClient.patch(`/screenshots/${id}/blur`);
        return response.data;
    },

    /**
     * Create screenshot record (used by tracking agent / simulation)
     * @param {Object} data - { employeeId, imageUrl, productivity, capturedAt }
     */
    createScreenshot: async (data) => {
        const response = await apiClient.post('/screenshots', data);
        return response.data;
    }
};

export default screenshotService;
