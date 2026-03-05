import { create } from 'zustand';

// ─── Date Helpers ────────────────────────────────────────────────────────────

const toYMD = (d) => d.toISOString().split('T')[0];
const today = () => {
    const d = new Date();
    return toYMD(d);
};
const yesterday  = () => { const d = new Date(); d.setDate(d.getDate()-1); return toYMD(d); };
const last7Start = () => { const d = new Date(); d.setDate(d.getDate()-6); return toYMD(d); };
const last30Start= () => { const d = new Date(); d.setDate(d.getDate()-29); return toYMD(d); };
const thisMonthStart = () => { const d = new Date(); d.setDate(1); return toYMD(d); };

export function getDateRangeForPreset(preset) {
    const t = today();
    switch (preset) {
        case 'today':         return { start: t, end: t };
        case 'yesterday':     return { start: yesterday(), end: yesterday() };
        case 'last_7':        return { start: last7Start(), end: t };
        case 'last_30':       return { start: last30Start(), end: t };
        case 'this_month':    return { start: thisMonthStart(), end: t };
        case 'custom':        return null; // caller sets manually
        default:              return { start: t, end: t };
    }
}

// ─── Store ────────────────────────────────────────────────────────────────────

const INITIAL = getDateRangeForPreset('today');

export const useFilterStore = create((set) => ({
    dateRange: INITIAL,      // { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
    quickFilter: 'today',    // today | yesterday | last_7 | last_30 | this_month | custom
    selectedTeam: null,
    selectedEmployee: null,
    selectedProject: null,
    searchQuery: '',

    /** Quick preset change — auto-sets dateRange */
    setQuickFilter: (preset) => {
        const range = getDateRangeForPreset(preset);
        set({ quickFilter: preset, ...(range ? { dateRange: range } : {}) });
    },

    /** Manual custom range */
    setDateRange: (start, end) => {
        set({ dateRange: { start, end }, quickFilter: 'custom' });
    },

    setTeam:     (teamId)     => set({ selectedTeam: teamId }),
    setEmployee: (empId)      => set({ selectedEmployee: empId }),
    setProject:  (projId)     => set({ selectedProject: projId }),
    setSearch:   (q)          => set({ searchQuery: q }),

    resetFilters: () => set({
        dateRange: INITIAL,
        quickFilter: 'today',
        selectedTeam: null,
        selectedEmployee: null,
        selectedProject: null,
        searchQuery: '',
    }),
}));
