import apiClient from './apiClient';

const organizationService = {
    getOrganization: async () => {
        const response = await apiClient.get('/organization');
        return response.data;
    },

    updateOrganization: async (id, data) => {
        const response = await apiClient.put(`/organization/${id}`, data);
        return response.data;
    },

    createOrganization: async (data) => {
        const response = await apiClient.post('/organization', data);
        return response.data;
    }
};

export default organizationService;
