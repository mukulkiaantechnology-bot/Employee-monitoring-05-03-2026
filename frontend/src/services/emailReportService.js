import apiClient from './apiClient';

export const emailReportService = {
  getReports: async () => {
    const response = await apiClient.get('/email-reports');
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await apiClient.post('/email-reports', reportData);
    return response.data;
  },

  updateReport: async (id, reportData) => {
    const response = await apiClient.put(`/email-reports/${id}`, reportData);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await apiClient.delete(`/email-reports/${id}`);
    return response.data;
  }
};
