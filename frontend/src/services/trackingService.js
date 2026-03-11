import apiClient from './apiClient';

const trackingService = {
    getProfiles: async () => {
        const response = await apiClient.get('/tracking/profiles');
        return response.data.data;
    },

    createProfile: async (profileData) => {
        const response = await apiClient.post('/tracking/profiles', profileData);
        return response.data.data;
    },

    updateProfile: async (id, profileData) => {
        const response = await apiClient.put(`/tracking/profiles/${id}`, profileData);
        return response.data.data;
    },

    deleteProfile: async (id) => {
        const response = await apiClient.delete(`/tracking/profiles/${id}`);
        return response.data.data;
    },

    getAdvancedSettings: async () => {
        const response = await apiClient.get('/tracking/advanced');
        return response.data.data;
    },

    updateAdvancedSettings: async (settingsData) => {
        const response = await apiClient.put('/tracking/advanced', settingsData);
        return response.data.data;
    }
};

export default trackingService;
