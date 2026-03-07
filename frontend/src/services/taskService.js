import apiClient from './apiClient';

const taskService = {
    createTask: (data) => apiClient.post('/tasks', data).then(res => res.data),
    getTasks: () => apiClient.get('/tasks').then(res => res.data),
    getBoardTasks: () => apiClient.get('/tasks/board').then(res => res.data),
    updateTask: (id, data) => apiClient.patch(`/tasks/${id}`, data).then(res => res.data),
    updateTaskStatus: (id, status) => apiClient.patch(`/tasks/${id}/status`, { status }).then(res => res.data),
    deleteTask: (id) => apiClient.delete(`/tasks/${id}`).then(res => res.data),
};

export default taskService;
