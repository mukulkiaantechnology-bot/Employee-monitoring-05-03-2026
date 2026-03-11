import api from "./apiClient";

const productivityService = {
    getApps: async (params = {}) => {
        const response = await api.get("/productivity/apps", { params });
        return response.data.data;
    },

    getTags: async () => {
        const response = await api.get("/productivity/tags");
        return response.data.data;
    },

    createTag: async (tagData) => {
        const response = await api.post("/productivity/tags", tagData);
        return response.data.data;
    },

    updateTag: async (id, tagData) => {
        const response = await api.put(`/productivity/tags/${id}`, tagData);
        return response.data.data;
    },

    deleteTag: async (id) => {
        const response = await api.delete(`/productivity/tags/${id}`);
        return response.data.data;
    },

    updateRule: async (ruleData) => {
        const response = await api.post("/productivity/rules", ruleData);
        return response.data.data;
    }
};

export default productivityService;
