import apiClient from './apiClient';

const videoService = {
    /**
     * Upload a video chunk from the WebTrackerAgent
     * @param {FormData} formData — contains 'video' (Blob) and 'employeeId'
     */
    uploadVideo: async (formData) => {
        const response = await apiClient.post('/videos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Get video recordings list (role-based on backend)
     * @param {Object} params — optional { employeeId, limit, offset }
     */
    getVideos: async (params = {}) => {
        const response = await apiClient.get('/videos', { params });
        return response.data;
    },

    /**
     * Delete a video recording
     * @param {string} id
     */
    deleteVideo: async (id) => {
        const response = await apiClient.delete(`/videos/${id}`);
        return response.data;
    },
};

export default videoService;
