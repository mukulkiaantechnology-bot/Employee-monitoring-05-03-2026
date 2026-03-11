import api from './apiClient';

const payrollService = {
    getSummary: async (params) => {
        const response = await api.get('/payroll/summary', { params });
        return response.data;
    },
    getRecords: async (params) => {
        const response = await api.get('/payroll/records', { params });
        return response.data;
    },
    getInvoices: async () => {
        const response = await api.get('/payroll/invoices');
        return response.data;
    },
    createInvoice: async (invoiceData) => {
        const response = await api.post('/payroll/invoices', invoiceData);
        return response.data;
    }
};

export default payrollService;
