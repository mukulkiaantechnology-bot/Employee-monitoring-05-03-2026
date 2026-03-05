import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAlertsStore = create(
    persist(
        (set) => ({
            alertsSettings: {
                attendance: {
                    enabled: true,
                    alerts: [
                        { id: 'att-1', name: 'Late Arrival', trigger: 'Late', scope: 'All Employees', createdAt: new Date().toISOString() }
                    ]
                },
                security: {
                    enabled: true,
                    alerts: []
                },
                shiftScheduling: {
                    earliestClockIn: 15,
                    latestClockOut: 30,
                    tolerance: 10,
                    absentNotification: {
                        inApp: true,
                        email: false
                    },
                    headcountNotification: {
                        enabled: true,
                        lateThreshold: 15,
                        sendAfter: "scheduled_time",
                        inApp: true,
                        email: false
                    }
                },
                other: {
                    productivityLabeling: "daily",
                    manualTimeEntries: "daily"
                }
            },

            // Actions
            addAlert: (type, alert) => set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    [type]: {
                        ...state.alertsSettings[type],
                        alerts: [
                            ...state.alertsSettings[type].alerts,
                            { ...alert, id: `${type}-${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() }
                        ]
                    }
                }
            })),

            deleteAlert: (type, id) => set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    [type]: {
                        ...state.alertsSettings[type],
                        alerts: state.alertsSettings[type].alerts.filter(a => a.id !== id)
                    }
                }
            })),

            updateShiftScheduling: (updates) => set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    shiftScheduling: {
                        ...state.alertsSettings.shiftScheduling,
                        ...updates
                    }
                }
            })),

            updateOtherSettings: (updates) => set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    other: {
                        ...state.alertsSettings.other,
                        ...updates
                    }
                }
            })),

            toggleNotification: (category, type, value) => set((state) => {
                const settingKey = category === 'absent' ? 'absentNotification' : 'headcountNotification';
                return {
                    alertsSettings: {
                        ...state.alertsSettings,
                        shiftScheduling: {
                            ...state.alertsSettings.shiftScheduling,
                            [settingKey]: {
                                ...state.alertsSettings.shiftScheduling[settingKey],
                                [type]: value
                            }
                        }
                    }
                };
            })
        }),
        {
            name: 'alerts-settings-storage',
        }
    )
);
