import { useAlertsStore } from '../store/alertsStore';

export function useShiftLogic() {
    const { alertsSettings } = useAlertsStore();
    const { earliestClockIn, latestClockOut, tolerance } = alertsSettings.shiftScheduling;

    const checkShiftStatus = (scheduledStart, scheduledEnd, actualStart, actualEnd) => {
        const status = {
            warning: false,
            overtime: false,
            incomplete: false,
            message: ''
        };

        if (!actualStart) {
            status.incomplete = true;
            status.message = 'Absent';
            return status;
        }

        const scheduledStartTime = new Date(`2026-01-01T${scheduledStart}`);
        const scheduledEndTime = new Date(`2026-01-01T${scheduledEnd}`);
        const actualStartTime = new Date(`2026-01-01T${actualStart}`);
        const actualEndTime = actualEnd ? new Date(`2026-01-01T${actualEnd}`) : null;

        // Earliest Clock In Check
        const earliestAllowed = new Date(scheduledStartTime.getTime() - (earliestClockIn * 60000));
        if (actualStartTime < earliestAllowed) {
            status.warning = true;
            status.message = 'Early Clock-in';
        }

        // Latest Clock Out Check
        if (actualEndTime) {
            const latestAllowed = new Date(scheduledEndTime.getTime() + (latestClockOut * 60000));
            if (actualEndTime > latestAllowed) {
                status.overtime = true;
                status.message = 'Unauthorized Overtime';
            }

            // Incomplete Shift Check (Tolerance)
            const scheduledDuration = (scheduledEndTime - scheduledStartTime) / 60000;
            const actualDuration = (actualEndTime - actualStartTime) / 60000;
            if (actualDuration < (scheduledDuration - tolerance)) {
                status.incomplete = true;
                status.message = 'Incomplete Shift';
            }
        }

        return status;
    };

    return { checkShiftStatus };
}

export const sampleShiftData = [
    { 
        id: 1, 
        name: 'Sarah Wilson', 
        scheduled: '09:00 - 17:00', 
        actual: '08:40 - 17:00',
        scheduledStart: '09:00:00',
        scheduledEnd: '17:00:00',
        actualStart: '08:40:00',
        actualEnd: '17:00:00'
    },
    { 
        id: 2, 
        name: 'John Doe', 
        scheduled: '09:00 - 17:00', 
        actual: '09:15 - 17:45',
        scheduledStart: '09:00:00',
        scheduledEnd: '17:00:00',
        actualStart: '09:15:00',
        actualEnd: '17:45:00'
    },
    { 
        id: 3, 
        name: 'Alice Smith', 
        scheduled: '10:00 - 18:00', 
        actual: '---',
        scheduledStart: '10:00:00',
        scheduledEnd: '18:00:00',
        actualStart: null,
        actualEnd: null
    },
    {
        id: 4,
        name: 'James Carter',
        scheduled: '08:00 - 16:00',
        actual: '08:05 - 16:00',
        scheduledStart: '08:00:00',
        scheduledEnd: '16:00:00',
        actualStart: '08:05:00',
        actualEnd: '16:00:00'
    },
    {
        id: 5,
        name: 'Priya Sharma',
        scheduled: '09:00 - 18:00',
        actual: '09:00 - 20:10',
        scheduledStart: '09:00:00',
        scheduledEnd: '18:00:00',
        actualStart: '09:00:00',
        actualEnd: '20:10:00'
    }
];
