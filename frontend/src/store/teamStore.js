import { create } from 'zustand';
import teamService from '../services/teamService';

export const useTeamStore = create((set, get) => ({
    teams: [],
    isLoading: false,
    error: null,

    fetchTeams: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await teamService.getTeams();
            set({ teams: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addTeam: async (teamData) => {
        set({ isLoading: true });
        try {
            const response = await teamService.createTeam(teamData);
            set((state) => ({
                teams: [...state.teams, response.data],
                isLoading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteTeam: async (id) => {
        try {
            await teamService.deleteTeam(id);
            set((state) => ({
                teams: state.teams.filter((t) => t.id !== id)
            }));
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    updateTeam: async (id, teamData) => {
        set({ isLoading: true });
        try {
            const response = await teamService.updateTeam(id, teamData);
            set((state) => ({
                teams: state.teams.map((t) => t.id === id ? response.data : t),
                isLoading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    }
}));
