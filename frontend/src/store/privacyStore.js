import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL = {
    showUrlsInActivityLogs: false,
    blurLevel: 2,
    saveOriginalScreenshots: false,
    collectPHI: null,
    gdprApplicable: false,
};

export const usePrivacyStore = create(
    persist(
        (set, get) => ({
            privacy: { ...INITIAL },
            originalPrivacy: { ...INITIAL },

            updateField: (field, value) =>
                set((state) => ({
                    privacy: { ...state.privacy, [field]: value },
                })),

            savePrivacySettings: () =>
                set((state) => ({
                    originalPrivacy: { ...state.privacy },
                })),

            resetChanges: () =>
                set((state) => ({
                    privacy: { ...state.originalPrivacy },
                })),

            hasChanges: () => {
                const { privacy, originalPrivacy } = get();
                return JSON.stringify(privacy) !== JSON.stringify(originalPrivacy);
            },
        }),
        { name: 'privacy-storage' }
    )
);
