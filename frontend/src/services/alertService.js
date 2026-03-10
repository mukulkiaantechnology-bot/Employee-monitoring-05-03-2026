import api from "./apiClient";

const alertService = {
    getAlertRules: async (type) => {
        const response = await api.get("/alerts/rules", { params: { type } });
        return response.data;
    },

    createAlertRule: async (data) => {
        const response = await api.post("/alerts/rules", data);
        return response.data;
    },

    updateAlertRule: async (id, data) => {
        const response = await api.put(`/alerts/rules/${id}`, data);
        return response.data;
    },

    deleteAlertRule: async (id) => {
        const response = await api.delete(`/alerts/rules/${id}`);
        return response.data;
    },

    getAlertSettings: async () => {
        const response = await api.get("/alerts/settings");
        return response.data;
    },

    updateAlertSettings: async (updates) => {
        const response = await api.put("/alerts/settings", updates);
        return response.data;
    }
};

export default alertService;
