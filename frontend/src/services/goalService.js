import apiClient from './apiClient';

const goalService = {
    createGoal: (data) => apiClient.post('/goals', data).then(res => res.data),
    getGoals: () => apiClient.get('/goals').then(res => res.data),
    updateGoal: (id, data) => apiClient.put(`/goals/${id}`, data).then(res => res.data),
    deleteGoal: (id) => apiClient.delete(`/goals/${id}`).then(res => res.data),
    addActivity: (id, data) => apiClient.post(`/goals/${id}/activities`, data).then(res => res.data),
};

export default goalService;
