import api from "./apiClient";

const complianceService = {
    getSettings: async () => {
        const response = await api.get("/compliance/settings");
        return response.data.data;
    },

    updateSettings: async (settings) => {
        const response = await api.post("/compliance/settings", settings);
        return response.data.data;
    },

    getAuditLogs: async (search = "") => {
        const response = await api.get(`/compliance/audit-logs?search=${search}`);
        return response.data.data;
    }
};

export default complianceService;
