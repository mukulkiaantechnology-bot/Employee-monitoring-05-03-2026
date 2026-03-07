import { useEffect } from 'react';
import { useLocationStore } from '../store/locationStore';
import { useAuthStore } from '../store/authStore';

export function LocationTracker() {
    const { trackMyLocation } = useLocationStore();
    const { role } = useAuthStore();

    useEffect(() => {
        // Only track for EMPLOYEES
        if (role !== 'EMPLOYEE') return;

        const track = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        trackMyLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            source: 'Browser'
                        });
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                    },
                    { enableHighAccuracy: true }
                );
            }
        };

        // Track immediately on mount
        track();

        // Then every 60 seconds
        const intervalId = setInterval(track, 60000);

        return () => clearInterval(intervalId);
    }, [role, trackMyLocation]);

    return null; // This is a background tracker
}
