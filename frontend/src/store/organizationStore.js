import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import organizationService from '../services/organizationService';

export const INDUSTRY_OPTIONS = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Marketing',
    'Retail',
    'Other',
];

export const ORG_SIZE_OPTIONS = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+',
];

export const TIMEZONE_OPTIONS = [
    'UTC-12:00 (IDLW)',
    'UTC-8:00 (PST)',
    'UTC-7:00 (MST)',
    'UTC-6:00 (CST)',
    'UTC-5:00 (EST)',
    'UTC-4:00 (AST)',
    'UTC-3:00 (BRT)',
    'UTC+0:00 (GMT)',
    'UTC+1:00 (CET)',
    'UTC+2:00 (EET)',
    'UTC+3:00 (MSK)',
    'UTC+4:00 (GST)',
    'UTC+5:30 (IST)',
    'UTC+6:00 (BST)',
    'UTC+7:00 (ICT)',
    'UTC+8:00 (SGT/CST)',
    'UTC+9:00 (JST)',
    'UTC+10:00 (AEST)',
    'UTC+12:00 (NZST)',
];

export const useOrganizationStore = create(
    persist(
        (set, get) => ({
            organization: null,
            originalOrganization: null,
            isLoading: false,
            error: null,

            fetchOrganization: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await organizationService.getOrganization();
                    const org = response.data;
                    // Convert workDays string to array for frontend
                    const formattedOrg = {
                        ...org,
                        workDays: org.workDays ? org.workDays.split(',') : [],
                        workHours: { start: org.workStartTime, end: org.workEndTime }
                    };
                    set({ organization: formattedOrg, originalOrganization: formattedOrg, isLoading: false });
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                }
            },

            updateField: (field, value) =>
                set((state) => ({
                    organization: { ...state.organization, [field]: value },
                })),

            saveOrganization: async () => {
                const { organization } = get();
                set({ isLoading: true, error: null });
                try {
                    const response = await organizationService.updateOrganization(organization.id, {
                        ...organization,
                        workStartTime: organization.workHours.start,
                        workEndTime: organization.workHours.end
                    });
                    const org = response.data;
                    const formattedOrg = {
                        ...org,
                        workDays: org.workDays ? org.workDays.split(',') : [],
                        workHours: { start: org.workStartTime, end: org.workEndTime }
                    };
                    set({ organization: formattedOrg, originalOrganization: formattedOrg, isLoading: false });
                    return response;
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    throw error;
                }
            },

            resetChanges: () =>
                set((state) => ({
                    organization: { ...state.originalOrganization },
                })),

            hasChanges: () => {
                const { organization, originalOrganization } = get();
                if (!organization || !originalOrganization) return false;
                return JSON.stringify(organization) !== JSON.stringify(originalOrganization);
            },
        }),
        { name: 'organization-storage' }
    )
);
