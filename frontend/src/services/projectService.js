import apiClient from './apiClient';

const projectService = {
    getProjects: () => apiClient.get('/projects').then(res => res.data),
    createProject: (data) => apiClient.post('/projects', data).then(res => res.data),
    assignEmployees: (data) => apiClient.post('/projects/assign', data).then(res => res.data),
    logTime: (data) => apiClient.post('/projects/log-time', data).then(res => res.data),
};

export default projectService;
