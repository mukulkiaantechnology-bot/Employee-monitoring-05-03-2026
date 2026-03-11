import { create } from 'zustand';
import trackingService from '../services/trackingService';

export const TRACKING_SCENARIOS = [
    { id: 'unlimited', label: 'Unlimited', desc: 'Track activities constantly' },
    { id: 'fixed', label: 'Fixed', desc: 'Track during fixed working hours' },
    { id: 'network', label: 'Network based', desc: 'Track when computer is connected to a specified network' },
    { id: 'vpn', label: 'VPN based', desc: 'Track only when the computer is connected to a VPN network' },
    { id: 'manual', label: 'Manual Clock In', desc: 'Track when user clock-ins manually' },
    { id: 'project', label: 'Project Based', desc: 'Track when user works on tasks and projects' },
];

export const SCREENSHOT_OPTIONS = [
    { value: 0, label: 'No screenshots' },
    { value: 1, label: '1 per hour' },
    { value: 3, label: '3 per hour' },
    { value: 6, label: '6 per hour' },
];

export const BREAK_TIME_OPTIONS = [
    { value: 0, label: 'No break time' },
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 60, label: '60 min' },
];

export const IDLE_TIME_OPTIONS = [
    { value: 1, label: '1 min' },
    { value: 2, label: '2 min' },
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const SHIFT_THRESHOLD_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} hour${i + 1 !== 1 ? 's' : ''}`,
}));

export const useTrackingStore = create((set, get) => ({
    trackingProfiles: [],
    advancedSettings: null,
    isLoading: false,
    error: null,

    fetchTrackingData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [profiles, advanced] = await Promise.all([
                trackingService.getProfiles(),
                trackingService.getAdvancedSettings()
            ]);
            set({ trackingProfiles: profiles, advancedSettings: advanced, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    createProfile: async (profile) => {
        try {
            const newProfile = await trackingService.createProfile(profile);
            set((s) => ({
                trackingProfiles: [...s.trackingProfiles, newProfile],
            }));
            return newProfile;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (id, updates) => {
        try {
            const updatedProfile = await trackingService.updateProfile(id, updates);
            set((s) => ({
                trackingProfiles: s.trackingProfiles.map((p) =>
                    p.id === id ? updatedProfile : (updates.isDefault ? { ...p, isDefault: false } : p)
                ),
            }));
            return updatedProfile;
        } catch (error) {
            throw error;
        }
    },

    deleteProfile: async (id) => {
        try {
            await trackingService.deleteProfile(id);
            set((s) => ({
                trackingProfiles: s.trackingProfiles.filter((p) => p.id !== id),
            }));
        } catch (error) {
            throw error;
        }
    },

    setDefaultProfile: async (id) => {
        try {
            await trackingService.updateProfile(id, { isDefault: true });
            set((s) => ({
                trackingProfiles: s.trackingProfiles.map((p) => ({
                    ...p,
                    isDefault: p.id === id,
                })),
            }));
        } catch (error) {
            throw error;
        }
    },

    updateAdvancedSettings: async (updates) => {
        try {
            const updatedSettings = await trackingService.updateAdvancedSettings(updates);
            set({ advancedSettings: updatedSettings });
            return updatedSettings;
        } catch (error) {
            throw error;
        }
    },
}));
