import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Calendar as CalendarIcon,
    Download,
    Users2,
    BarChart2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    X,
    Globe,
    Monitor,
    Settings as SettingsIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReportsStore } from '../../store/reportsStore';

// --- Workload Dummy Data ---
const workloadDummyData = {
    today: [
        { team: "Engineering", hours: 120, capacity: 160 },
        { team: "Sales", hours: 60, capacity: 100 },
        { team: "HR", hours: 30, capacity: 50 }
    ],
    week: [
        { team: "Engineering", hours: 420, capacity: 560 },
        { team: "Sales", hours: 210, capacity: 350 }
    ],
    default: [
        { team: "Engineering", hours: 320, capacity: 420 },
        { team: "Design", hours: 180, capacity: 280 },
        { team: "Sales", hours: 260, capacity: 350 },
        { team: "Operations", hours: 145, capacity: 200 }
    ]
};

const presets = [
    "Today", "Yesterday", "This Week", "Last 7 Days",
    "Previous Week", "This Month", "Previous Month",
    "Last 3 Months", "Last 6 Months"
];

// ─── Fixed-position Calendar Popover ────────────────────────────────────────
function CalendarPopover({ buttonRef, isOpen, onClose, children }) {
    const [style, setStyle] = useState({});
    const popoverRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const popoverWidth = Math.min(720, window.innerWidth * 0.95);
        let left = rect.left;
        if (left + popoverWidth > window.innerWidth - 12) left = window.innerWidth - popoverWidth - 12;
        left = Math.max(12, left);
        setStyle({ position: 'fixed', top: rect.bottom + 8, left, width: popoverWidth, maxHeight: '85vh', zIndex: 9999 });
    }, [isOpen, buttonRef]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;
    return (
        <div ref={popoverRef} style={style} className="overflow-y-auto bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            {children}
        </div>
    );
}

export function WorkloadDistribution() {
    const navigate = useNavigate();
    const { reportsSettings } = useReportsStore();
    const { optimalFrom, optimalTo } = reportsSettings.workloadDistribution;

    const [activeData, setActiveData] = useState(workloadDummyData.default);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date("2026-02-26"));
    const [viewDate, setViewDate] = useState(new Date("2026-02-26"));
    const [selectedPreset, setSelectedPreset] = useState("Today");
    const [selectedFilter, setSelectedFilter] = useState(null);

    const calendarBtnRef = useRef(null);
    const filterRef = useRef(null);
    const closeCalendar = useCallback(() => setIsCalendarOpen(false), []);

    useEffect(() => {
        const handler = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) setIsFilterOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const calendarDays = React.useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    }, [viewDate]);

    const isSameDay = (d1, d2) =>
        d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    const handleApply = () => {
        if (selectedPreset === "Today") setActiveData(workloadDummyData.today);
        else if (selectedPreset === "This Week") setActiveData(workloadDummyData.week);
        else setActiveData(workloadDummyData.default);
        setIsCalendarOpen(false);
    };

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setIsFilterOpen(false);
        setActiveData([...activeData].sort(() => Math.random() - 0.5));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Workload Distribution</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and analyze your workload distribution data.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Calendar Button */}
                    <div className="relative">
                        <button
                            ref={calendarBtnRef}
                            onClick={() => setIsCalendarOpen(v => !v)}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm ring-1 transition-all ${isCalendarOpen ? 'bg-primary-50 text-primary-600 ring-primary-100 dark:bg-primary-900/20 dark:text-primary-400' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800'}`}
                        >
                            <CalendarIcon size={16} className={isCalendarOpen ? 'text-primary-600' : 'text-slate-400'} />
                            <span>{selectedPreset}</span>
                        </button>

                        <CalendarPopover buttonRef={calendarBtnRef} isOpen={isCalendarOpen} onClose={closeCalendar}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Calendar</h3>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <Globe size={14} className="text-primary-600" />
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Employees' Time Zone</span>
                                        <ChevronDown size={12} className="text-slate-400" />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-6 px-2">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                                {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400"><ChevronLeft size={16} /></button>
                                                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400"><ChevronRight size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-[10px] font-black text-slate-300 py-2">{d}</div>)}
                                            {calendarDays.map((date, idx) => (
                                                <div key={idx} className="h-9 flex items-center justify-center">
                                                    {date ? (
                                                        <button onClick={() => setSelectedDate(date)} className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${isSameDay(date, selectedDate) ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                                                            {date.getDate()}
                                                        </button>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 flex gap-3">
                                            <button onClick={closeCalendar} className="flex-1 h-11 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700 transition-all">Cancel</button>
                                            <button onClick={handleApply} className="flex-1 h-11 rounded-xl bg-primary-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all">Apply</button>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-40 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4 px-2">Preset Filters</p>
                                        <div className="space-y-0.5">
                                            {presets.map(p => (
                                                <button key={p} onClick={() => setSelectedPreset(p)} className={`w-full px-3 py-2.5 text-left text-xs font-bold rounded-xl transition-all ${selectedPreset === p ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CalendarPopover>
                    </div>

                    {/* Add Filter */}
                    <div className="relative" ref={filterRef}>
                        <button onClick={() => setIsFilterOpen(v => !v)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm ring-1 transition-all ${isFilterOpen ? 'bg-primary-50 text-primary-600 ring-primary-100' : 'bg-white text-primary-600 ring-primary-500/20 hover:bg-primary-50 dark:bg-slate-900 dark:ring-slate-800'}`}>
                            <X size={14} className={`text-primary-600 transition-transform ${isFilterOpen ? 'rotate-45' : ''}`} />
                            <span>Add Filter</span>
                        </button>
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1 z-50">
                                <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter By</p>
                                </div>
                                {['Teams', 'Category'].map(f => (
                                    <button key={f} onClick={() => handleFilterSelect(f)} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${selectedFilter === f ? 'bg-primary-50 text-primary-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        {f === 'Teams' ? <Users2 size={16} className="text-slate-400" /> : <BarChart2 size={16} className="text-slate-400" />}
                                        <span>{f}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 transition-all">
                        <Download size={18} />
                    </button>

                    <button 
                        onClick={() => navigate('/settings/reports/workload-distribution')}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-800 hover:scale-105 active:scale-95 transition-all dark:bg-white dark:text-slate-900"
                    >
                        <SettingsIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeData.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {activeData.map((item) => {
                        const pct = Math.round((item.hours / item.capacity) * 100);
                        return (
                            <div key={item.team} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                                            <Users2 size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{item.team}</h3>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        pct >= optimalFrom && pct <= optimalTo 
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                            : pct > optimalTo
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}>
                                        {pct >= optimalFrom && pct <= optimalTo 
                                            ? 'Optimal' 
                                            : pct > optimalTo 
                                                ? 'Overloaded' 
                                                : 'Underloaded'}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Utilized Hours</p>
                                            <p className="text-3xl font-black text-slate-900 dark:text-white">{item.hours}<span className="text-lg font-bold text-slate-400">/ {item.capacity}</span></p>
                                        </div>
                                        <p className="text-sm font-bold text-primary-600 dark:text-primary-400">{pct}% Used</p>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ${
                                                pct >= optimalFrom && pct <= optimalTo 
                                                    ? 'bg-emerald-500' 
                                                    : pct > optimalTo 
                                                        ? 'bg-red-500' 
                                                        : 'bg-amber-500'
                                            }`} 
                                            style={{ width: `${pct}%` }} 
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-1.5">
                                            <BarChart2 size={14} className="text-slate-400" />
                                            <span className="text-xs font-medium text-slate-500">Efficiency: {Math.min(pct + 4, 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <Monitor size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No data for the selected period</h3>
                    <p className="text-slate-500 text-center max-w-sm">Try choosing a different time period in the calendar.</p>
                </div>
            )}
        </div>
    );
}
