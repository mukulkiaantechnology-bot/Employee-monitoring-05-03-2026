import api from './apiClient';

const integrationService = {
    getIntegrations: async () => {
        try {
            const response = await api.get('/integrations');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching integrations:', error);
            throw error;
        }
    },

    configureIntegration: async (integrationId, config) => {
        try {
            const response = await api.post(`/integrations/${integrationId}`, { config });
            return response.data.data;
        } catch (error) {
            console.error('Error configuring integration:', error);
            throw error;
        }
    },

    disconnectIntegration: async (integrationId) => {
        try {
            const response = await api.delete(`/integrations/${integrationId}`);
            return response.data.data;
        } catch (error) {
            console.error('Error disconnecting integration:', error);
            throw error;
        }
    }
};

export default integrationService;
