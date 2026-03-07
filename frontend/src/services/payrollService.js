import api from './apiClient';

const payrollService = {
    getSummary: async () => {
        const response = await api.get('/payroll/summary');
        return response.data;
    },
    getRecords: async (startDate, endDate) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
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
