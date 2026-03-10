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

import { emailReportService } from '../services/emailReportService';

export const CONTENT_OPTIONS = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'utilization', label: 'Utilization' },
    { id: 'projects', label: 'Time on Projects' },
    { id: 'tasks', label: 'Time on Tasks' },
    { id: 'apps', label: 'Apps & Websites' },
    { id: 'location', label: 'Location Insights' },
];


export const useEmailReportStore = create((set, get) => ({
    reports: [],
    loading: false,

    fetchReports: async () => {
        set({ loading: true });
        try {
            const data = await emailReportService.getReports();
            if (data?.success) {
                set({ reports: data.data });
            }
        } catch (error) {
            console.error('Failed to fetch email reports:', error);
        } finally {
            set({ loading: false });
        }
    },

    createReport: async (reportData) => {
        try {
            const data = await emailReportService.createReport(reportData);
            if (data?.success) {
                set((state) => ({ reports: [data.data, ...state.reports] }));
            }
        } catch (error) {
            console.error('Failed to create email report:', error);
            throw error;
        }
    },

    updateReport: async (id, updatedData) => {
        try {
            const data = await emailReportService.updateReport(id, updatedData);
            if (data?.success) {
                set((state) => ({
                    reports: state.reports.map((r) =>
                        r.id === id ? data.data : r
                    ),
                }));
            }
        } catch (error) {
            console.error('Failed to update email report:', error);
            throw error;
        }
    },

    deleteReport: async (id) => {
        try {
            const data = await emailReportService.deleteReport(id);
            if (data?.success) {
                 set((state) => ({
                    reports: state.reports.filter((r) => r.id !== id),
                }));
            }
        } catch (error) {
            console.error('Failed to delete email report:', error);
            throw error;
        }
    },

    toggleReport: async (id) => {
        const report = get().reports.find(r => r.id === id);
        if (!report) return;
        try {
            const updated = { ...report, isActive: !report.isActive };
            const data = await emailReportService.updateReport(id, { isActive: updated.isActive });
            if (data?.success) {
                 set((state) => ({
                    reports: state.reports.map((r) =>
                        r.id === id ? data.data : r
                    ),
                }));
            }
        } catch (error) {
            console.error('Failed to toggle email report:', error);
        }
    },
}));
