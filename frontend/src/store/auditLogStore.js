import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuditLogStore = create(
    persist(
        (set, get) => ({
            auditLogs: [
                {
                    id: 'log_1',
                    dateTime: '2026-02-28T10:15:00Z',
                    userName: 'Jane Smith',
                    userRole: 'Owner',
                    ipAddress: '192.168.1.1',
                    actionType: 'Create',
                    action: 'Created New API Token: "Integration Service"',
                    objectType: 'API Token'
                },
                {
                    id: 'log_2',
                    dateTime: '2026-02-28T09:42:00Z',
                    userName: 'Alex Rivera',
                    userRole: 'Admin',
                    ipAddress: '192.168.1.45',
                    actionType: 'Update',
                    action: 'Modified Attendance Threshold to 80%',
                    objectType: 'Settings'
                },
                {
                    id: 'log_3',
                    dateTime: '2026-02-28T08:20:00Z',
                    userName: 'John Doe',
                    userRole: 'Manager',
                    ipAddress: '10.0.0.12',
                    actionType: 'Create',
                    action: 'Added new employee: "Alice Smith"',
                    objectType: 'Employee'
                },
                {
                    id: 'log_4',
                    dateTime: '2026-02-27T16:10:00Z',
                    userName: 'Jane Smith',
                    userRole: 'Owner',
                    ipAddress: '192.168.1.1',
                    actionType: 'Delete',
                    action: 'Deleted Project: "Legacy CRM"',
                    objectType: 'Project'
                },
                {
                    id: 'log_5',
                    dateTime: '2026-02-27T14:05:00Z',
                    userName: 'Alex Rivera',
                    userRole: 'Admin',
                    ipAddress: '192.168.1.45',
                    actionType: 'Update',
                    action: 'Updated Shift Scheduling: "Night Shift"',
                    objectType: 'Scheduling'
                },
                {
                    id: 'log_6',
                    dateTime: '2026-02-27T11:30:00Z',
                    userName: 'Sarah Wilson',
                    userRole: 'HR',
                    ipAddress: '172.16.0.5',
                    actionType: 'Update',
                    action: 'Modified Payroll settings for March',
                    objectType: 'Payroll'
                },
                {
                    id: 'log_7',
                    dateTime: '2026-02-26T15:20:00Z',
                    userName: 'Jane Smith',
                    userRole: 'Owner',
                    ipAddress: '192.168.1.1',
                    actionType: 'Create',
                    action: 'Created Location: "London Office"',
                    objectType: 'Location'
                },
                {
                    id: 'log_8',
                    dateTime: '2026-02-26T13:45:00Z',
                    userName: 'Alex Rivera',
                    userRole: 'Admin',
                    ipAddress: '192.168.1.45',
                    actionType: 'Update',
                    action: 'Updated Security Alert: "High CPU Usage"',
                    objectType: 'Alerts'
                },
                {
                    id: 'log_9',
                    dateTime: '2026-02-26T09:00:00Z',
                    userName: 'John Doe',
                    userRole: 'Manager',
                    ipAddress: '10.0.0.12',
                    actionType: 'Update',
                    action: 'Changed Team: "Engineering" capacity',
                    objectType: 'Team'
                },
                {
                    id: 'log_10',
                    dateTime: '2026-02-25T17:05:00Z',
                    userName: 'Jane Smith',
                    userRole: 'Owner',
                    ipAddress: '192.168.1.1',
                    actionType: 'Create',
                    action: 'Created New API Token: "CRM Connector"',
                    objectType: 'API Token'
                },
                {
                    id: 'log_11',
                    dateTime: '2026-02-25T14:30:00Z',
                    userName: 'Sarah Wilson',
                    userRole: 'HR',
                    ipAddress: '172.16.0.5',
                    actionType: 'Update',
                    action: 'Updated Employee Profile: "Robert Brown"',
                    objectType: 'Employee'
                },
                {
                    id: 'log_12',
                    dateTime: '2026-02-25T10:15:00Z',
                    userName: 'Alex Rivera',
                    userRole: 'Admin',
                    ipAddress: '192.168.1.45',
                    actionType: 'Delete',
                    action: 'Removed Team: "Marketing Interns"',
                    objectType: 'Team'
                },
                {
                    id: 'log_13',
                    dateTime: '2026-02-24T16:40:00Z',
                    userName: 'Jane Smith',
                    userRole: 'Owner',
                    ipAddress: '192.168.1.1',
                    actionType: 'Update',
                    action: 'Modified Organization Name',
                    objectType: 'Settings'
                },
                {
                    id: 'log_14',
                    dateTime: '2026-02-24T11:20:00Z',
                    userName: 'John Doe',
                    userRole: 'Manager',
                    ipAddress: '10.0.0.12',
                    actionType: 'Create',
                    action: 'Created Task: "Draft UI Specs"',
                    objectType: 'Task'
                },
                {
                    id: 'log_15',
                    dateTime: '2026-02-24T09:50:00Z',
                    userName: 'Alex Rivera',
                    userRole: 'Admin',
                    ipAddress: '192.168.1.45',
                    actionType: 'Update',
                    action: 'Updated Screenshots frequency',
                    objectType: 'Settings'
                }
            ],
            filters: {
                dateRange: 'today',
                users: [],
                userRoles: []
            },
            sortConfig: {
                key: 'dateTime',
                direction: 'desc'
            },

            // Actions
            addLog: (log) => {
                const newLog = {
                    id: `log_${Math.random().toString(36).substr(2, 9)}`,
                    dateTime: new Date().toISOString(),
                    ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`, // Simulating IP
                    ...log
                };
                set((state) => ({
                    auditLogs: [newLog, ...state.auditLogs]
                }));
            },

            setFilters: (newFilters) => {
                set((state) => ({
                    filters: { ...state.filters, ...newFilters }
                }));
            },

            setSort: (key) => {
                set((state) => {
                    const direction = state.sortConfig.key === key && state.sortConfig.direction === 'desc' ? 'asc' : 'desc';
                    return { sortConfig: { key, direction } };
                });
            },

            clearFilters: () => {
                set({
                    filters: {
                        dateRange: 'today',
                        users: [],
                        userRoles: []
                    }
                });
            }
        }),
        {
            name: 'audit-logs-storage'
        }
    )
);
