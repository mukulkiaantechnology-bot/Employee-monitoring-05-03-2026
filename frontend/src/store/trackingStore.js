import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const makeId = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_PROFILE = {
    id: makeId(),
    title: 'Company Computers',
    computerType: 'company', // company | personal
    default: true,
    visibility: 'stealth', // visible | stealth
    screenshotsPerHour: 0,
    allowAccessScreenshots: false,
    allowRemoveScreenshots: false,
    breakTime: 0, // minutes
    allowOverBreak: false,
    allowNewBreaks: false,
    idleTime: 2, // minutes
    trackingScenario: 'unlimited', // unlimited | fixed | network | vpn | manual | project
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    trackTasks: false,
    allowAddTasks: false,
    permissions: {
        canAnalyze: false,
        canSeeApps: false,
        canAddManual: false,
    },
};

const PERSONAL_PROFILE = {
    id: makeId(),
    title: 'Personal Computers',
    computerType: 'personal',
    default: false,
    visibility: 'visible',
    screenshotsPerHour: 0,
    allowAccessScreenshots: false,
    allowRemoveScreenshots: false,
    breakTime: 0,
    allowOverBreak: false,
    allowNewBreaks: false,
    idleTime: 2,
    trackingScenario: 'manual',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    trackTasks: true,
    allowAddTasks: false,
    permissions: {
        canAnalyze: false,
        canSeeApps: false,
        canAddManual: false,
    },
};

const INITIAL_ADVANCED = {
    shiftThreshold: 4,
    strictTime: false,
    inactivityPopups: true,
    identificationMode: 'hwid', // hwid | computer-user | computer
    showEngagement: false,
    useActiveDirectory: true,
    adEmail: true,
    adTeam: true,
    adTrackingSettings: false,
};

export const TRACKING_SCENARIOS = [
    { id: 'unlimited', label: 'Unlimited', desc: 'Track activities constantly' },
    { id: 'fixed', label: 'Fixed', desc: 'Track during fixed working hours' },
    { id: 'network', label: 'Network based', desc: 'Track when computer is connected to a specified network' },
    { id: 'vpn', label: 'VPN based', desc: 'Track only when the computer is connected to a VPN network' },
    { id: 'manual', label: 'Manual Clock In', desc: 'Track when user clock-ins manually' },
    { id: 'project', label: 'Project Based', desc: 'Track when user works on tasks and projects' },
];

export const SCREENSHOT_OPTIONS = [
    { value: 0, label: 'No screenshots' },
    { value: 1, label: '1 per hour' },
    { value: 3, label: '3 per hour' },
    { value: 6, label: '6 per hour' },
];

export const BREAK_TIME_OPTIONS = [
    { value: 0, label: 'No break time' },
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 60, label: '60 min' },
];

export const IDLE_TIME_OPTIONS = [
    { value: 1, label: '1 min' },
    { value: 2, label: '2 min' },
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const SHIFT_THRESHOLD_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} hour${i + 1 !== 1 ? 's' : ''}`,
}));

export const useTrackingStore = create(
    persist(
        (set, get) => ({
            trackingProfiles: [DEFAULT_PROFILE, PERSONAL_PROFILE],
            advancedSettings: INITIAL_ADVANCED,

            createProfile: (profile) =>
                set((s) => ({
                    trackingProfiles: [...s.trackingProfiles, { ...profile, id: makeId(), default: false }],
                })),

            updateProfile: (id, updates) =>
                set((s) => ({
                    trackingProfiles: s.trackingProfiles.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                })),

            deleteProfile: (id) =>
                set((s) => ({
                    trackingProfiles: s.trackingProfiles.filter((p) => p.id !== id),
                })),

            setDefaultProfile: (id) =>
                set((s) => ({
                    trackingProfiles: s.trackingProfiles.map((p) => ({
                        ...p,
                        default: p.id === id,
                    })),
                })),

            updateAdvancedSettings: (updates) =>
                set((s) => ({
                    advancedSettings: { ...s.advancedSettings, ...updates },
                })),
        }),
        { name: 'tracking-storage' }
    )
);
