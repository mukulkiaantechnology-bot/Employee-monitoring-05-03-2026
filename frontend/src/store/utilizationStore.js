import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const makeId = () => Math.random().toString(36).slice(2, 9);

export const FORMULA_TYPES = [
    {
        id: 'standard_hours',
        label: 'Standard Hours',
        desc: 'For organizations that have a set number of working hours per day.',
    },
    {
        id: 'scheduled_hours',
        label: 'Scheduled Hours',
        desc: 'For organizations with scheduled shifts. Utilization is calculated only during scheduled shift hours.',
    },
    {
        id: 'active_hours',
        label: 'Active Hours',
        desc: 'Time spent actively on computer and manual time not counting breaks and idle time.',
    },
    {
        id: 'work_hours',
        label: 'Work Hours',
        desc: 'Calculated from first clock-in until clock-out including active, idle, manual time, meetings and breaks.',
    },
];

const INITIAL_FORMULAS = [
    {
        id: 'f1',
        name: 'Organizational',
        type: 'standard_hours',
        author: 'system',
        teams: 'all',
        teamCount: 1,
        createdAt: '2026-02-26',
        lastEdited: null,
        isDefault: true,
        config: { standardDailyHours: 8 },
    },
];

export const useUtilizationStore = create(
    persist(
        (set, get) => ({
            formulas: INITIAL_FORMULAS,
            filters: { author: null, type: null, teams: null },
            search: '',

            addFormula: (formula) =>
                set((s) => ({
                    formulas: [
                        // if new is default, strip default from others
                        ...s.formulas.map((f) =>
                            formula.isDefault ? { ...f, isDefault: false } : f
                        ),
                        {
                            ...formula,
                            id: makeId(),
                            createdAt: new Date().toISOString().split('T')[0],
                            lastEdited: null,
                            author: 'user',
                        },
                    ],
                })),

            updateFormula: (id, updates) =>
                set((s) => ({
                    formulas: s.formulas.map((f) => {
                        if (f.id !== id) {
                            // If marking another as default, strip current
                            if (updates.isDefault) return { ...f, isDefault: false };
                            return f;
                        }
                        return { ...f, ...updates, lastEdited: new Date().toISOString().split('T')[0] };
                    }),
                })),

            deleteFormula: (id) =>
                set((s) => ({
                    formulas: s.formulas.filter((f) => f.id !== id),
                })),

            setDefaultFormula: (id) =>
                set((s) => ({
                    formulas: s.formulas.map((f) => ({ ...f, isDefault: f.id === id })),
                })),

            setSearch: (q) => set(() => ({ search: q })),
            applyFilter: (key, value) =>
                set((s) => ({ filters: { ...s.filters, [key]: value } })),
            resetFilters: () =>
                set(() => ({ filters: { author: null, type: null, teams: null } })),

            getFiltered: () => {
                const { formulas, filters, search } = get();
                return formulas.filter((f) => {
                    const q = search.toLowerCase();
                    if (q && !f.name.toLowerCase().includes(q) && !f.author.toLowerCase().includes(q)) return false;
                    if (filters.author && f.author !== filters.author) return false;
                    if (filters.type && f.type !== filters.type) return false;
                    if (filters.teams && f.teams !== filters.teams) return false;
                    return true;
                });
            },
        }),
        { name: 'utilization-storage-v1' }
    )
);
