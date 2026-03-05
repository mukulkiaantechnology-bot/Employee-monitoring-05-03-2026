import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Dummy scheduler simulation — fires console log based on frequency
function simulateScheduler(report) {
    const msgs = {
        daily: `📧 [Email Report Scheduler] "${report.title}" would send daily at midnight to: ${report.recipients.join(', ')}`,
        weekly: `📧 [Email Report Scheduler] "${report.title}" would send weekly on Monday at midnight to: ${report.recipients.join(', ')}`,
        monthly: `📧 [Email Report Scheduler] "${report.title}" would send on the 1st of each month at midnight to: ${report.recipients.join(', ')}`,
    };
    console.log(msgs[report.frequency] ?? msgs.daily);
}

export const CONTENT_OPTIONS = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'utilization', label: 'Utilization' },
    { id: 'projects', label: 'Time on Projects' },
    { id: 'tasks', label: 'Time on Tasks' },
    { id: 'apps', label: 'Apps & Websites' },
    { id: 'location', label: 'Location Insights' },
];

const INITIAL_REPORTS = [
    {
        id: '1',
        title: 'Daily report',
        frequency: 'daily',
        recipients: ['admin@company.com'],
        content: ['attendance', 'utilization', 'projects', 'tasks', 'apps'],
        sendToSelf: true,
        isActive: true,
        createdAt: Date.now() - 86400000,
    },
];

export const useEmailReportStore = create(
    persist(
        (set, get) => ({
            reports: INITIAL_REPORTS,

            createReport: (reportData) => {
                const newReport = {
                    id: `report_${Date.now()}`,
                    isActive: true,
                    createdAt: Date.now(),
                    ...reportData,
                };
                set((state) => ({ reports: [newReport, ...state.reports] }));
                simulateScheduler(newReport);
            },

            updateReport: (id, updatedData) => {
                set((state) => ({
                    reports: state.reports.map((r) =>
                        r.id === id ? { ...r, ...updatedData } : r
                    ),
                }));
                const updated = get().reports.find((r) => r.id === id);
                if (updated) simulateScheduler(updated);
            },

            deleteReport: (id) => {
                set((state) => ({
                    reports: state.reports.filter((r) => r.id !== id),
                }));
            },

            toggleReport: (id) => {
                set((state) => ({
                    reports: state.reports.map((r) =>
                        r.id === id ? { ...r, isActive: !r.isActive } : r
                    ),
                }));
            },
        }),
        { name: 'email-reports-storage' }
    )
);
