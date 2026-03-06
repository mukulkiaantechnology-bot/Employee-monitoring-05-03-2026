import apiClient from './apiClient';

const employeeService = {
    getEmployees: () => apiClient.get('/employees').then(res => res.data),
    getEmployeeById: (id) => apiClient.get(`/employees/${id}`).then(res => res.data),
    inviteEmployee: (data) => apiClient.post('/employees/invite', data).then(res => res.data),
    updateEmployee: (id, data) => apiClient.put(`/employees/${id}`, data).then(res => res.data),
    deleteEmployee: (id) => apiClient.delete(`/employees/${id}`).then(res => res.data),
};

export default employeeService;
