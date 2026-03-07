import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Globe,
    Monitor,
    Calendar as CalendarIcon,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    Search,
    Globe2,
    Users2,
    Tag,
    FolderOpen,
    CheckSquare
} from 'lucide-react';

import { useReportsStore } from '../../store/reportsStore';

const presets = [
    "Today", "Yesterday", "This Week", "Last 7 Days",
    "Previous Week", "This Month", "Previous Month",
    "Last 3 Months", "Last 6 Months"
];

const filterOptions = [
    { label: "Employees", icon: Users2 },
    { label: "Teams", icon: Users2 },
    { label: "Categories", icon: Tag },
    { label: "Projects", icon: FolderOpen },
    { label: "Tasks", icon: CheckSquare }
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

export function AppsWebsites() {
    const { reportData, fetchReportData, loading } = useReportsStore();
    const rawData = reportData['apps-websites'] || [];

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedPreset, setSelectedPreset] = useState("Last 7 Days");
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const calendarBtnRef = useRef(null);
    const filterRef = useRef(null);
    const closeCalendar = useCallback(() => setIsCalendarOpen(false), []);

    const getDatesFromPreset = (preset) => {
        const end = new Date();
        const start = new Date();
        switch (preset) {
            case 'Today': start.setHours(0, 0, 0, 0); break;
            case 'Yesterday': 
                start.setDate(start.getDate() - 1); start.setHours(0, 0, 0, 0);
                end.setDate(end.getDate() - 1); end.setHours(23, 59, 59, 999);
                break;
            case 'This Week': start.setDate(start.getDate() - start.getDay()); break;
            case 'Last 7 Days': start.setDate(start.getDate() - 7); break;
            case 'This Month': start.setDate(1); break;
            default: start.setDate(start.getDate() - 7);
        }
        return { start, end };
    };

    useEffect(() => {
        const { start, end } = getDatesFromPreset(selectedPreset);
        fetchReportData('apps-websites', { startDate: start, endDate: end });
    }, [selectedPreset, fetchReportData]);

    const activeData = React.useMemo(() => {
        return rawData.map(item => ({
            name: item.appName,
            usage: Math.round((item._sum.duration / 3600) * 10) / 10,
            type: item.productivity || 'Neutral'
        }));
    }, [rawData]);

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

    const displayData = activeData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApply = () => {
        setIsCalendarOpen(false);
        setSearchTerm("");
    };

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setIsFilterOpen(false);
    };

    const maxUsage = Math.max(...displayData.map(d => d.usage), 1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Apps &amp; Websites</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track application and website usage across your team.</p>
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
                                        <Globe2 size={14} className="text-primary-600" />
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
                            <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1 z-50">
                                <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter By</p>
                                </div>
                                {filterOptions.map(({ label, icon: Icon }) => (
                                    <button key={label} onClick={() => handleFilterSelect(label)} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${selectedFilter === label ? 'bg-primary-50 text-primary-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        <Icon size={16} className="text-slate-400" /><span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 shadow-sm">
                        <Search size={16} className="text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search apps..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none dark:text-slate-200 w-32"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 transition-all">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {displayData.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                    <div className="border-b border-slate-100 p-6 flex items-center justify-between dark:border-slate-800">
                        <h3 className="text-lg font-bold dark:text-white">
                            Top Applications &amp; Websites
                            {selectedFilter && <span className="ml-2 text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Filtered: {selectedFilter}</span>}
                        </h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Monitor size={12} /> Productive
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                                <Globe size={12} /> Neutral
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {displayData.map((item) => (
                                <div key={item.name} className="relative group p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/10 transition-all dark:border-slate-800 dark:hover:border-primary-900/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 rounded-lg bg-slate-50 text-slate-400 dark:bg-slate-800 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                            {item.type === 'Productive' ? <Monitor size={20} /> : <Globe size={20} />}
                                        </div>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">{item.usage}h</span>
                                    </div>
                                    <h4 className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-600 transition-colors">{item.name}</h4>
                                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{item.type}</p>
                                    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div className={`h-full rounded-full transition-all duration-700 ${item.type === 'Productive' ? 'bg-emerald-500' : 'bg-primary-500'}`} style={{ width: `${(item.usage / maxUsage) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <Monitor size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No data for the selected period</h3>
                    <p className="text-slate-500 text-center max-w-sm">
                        {searchTerm ? `No apps matching "${searchTerm}"` : "Try choosing a different time period in the calendar."}
                    </p>
                </div>
            )}
        </div>
    );
}
