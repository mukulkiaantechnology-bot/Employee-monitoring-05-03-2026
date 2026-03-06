import apiClient from './apiClient';

const teamService = {
    getTeams: () => apiClient.get('/teams').then(res => res.data),
    getTeamById: (id) => apiClient.get(`/teams/${id}`).then(res => res.data),
    createTeam: (data) => apiClient.post('/teams', data).then(res => res.data),
    updateTeam: (id, data) => apiClient.put(`/teams/${id}`, data).then(res => res.data),
    deleteTeam: (id) => apiClient.delete(`/teams/${id}`).then(res => res.data),
};

export default teamService;
