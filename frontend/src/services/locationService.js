import api from './apiClient';

export const trackLocation = async (coords) => {
    const response = await api.post('/location/track', coords);
    return response.data;
};

export const getLocationHistory = async (employeeId) => {
    const response = await api.get(`/location/employee/${employeeId}`);
    return response.data;
};
