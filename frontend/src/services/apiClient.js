import axios from "axios";
import API_BASE_URL from "../config/api";
import { toast } from "../utils/toastManager";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || "Something went wrong";
        
        // Don't show toast for 401 Unauthorized as it's handled by auth logic usually
        if (error.response?.status !== 401) {
            toast.error(message);
        }
        
        return Promise.reject(error);
    }
);

export default api;
