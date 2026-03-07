import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as locationService from '../services/locationService';

export const useLocationStore = create(
    persist(
        (set, get) => ({
            locationSettings: {
                locations: [],
                autoDetectionEnabled: true,
                attendanceThreshold: 4,
            },
            locationLogs: [],
            loading: false,

            trackMyLocation: async (coords) => {
                try {
                    const response = await locationService.trackLocation(coords);
                    return response.data;
                } catch (error) {
                    console.error('Failed to track location:', error);
                }
            },

            fetchLocationHistory: async (employeeId) => {
                set({ loading: true });
                try {
                    const response = await locationService.getLocationHistory(employeeId);
                    set({ locationLogs: response.data, loading: false });
                } catch (error) {
                    set({ loading: false });
                }
            },

            addLocation: (location) => set((state) => ({
                locationSettings: {
                    ...state.locationSettings,
                    locations: [...state.locationSettings.locations, { ...location, id: `loc-${Date.now()}` }]
                }
            })),
            importLocations: (newLocations) => set((state) => ({
                locationSettings: {
                    ...state.locationSettings,
                    locations: [...state.locationSettings.locations, ...newLocations.map(loc => ({ ...loc, id: `loc-${Math.random().toString(36).substr(2, 9)}` }))]
                }
            })),
            updateThreshold: (threshold) => set((state) => ({
                locationSettings: {
                    ...state.locationSettings,
                    attendanceThreshold: threshold
                }
            })),
            toggleAutoDetection: () => set((state) => ({
                locationSettings: {
                    ...state.locationSettings,
                    autoDetectionEnabled: !state.locationSettings.autoDetectionEnabled
                }
            })),
            deleteLocation: (id) => set((state) => ({
                locationSettings: {
                    ...state.locationSettings,
                    locations: state.locationSettings.locations.filter(loc => loc.id !== id)
                }
            }))
        }),
        {
            name: 'location-settings-storage',
        }
    )
);
