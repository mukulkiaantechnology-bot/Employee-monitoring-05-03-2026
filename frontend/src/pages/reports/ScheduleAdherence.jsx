import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Calendar as CalendarIcon,
    Download,
    ChevronDown,
    User,
    CheckCircle2,
    MinusCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    X,
    Users2,
    Globe
} from 'lucide-react';
import { useReportsStore } from '../../store/reportsStore';

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
        if (left + popoverWidth > window.innerWidth - 12) {
            left = window.innerWidth - popoverWidth - 12;
        }
        left = Math.max(12, left);
        setStyle({
            position: 'fixed',
            top: rect.bottom + 8,
            left,
            width: popoverWidth,
            maxHeight: '85vh',
            zIndex: 9999,
        });
    }, [isOpen, buttonRef]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target) && !buttonRef.current?.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;
    return (
        <div
            ref={popoverRef}
            style={style}
            className="overflow-y-auto bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {children}
        </div>
    );
}

export function ScheduleAdherence() {
    const { reportData, fetchReportData, loading } = useReportsStore();
    const data = reportData['adherence'] || [];

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedPreset, setSelectedPreset] = useState('Last 7 Days');
    const [selectedCompare, setSelectedCompare] = useState('Compare to');

    const calendarBtnRef = useRef(null);
    const compareRef = useRef(null);
    const filterRef = useRef(null);

    const closeCalendar = useCallback(() => setIsCalendarOpen(false), []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (compareRef.current && !compareRef.current.contains(event.target)) setIsCompareOpen(false);
            if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        fetchReportData('adherence', { startDate: start, endDate: end });
    }, [selectedPreset, fetchReportData]);

    const handleApplyCalendar = () => {
        setSelectedPreset(selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
        setIsCalendarOpen(false);
    };

    const handleCompareOption = (option) => {
        setSelectedCompare(option);
        setIsCompareOpen(false);
    };

    const handleFilterOption = () => {
        setIsFilterOpen(false);
    };

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Schedule Adherence</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and analyze your schedule adherence data.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Date Button */}
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
                                                        <button
                                                            onClick={() => setSelectedDate(date)}
                                                            className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${isSameDay(date, selectedDate) ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                                        >
                                                            {date.getDate()}
                                                        </button>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 flex gap-3">
                                            <button onClick={closeCalendar} className="flex-1 h-11 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700 transition-all">Cancel</button>
                                            <button onClick={handleApplyCalendar} className="flex-1 h-11 rounded-xl bg-primary-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all">Apply</button>
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

                    {/* Compare To */}
                    <div className="relative" ref={compareRef}>
                        <button onClick={() => setIsCompareOpen(v => !v)} className={`flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold shadow-sm ring-1 transition-all ${isCompareOpen ? 'text-primary-600 ring-primary-100 dark:bg-primary-900/20' : 'text-slate-700 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800'}`}>
                            <span>{selectedCompare}</span>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isCompareOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isCompareOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1 z-50">
                                {['Previous Period', 'Previous Month', 'Custom Range'].map(opt => (
                                    <button key={opt} onClick={() => handleCompareOption(opt)} className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">{opt}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add Filter */}
                    <div className="relative" ref={filterRef}>
                        <button onClick={() => setIsFilterOpen(v => !v)} className={`flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-primary-500/10 transition-all ${isFilterOpen ? 'text-primary-600 bg-primary-50' : 'text-primary-600 hover:bg-primary-50'}`}>
                            <X size={14} className={`text-primary-600 transition-transform ${isFilterOpen ? 'rotate-45' : ''}`} />
                            <span>Add Filter</span>
                        </button>
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1 z-50">
                                <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter By</p>
                                </div>
                                {[{ label: 'Employees', icon: User }, { label: 'Teams', icon: Users2 }].map(({ label, icon: Icon }) => (
                                    <button key={label} onClick={handleFilterOption} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                        <Icon size={16} className="text-slate-400" /><span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-6">
                <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                    <div className="border-b border-slate-100 p-8 dark:border-slate-800">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Employee Adherence</h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.map((item) => (
                            <div key={item.employee} className="flex items-center justify-between p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">{item.employee}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.adherence >= 90 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : item.adherence >= 80 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {item.status}
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">Shift Adherence</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Score</p>
                                        <div className="flex items-center gap-1">
                                            {item.adherence >= 90 ? <CheckCircle2 size={16} className="text-emerald-500" /> : item.adherence >= 80 ? <MinusCircle size={16} className="text-amber-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                                            <span className={`text-xl font-black ${item.adherence >= 90 ? 'text-emerald-600' : item.adherence >= 80 ? 'text-amber-600' : 'text-rose-600'}`}>{item.adherence}%</span>
                                        </div>
                                    </div>
                                    <div className="h-14 w-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${item.adherence >= 90 ? 'bg-emerald-500' : item.adherence >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ height: `${item.adherence}%`, marginTop: `${100 - item.adherence}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
