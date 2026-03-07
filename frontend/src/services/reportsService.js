import api from './apiClient';

export const getReportData = async (type, params) => {
    const response = await api.get('/reports', { params: { type, ...params } });
    return response.data;
};
