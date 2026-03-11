import { create } from 'zustand';
import payrollService from '../services/payrollService';

const usePayrollStore = create((set, get) => ({
    summary: null,
    records: [],
    invoices: [],
    loading: false,
    error: null,

    fetchSummary: async (params) => {
        set({ loading: true });
        try {
            const res = await payrollService.getSummary(params);
            if (res.success) {
                set({ summary: res.data, loading: false });
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchRecords: async (params) => {
        set({ loading: true });
        try {
            const res = await payrollService.getRecords(params);
            if (res.success) {
                set({ records: res.data, loading: false });
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchInvoices: async () => {
        set({ loading: true });
        try {
            const res = await payrollService.getInvoices();
            if (res.success) {
                set({ invoices: res.data, loading: false });
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createInvoice: async (invoiceData) => {
        try {
            const res = await payrollService.createInvoice(invoiceData);
            if (res.success) {
                set(state => ({ invoices: [res.data, ...state.invoices] }));
                return { success: true, data: res.data };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}));

export default usePayrollStore;
