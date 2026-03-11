import api from "./apiClient";

const dashboardService = {
    getAdminDashboard: async (startDate, endDate) => {
        const response = await api.get("/dashboard/admin", { params: { startDate, endDate } });
        return response.data;
    },
    getManagerDashboard: async (startDate, endDate) => {
        const response = await api.get("/dashboard/manager", { params: { startDate, endDate } });
        return response.data;
    },
    getEmployeeDashboard: async (startDate, endDate) => {
        const response = await api.get("/dashboard/me", { params: { startDate, endDate } });
        return response.data;
    }
};

export default dashboardService;
