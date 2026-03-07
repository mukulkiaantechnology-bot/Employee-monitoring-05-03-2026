import apiClient from './apiClient';

const attendanceService = {
    clockIn: async () => {
        const res = await apiClient.post('/attendance/clock-in');
        return res.data;
    },

    clockOut: async () => {
        const res = await apiClient.post('/attendance/clock-out');
        return res.data;
    },

    getTimesheets: async (params = {}) => {
        const res = await apiClient.get('/attendance/timesheets', { params });
        return res.data;
    },

    addManualTime: async (data) => {
        const res = await apiClient.post('/attendance/manual-time', data);
        return res.data;
    },

    getManualTimes: async (params = {}) => {
        const res = await apiClient.get('/attendance/manual-time', { params });
        return res.data;
    },

    getShifts: async (params = {}) => {
        const res = await apiClient.get('/attendance/shifts', { params });
        return res.data;
    },

    createShift: async (data) => {
        const res = await apiClient.post('/attendance/shifts', data);
        return res.data;
    }
};

export default attendanceService;
