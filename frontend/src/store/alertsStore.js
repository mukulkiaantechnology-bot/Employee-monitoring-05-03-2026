import { create } from 'zustand';
import alertService from '../services/alertService';

export const useAlertsStore = create((set, get) => ({
    alertsSettings: {
        attendance: {
            enabled: true,
            alerts: []
        },
        security: {
            enabled: true,
            alerts: []
        },
        shiftScheduling: {
            earliestClockIn: 15,
            latestClockOut: 30,
            tolerance: 10,
            absentNotification: { inApp: true, email: false },
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
    loading: false,
    error: null,

    // Actions
    fetchAlertRules: async (type) => {
        set({ loading: true });
        try {
            const rules = await alertService.getAlertRules(type);
            set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    [type]: {
                        ...state.alertsSettings[type],
                        alerts: rules
                    }
                },
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchSettings: async () => {
        set({ loading: true });
        try {
            const settings = await alertService.getAlertSettings();
            set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    shiftScheduling: {
                        earliestClockIn: settings.earliestClockIn,
                        latestClockOut: settings.latestClockOut,
                        tolerance: settings.tolerance,
                        absentNotification: {
                            inApp: settings.absentInApp,
                            email: settings.absentEmail
                        },
                        headcountNotification: {
                            enabled: settings.headcountEnabled,
                            lateThreshold: settings.headcountLateThreshold,
                            sendAfter: settings.headcountSendAfter,
                            inApp: settings.headcountInApp,
                            email: settings.headcountEmail
                        }
                    },
                    other: {
                        productivityLabeling: settings.productivityLabeling,
                        manualTimeEntries: settings.manualTimeEntries
                    }
                },
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    addAlert: async (type, alert) => {
        try {
            const newAlert = await alertService.createAlertRule({ ...alert, type });
            set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    [type]: {
                        ...state.alertsSettings[type],
                        alerts: [...state.alertsSettings[type].alerts, newAlert]
                    }
                }
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    deleteAlert: async (type, id) => {
        try {
            await alertService.deleteAlertRule(id);
            set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    [type]: {
                        ...state.alertsSettings[type],
                        alerts: state.alertsSettings[type].alerts.filter(a => a.id !== id)
                    }
                }
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    updateAlert: async (type, id, updates) => {
        try {
            const updatedAlert = await alertService.updateAlertRule(id, updates);
            set((state) => ({
                alertsSettings: {
                    ...state.alertsSettings,
                    [type]: {
                        ...state.alertsSettings[type],
                        alerts: state.alertsSettings[type].alerts.map(a => a.id === id ? updatedAlert : a)
                    }
                }
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    updateShiftScheduling: async (updates) => {
        try {
            const backendUpdates = {};
            if (updates.earliestClockIn !== undefined) backendUpdates.earliestClockIn = updates.earliestClockIn;
            if (updates.latestClockOut !== undefined) backendUpdates.latestClockOut = updates.latestClockOut;
            if (updates.tolerance !== undefined) backendUpdates.tolerance = updates.tolerance;
            
            if (updates.headcountNotification) {
                if (updates.headcountNotification.enabled !== undefined) backendUpdates.headcountEnabled = updates.headcountNotification.enabled;
                if (updates.headcountNotification.lateThreshold !== undefined) backendUpdates.headcountLateThreshold = updates.headcountNotification.lateThreshold;
                if (updates.headcountNotification.sendAfter !== undefined) backendUpdates.headcountSendAfter = updates.headcountNotification.sendAfter;
            }

            await alertService.updateAlertSettings(backendUpdates);
            await get().fetchSettings();
        } catch (error) {
            set({ error: error.message });
        }
    },

    updateOtherSettings: async (updates) => {
        try {
            await alertService.updateAlertSettings(updates);
            await get().fetchSettings();
        } catch (error) {
            set({ error: error.message });
        }
    },

    toggleNotification: async (category, type, value) => {
        try {
            const updates = {};
            if (category === 'absent') {
                updates[type === 'inApp' ? 'absentInApp' : 'absentEmail'] = value;
            } else if (category === 'headcount') {
                updates[type === 'inApp' ? 'headcountInApp' : 'headcountEmail'] = value;
            }
            await alertService.updateAlertSettings(updates);
            await get().fetchSettings();
        } catch (error) {
            set({ error: error.message });
        }
    }
}));
