import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useReportsStore = create(
    persist(
        (set) => ({
            reportsSettings: {
                workloadDistribution: {
                    optimalFrom: 60,
                    optimalTo: 85,
                    maxTaskThreshold: 10 // Used for calculation if tasks are used instead of hours
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
