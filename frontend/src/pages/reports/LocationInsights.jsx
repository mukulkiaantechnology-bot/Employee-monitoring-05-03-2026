import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin,
    Building2,
    Home,
    Share2,
    Calendar as CalendarIcon,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    User,
    Users2,
    Globe2,
    HelpCircle,
    Monitor,
    Plus,
    Settings as SettingsIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../../store/locationStore';
import { useRealTime } from '../../hooks/RealTimeContext';
import { cn } from '../../utils/cn';

import { useReportsStore } from '../../store/reportsStore';

const presets = [
    "Today", "Yesterday", "This Week", "Last 7 Days",
    "Previous Week", "This Month", "Previous Month",
    "Last 3 Months", "Last 6 Months"
];

export function LocationInsights() {
    const navigate = useNavigate();
    const { locationSettings, updateThreshold } = useLocationStore();
    const { locations, attendanceThreshold: globalThreshold } = locationSettings;
    const { locationLogs } = useRealTime();
    
    const { reportData, fetchReportData, loading } = useReportsStore();
    const rawData = reportData['location'] || [];

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Default to last 7 days
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const [hoverDate, setHoverDate] = useState(null);
    const [selectingEnd, setSelectingEnd] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState("Last 7 Days");
    const [selectedFilter, setSelectedFilter] = useState("All Locations");

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

    // 1. Update dates when preset changes
    useEffect(() => {
        if (selectedPreset !== 'Custom') {
            const { start, end } = getDatesFromPreset(selectedPreset);
            setStartDate(start);
            setEndDate(end);
        }
    }, [selectedPreset]);

    // 2. Fetch data when dates change
    useEffect(() => {
        if (startDate && endDate) {
            fetchReportData('location', { startDate, endDate });
        }
    }, [startDate?.getTime(), endDate?.getTime(), fetchReportData]);

    const activeData = React.useMemo(() => {
        return rawData.map(item => ({
            location: item.name,
            hours: Math.round(item.workHours * 10) / 10,
            employees: item.employees
        }));
    }, [rawData]);

    // --- Refs ---
    const calendarRef = useRef(null);
    const filterRef = useRef(null);

    // --- Outside Click Detection ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target) && !event.target.closest('.loc-cal-toggle')) {
                setIsCalendarOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Calendar Logic ---
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
        d1 && d2 &&
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    const isInRange = (date) => {
        if (!date || !startDate) return false;
        const compareEnd = selectingEnd && hoverDate ? hoverDate : endDate;
        if (!compareEnd) return false;
        const min = startDate < compareEnd ? startDate : compareEnd;
        const max = startDate < compareEnd ? compareEnd : startDate;
        return date > min && date < max;
    };

    const handleDateClick = (date) => {
        if (!selectingEnd) {
            setStartDate(date);
            setEndDate(null);
            setSelectingEnd(true);
        } else {
            if (date >= startDate) {
                setEndDate(date);
            } else {
                setEndDate(startDate);
                setStartDate(date);
            }
            setSelectingEnd(false);
            setHoverDate(null);
        }
    };

    // --- Handlers ---
    const handleApply = () => {
        setIsCalendarOpen(false);
    };

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setIsFilterOpen(false);
    };

    const getIcon = (loc) => {
        if (loc === 'Office') return <Building2 size={24} />;
        if (loc === 'Remote') return <Home size={24} />;
        return <Share2 size={24} />;
    };

    const maxHours = locations.length > 0 ? Math.max(...locations.map(d => d.attendanceThreshold * 1.5 || 10), 1) : 1;

    const formatDateRange = () => {
        if (selectedPreset !== 'Custom') return selectedPreset;
        if (!endDate) return startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Select range';
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Location Insights</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and analyze your location data.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Date Range Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className={`loc-cal-toggle flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm ring-1 transition-all ${isCalendarOpen ? 'bg-primary-50 text-primary-600 ring-primary-100 dark:bg-primary-900/20 dark:text-primary-400' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800'}`}
                        >
                            <CalendarIcon size={16} className={isCalendarOpen ? 'text-primary-600' : 'text-slate-400'} />
                            <span>{formatDateRange()}</span>
                        </button>

                        {/* Calendar Range Popover */}
                        {isCalendarOpen && (
                            <div
                                ref={calendarRef}
                                className="absolute left-0 mt-2 z-50 w-full sm:w-[580px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                            >
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Calendar</h3>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                            <Globe2 size={14} className="text-primary-600" />
                                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Employees' Time Zone</span>
                                            <ChevronDown size={12} className="text-slate-400" />
                                        </div>
                                    </div>

                                    {selectingEnd && (
                                        <div className="mb-4 text-[11px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl">
                                            Click to select the end date of your range
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Left: Calendar Grid */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-6 px-2">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">
                                                    {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                                                        <ChevronLeft size={16} />
                                                    </button>
                                                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-7 gap-1 text-center">
                                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                                    <div key={i} className="text-[10px] font-black text-slate-300 py-2">{d}</div>
                                                ))}
                                                {calendarDays.map((date, idx) => {
                                                    const isStart = isSameDay(date, startDate);
                                                    const isEnd = isSameDay(date, endDate);
                                                    const inRange = date && isInRange(date);
                                                    return (
                                                        <div key={idx} className={`h-9 flex items-center justify-center ${inRange ? 'bg-primary-50 dark:bg-primary-900/10' : ''} ${isStart && endDate ? 'rounded-l-full' : ''} ${isEnd ? 'rounded-r-full' : ''}`}>
                                                            {date ? (
                                                                <button
                                                                    onClick={() => { setSelectedPreset('Custom'); handleDateClick(date); }}
                                                                    onMouseEnter={() => selectingEnd && setHoverDate(date)}
                                                                    onMouseLeave={() => selectingEnd && setHoverDate(null)}
                                                                    className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${isStart || isEnd ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                                                >
                                                                    {date.getDate()}
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Right: Presets */}
                                        <div className="w-full md:w-40 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4 px-2">Preset Filters</p>
                                            <div className="space-y-0.5">
                                                {presets.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setSelectedPreset(p)}
                                                        className={`w-full px-3 py-2.5 text-left text-xs font-bold rounded-xl transition-all ${selectedPreset === p ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <button onClick={() => { setIsCalendarOpen(false); setSelectingEnd(false); }} className="flex-1 h-11 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 transition-all border border-slate-100 dark:border-slate-700">
                                            Cancel
                                        </button>
                                        <button onClick={handleApply} className="flex-1 h-11 rounded-xl bg-primary-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Filter Dropdown */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm ring-1 transition-all ${isFilterOpen ? 'bg-primary-50 text-primary-600 ring-primary-100' : 'bg-white text-primary-600 ring-primary-500/20 hover:bg-primary-50 dark:bg-slate-900 dark:ring-slate-800'}`}
                        >
                            <Plus size={14} className={`text-primary-600 transition-transform ${isFilterOpen ? 'rotate-45' : ''}`} />
                            <span>Add Filter</span>
                        </button>
                        {isFilterOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1 z-50 animate-in fade-in slide-in-from-top-1">
                                <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter By</p>
                                </div>
                                {[{ label: 'Employee', icon: User }, { label: 'Teams', icon: Users2 }].map(({ label, icon: Icon }) => (
                                    <button
                                        key={label}
                                        onClick={() => handleFilterSelect(label)}
                                        className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${selectedFilter === label ? 'bg-primary-50 text-primary-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <Icon size={16} className="text-slate-400" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Attendance Threshold */}
                    <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Attendance Threshold</span>
                        <HelpCircle size={14} className="text-slate-400 flex-shrink-0" />
                        <input
                            type="number"
                            min={0}
                            max={100}
                            value={globalThreshold}
                            onChange={(e) => updateThreshold(parseFloat(e.target.value) || 0)}
                            className="w-12 bg-transparent text-center text-sm font-black text-slate-900 dark:text-white outline-none"
                        />
                        <span className="text-slate-400 text-xs font-semibold">hours</span>
                    </div>

                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 transition-all">
                        <Download size={18} />
                    </button>

                    <button 
                        onClick={() => navigate('/settings/reports/location-insights')}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-800 hover:scale-105 active:scale-95 transition-all dark:bg-white dark:text-slate-900"
                    >
                        <SettingsIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Location Cards */}
            {activeData.length > 0 ? (
                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {activeData.map((item, idx) => {
                            const isCompliant = item.hours >= (globalThreshold / 7); // Rough daily threshold check
                            
                            return (
                                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative group transition-all hover:shadow-lg">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 group-hover:scale-110 transition-transform">
                                            {getIcon(item.location)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{item.location}</h3>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.employees} Employees</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-3xl font-black text-slate-900 dark:text-white">{item.hours}h</p>
                                            <div className="text-right">
                                                <p className={cn("text-xs font-bold", isCompliant ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                                                    {isCompliant ? 'Compliant' : 'Under Threshold'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Total Work Hours</p>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-700", isCompliant ? "bg-emerald-500" : "bg-amber-500")}
                                                style={{ width: `${Math.min((item.hours / (globalThreshold || 40)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="absolute -right-4 -bottom-4 opacity-5 text-slate-900 dark:text-white">
                                        {getIcon(item.location)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Map Placeholder */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800 mb-4">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white">Interactive Map View</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Geographic distribution of your workforce. Showing {locations.length} active work zones.</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <Monitor size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Office Locations</h3>
                    <p className="text-slate-500 text-center max-w-sm mb-8">
                        Add at least one location to take advantage of location insights throughout the Insightful.
                    </p>
                    <button 
                        onClick={() => navigate('/settings/reports/location-insights')}
                        className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all dark:bg-white dark:text-slate-900"
                    >
                        Configure Locations
                    </button>
                </div>
            )}
        </div>
    );
}
