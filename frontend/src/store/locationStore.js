import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLocationStore = create(
    persist(
        (set) => ({
            locationSettings: {
                locations: [
                    {
                        id: 'loc-1',
                        name: 'Main Office',
                        type: 'Office',
                        address: '123 Business Ave, Tech City, TC 10101',
                        lat: 40.7128,
                        lng: -74.0060,
                        attendanceThreshold: 4
                    }
                ],
                autoDetectionEnabled: true,
                attendanceThreshold: 4, // Global default threshold
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
