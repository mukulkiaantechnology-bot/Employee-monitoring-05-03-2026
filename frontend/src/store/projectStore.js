import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useProjectStore = create((set, get) => ({
    projects: [],
    loading: false,
    error: null,

    fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ projects: response.data.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch projects', loading: false });
        }
    },

    createProject: async (projectData) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/projects`, projectData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set(state => ({
                projects: [...state.projects, response.data.data],
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create project', loading: false });
            throw error;
        }
    },

    assignEmployees: async (projectId, employeeIds) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/projects/assign`, { projectId, employeeIds }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await get().fetchProjects();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to assign employees', loading: false });
            throw error;
        }
    },

    logTime: async (logData) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/projects/log-time`, logData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await get().fetchProjects();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to log time', loading: false });
            throw error;
        }
    }
}));
