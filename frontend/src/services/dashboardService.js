import api from "./apiClient";

const dashboardService = {
    getAdminDashboard: async () => {
        const response = await api.get("/dashboard/admin");
        return response.data;
    },
    getManagerDashboard: async () => {
        const response = await api.get("/dashboard/manager");
        return response.data;
    },
    getEmployeeDashboard: async () => {
        const response = await api.get("/dashboard/me");
        return response.data;
    }
};

export default dashboardService;
