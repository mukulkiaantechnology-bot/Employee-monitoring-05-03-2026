import apiClient from './apiClient';

const taskService = {
    createTask: (data) => apiClient.post('/tasks', data).then(res => res.data),
    getTasks: (employeeId) => apiClient.get('/tasks', { params: { employeeId } }).then(res => res.data),
    getBoardTasks: (employeeId) => apiClient.get('/tasks/board', { params: { employeeId } }).then(res => res.data),
    updateTask: (id, data) => apiClient.patch(`/tasks/${id}`, data).then(res => res.data),
    updateTaskStatus: (id, status) => apiClient.patch(`/tasks/${id}/status`, { status }).then(res => res.data),
    deleteTask: (id) => apiClient.delete(`/tasks/${id}`).then(res => res.data),
};

export default taskService;
