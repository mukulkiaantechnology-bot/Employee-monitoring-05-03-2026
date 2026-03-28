import { create } from 'zustand';
import api from '../services/apiClient';
import toast from '../services/toastService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useProjectStore = create((set, get) => ({
    projects: [],
    loading: false,
    error: null,

    fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`${API_URL}/projects`);
            set({ projects: response.data.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch projects', loading: false });
        }
    },

    createProject: async (projectData) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await api.post(`${API_URL}/projects`, projectData);
            set(state => ({
                projects: [...state.projects, response.data.data],
                loading: false
            }));
            toast.success('Project created successfully');
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed', loading: false });
            throw error;
        }
    },

    assignEmployees: async (projectId, employeeIds) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await api.post(`${API_URL}/projects/assign`, { projectId, employeeIds });
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
            await api.post(`${API_URL}/projects/log-time`, logData);
            await get().fetchProjects();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to log time', loading: false });
            throw error;
        }
    },

    updateProject: async (projectId, projectData) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await api.put(`${API_URL}/projects/${projectId}`, projectData);
            set(state => ({
                projects: state.projects.map(p => p.id === projectId ? response.data.data : p),
                loading: false
            }));
            toast.success('Project updated successfully');
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update project', loading: false });
            toast.error(error);
            throw error;
        }
    },

    deleteProject: async (projectId) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await api.delete(`${API_URL}/projects/${projectId}`);
            set(state => ({
                projects: state.projects.filter(p => p.id !== projectId),
                loading: false
            }));
            toast.success('Project deleted successfully');
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete project', loading: false });
            toast.error(error);
            throw error;
        }
    }
}));
