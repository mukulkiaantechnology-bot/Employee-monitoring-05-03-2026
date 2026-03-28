import { create } from 'zustand';
import taskService from '../services/taskService';
import toast from '../services/toastService';

export const useTaskStore = create((set, get) => ({
    tasks: [],
    board: {
        BACKLOG: [],
        IN_PROGRESS: [],
        QA: [],
        COMPLETED: []
    },
    loading: false,
    error: null,

    fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
            const response = await taskService.getTasks();
            set({ tasks: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchBoardTasks: async () => {
        set({ loading: true, error: null });
        try {
            const response = await taskService.getBoardTasks();
            set({ board: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createTask: async (taskData) => {
        set({ loading: true, error: null });
        try {
            const response = await taskService.createTask(taskData);
            await get().fetchBoardTasks();
            set({ loading: false });
            toast.success('Task created successfully');
            return response.data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    updateTaskStatus: async (taskId, status) => {
        try {
            await taskService.updateTaskStatus(taskId, status);
            await get().fetchBoardTasks();
            toast.success('Task status updated');
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    deleteTask: async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            await get().fetchBoardTasks();
            toast.success('Task deleted successfully');
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },
    
    updateTask: async (taskId, taskData) => {
        try {
            await taskService.updateTask(taskId, taskData);
            await get().fetchBoardTasks();
            toast.success('Task updated successfully');
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    }
}));
