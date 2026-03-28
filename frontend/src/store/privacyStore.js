import { create } from 'zustand';
import complianceService from '../services/complianceService';
import { toast } from '../utils/toastManager';

const INITIAL = {
    showUrlsInActivityLogs: false,
    blurLevel: 2,
    saveOriginalScreenshots: false,
    collectPHI: null,
    gdprApplicable: false,
};

export const usePrivacyStore = create((set, get) => ({
    privacy: { ...INITIAL },
    originalPrivacy: { ...INITIAL },
    loading: false,
    error: null,

    updateField: (field, value) =>
        set((state) => ({
            privacy: { ...state.privacy, [field]: value },
        })),

    fetchPrivacySettings: async () => {
        set({ loading: true, error: null });
        try {
            const data = await complianceService.getSettings();
            // Map backend gdprEnabled to frontend gdprApplicable
            const settings = {
                ...INITIAL,
                ...data,
                gdprApplicable: data.gdprEnabled,
            };
            set({
                privacy: settings,
                originalPrivacy: settings,
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    savePrivacySettings: async () => {
        set({ loading: true });
        try {
            const { privacy } = get();
            const data = {
                ...privacy,
                gdprEnabled: privacy.gdprApplicable,
            };
            await complianceService.updateSettings(data);
            set({
                originalPrivacy: { ...privacy },
                loading: false
            });
            toast.success('Privacy settings saved successfully!');
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    resetChanges: () =>
        set((state) => ({
            privacy: { ...state.originalPrivacy },
        })),

    hasChanges: () => {
        const { privacy, originalPrivacy } = get();
        return JSON.stringify(privacy) !== JSON.stringify(originalPrivacy);
    },
}));
