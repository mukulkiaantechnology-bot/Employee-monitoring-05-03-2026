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
     * Delete a screenshot.
     * Admin/Manager: permanently deletes from DB.
     * Employee: soft-deletes (hides from own view; admin/manager still see it).
     * @param {string} id - screenshot id
     */
    deleteScreenshot: async (id) => {
        const response = await apiClient.delete(`/screenshots/${id}`);
        return response.data;
    },

    /**
     * Create screenshot record (used by tracking agent / simulation)
     * @param {Object} data - { employeeId, imageUrl, productivity, capturedAt }
     */
    createScreenshot: async (data) => {
        const response = await apiClient.post('/screenshots', data);
        return response.data;
    },

    /**
     * Upload real screenshot via multipart form-data
     * @param {FormData} formData
     */
    uploadRealScreenshot: async (formData) => {
        const response = await apiClient.post('/screenshots', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Get screenshot settings for the organization
     */
    getSettings: async () => {
        const response = await apiClient.get('/screenshots/settings');
        return response.data;
    },

    /**
     * Update screenshot settings
     * @param {Object} settings - { randomShifts, excludeAdmin, globalBlur, frequency }
     */
    updateSettings: async (settings) => {
        const response = await apiClient.patch('/screenshots/settings', settings);
        return response.data;
    }
};

export default screenshotService;

