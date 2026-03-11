import { create } from 'zustand';
import attendanceService from '../services/attendanceService';

const useAttendanceStore = create((set, get) => ({
    timesheets: [],
    manualTimes: [],
    shifts: [],
    timeOffs: [],
    loading: false,
    error: null,

    fetchTimesheets: async (params = {}) => {
        set({ loading: true });
        try {
            const res = await attendanceService.getTimesheets(params);
            if (res.success) set({ timesheets: res.data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchManualTimes: async (params = {}) => {
        set({ loading: true });
        try {
            const res = await attendanceService.getManualTimes(params);
            if (res.success) set({ manualTimes: res.data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchShifts: async (params = {}) => {
        set({ loading: true });
        try {
            const res = await attendanceService.getShifts(params);
            if (res.success) set({ shifts: res.data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchTimeOffs: async (params = {}) => {
        set({ loading: true });
        try {
            const res = await attendanceService.getTimeOffs(params);
            if (res.success) set({ timeOffs: res.data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    clockIn: async () => {
        try {
            const res = await attendanceService.clockIn();
            if (res.success) { get().fetchTimesheets(); return res; }
        } catch (error) {
            console.error('Clock in error:', error);
            throw error;
        }
    },

    clockOut: async () => {
        try {
            const res = await attendanceService.clockOut();
            if (res.success) { get().fetchTimesheets(); return res; }
        } catch (error) {
            console.error('Clock out error:', error);
            throw error;
        }
    },

    addManualTime: async (data) => {
        try {
            const res = await attendanceService.addManualTime(data);
            if (res.success) { get().fetchManualTimes(); return res; }
        } catch (error) {
            console.error('Add manual time error:', error);
            throw error;
        }
    },

    addShift: async (data) => {
        try {
            const res = await attendanceService.createShift(data);
            if (res.success) {
                set(state => ({ shifts: [...state.shifts, res.data] }));
                return res;
            }
        } catch (error) {
            console.error('Add shift error:', error);
            throw error;
        }
    },

    addTimeOff: async (data) => {
        try {
            const res = await attendanceService.createTimeOff(data);
            if (res.success) {
                set(state => ({ timeOffs: [...state.timeOffs, res.data] }));
                return res;
            }
        } catch (error) {
            console.error('Add time off error:', error);
            throw error;
        }
    }
}));

export default useAttendanceStore;
