import api from "./apiClient";

const authService = {
    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     */
    login: async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        if (response.data.success) {
            localStorage.setItem("token", response.data.data.token);
        }
        return response.data;
    },

    /**
     * Register user
     * @param {Object} userData 
     */
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        if (response.data.success) {
            localStorage.setItem("token", response.data.data.token);
        }
        return response.data;
    },

    /**
     * Get current user
     */
    getCurrentUser: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (data) => {
        const response = await api.put("/auth/profile", data);
        return response.data;
    },

    /**
     * Change password
     */
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.put("/auth/change-password", { currentPassword, newPassword });
        return response.data;
    },

    /**
     * Forgot password
     */
    forgotPassword: async (email) => {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout API failed", error);
        }
        localStorage.removeItem("token");
    }
};

export default authService;
