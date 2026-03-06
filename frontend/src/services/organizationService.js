import apiClient from './apiClient';

const organizationService = {
    getOrganization: () => apiClient.get('/organization').then(res => res.data),
    updateOrganization: (id, data) => apiClient.put(`/organization/${id}`, data).then(res => res.data),
    createOrganization: (data) => apiClient.post('/organization', data).then(res => res.data),
};

export default organizationService;
