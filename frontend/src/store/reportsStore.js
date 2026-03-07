import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as reportsService from '../services/reportsService';

export const useReportsStore = create(
    persist(
        (set, get) => ({
            reportsSettings: {
                workloadDistribution: {
                    optimalFrom: 60,
                    optimalTo: 85,
                    maxTaskThreshold: 10
                }
            },
            reportData: {},
            loading: false,
            error: null,

            fetchReportData: async (type, params) => {
                set({ loading: true, error: null });
                try {
                    const response = await reportsService.getReportData(type, params);
                    set((state) => ({
                        reportData: {
                            ...state.reportData,
                            [type]: response.data
                        },
                        loading: false
                    }));
                } catch (error) {
                    set({ error: error.message, loading: false });
                }
            },

            updateWorkloadSettings: (settings) => set((state) => ({
                reportsSettings: {
                    ...state.reportsSettings,
                    workloadDistribution: {
                        ...state.reportsSettings.workloadDistribution,
                        ...settings
                    }
                }
            })),
            resetWorkloadSettings: () => set((state) => ({
                reportsSettings: {
                    ...state.reportsSettings,
                    workloadDistribution: {
                        optimalFrom: 60,
                        optimalTo: 85,
                        maxTaskThreshold: 10
                    }
                }
            }))
        }),
        {
            name: 'reports-settings-storage',
        }
    )
);
