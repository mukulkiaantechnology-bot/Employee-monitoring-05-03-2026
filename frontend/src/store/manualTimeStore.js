import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const PRODUCTIVITY_OPTIONS = [
    { id: 'productive', label: 'Productive', color: 'emerald' },
    { id: 'neutral', label: 'Neutral', color: 'slate' },
    { id: 'unproductive', label: 'Unproductive', color: 'rose' },
];

const INITIAL_TYPES = [
    {
        id: '1',
        title: 'Phone call',
        autoApproval: false,
        billable: true,
        productivity: 'productive',
        maxDuration: 180,
        projectRequired: false,
    },
    {
        id: '2',
        title: 'Internal meeting',
        autoApproval: false,
        billable: false,
        productivity: 'productive',
        maxDuration: 480,
        projectRequired: false,
    },
    {
        id: '3',
        title: 'Training',
        autoApproval: false,
        billable: false,
        productivity: 'productive',
        maxDuration: 480,
        projectRequired: false,
    },
    {
        id: '4',
        title: 'Field work (Work performed out of the office)',
        autoApproval: false,
        billable: true,
        productivity: 'productive',
        maxDuration: 480,
        projectRequired: false,
    },
    {
        id: '5',
        title: 'Meeting with clients',
        autoApproval: false,
        billable: true,
        productivity: 'productive',
        maxDuration: 480,
        projectRequired: false,
    },
];

export const useManualTimeStore = create(
    persist(
        (set) => ({
            types: INITIAL_TYPES,

            addType: (typeData) =>
                set((state) => ({
                    types: [
                        ...state.types,
                        { id: `type_${Date.now()}`, ...typeData },
                    ],
                })),

            updateType: (id, updatedData) =>
                set((state) => ({
                    types: state.types.map((t) =>
                        t.id === id ? { ...t, ...updatedData } : t
                    ),
                })),

            deleteType: (id) =>
                set((state) => ({
                    types: state.types.filter((t) => t.id !== id),
                })),

            toggleAutoApproval: (id) =>
                set((state) => ({
                    types: state.types.map((t) =>
                        t.id === id ? { ...t, autoApproval: !t.autoApproval } : t
                    ),
                })),
        }),
        { name: 'manual-time-storage' }
    )
);
