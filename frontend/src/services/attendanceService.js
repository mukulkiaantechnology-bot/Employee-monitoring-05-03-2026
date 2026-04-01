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
    },

    getTimeOffs: async (params = {}) => {
        const res = await apiClient.get('/attendance/time-off', { params });
        return res.data;
    },

    createTimeOff: async (data) => {
        const res = await apiClient.post('/attendance/time-off', data);
        return res.data;
    },

    startBreak: async () => {
        const res = await apiClient.post('/attendance/start-break');
        return res.data;
    },

    endBreak: async () => {
        const res = await apiClient.post('/attendance/end-break');
        return res.data;
    }
};

export default attendanceService;
