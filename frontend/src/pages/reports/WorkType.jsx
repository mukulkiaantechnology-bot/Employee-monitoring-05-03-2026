import React, { useState, useEffect, useRef } from 'react';
import { 
    Calendar, 
    ChevronLeft, 
    ChevronRight, 
    ChevronDown, 
    X, 
    User, 
    Users2, 
    BarChart2, 
    Monitor, 
    Download 
} from 'lucide-react';
import { useReportsStore } from '../../store/reportsStore';
import { useFilterStore } from '../../store/filterStore';
import { FilterDropdown } from '../../components/FilterDropdown';

const presets = [
    "Today", "Yesterday", "This Week", "Last 7 Days",
    "Previous Week", "This Month", "Previous Month",
    "Last 3 Months", "Last 6 Months"
];

export function WorkType() {
    const { reportData, fetchReportData, loading } = useReportsStore();
    const { selectedEmployee, selectedTeam } = useFilterStore();
    // --- State ---
    const [activeTab, setActiveTab] = useState('category'); // 'category' or 'tags'
    const [activePeriod, setActivePeriod] = useState('Last 7 Days');

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedPreset, setSelectedPreset] = useState('Last 7 Days');

    // --- Refs for Click Outside ---
    const calendarRef = useRef(null);

    // --- Calendar Logic ---
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const calendarDays = React.useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    }, [viewDate]);

    const changeMonth = (offset) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    // --- Effects ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                // Check if the click target isn't the toggle button too
                if (!event.target.closest('.calendar-toggle')) setIsCalendarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch data based on period
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
        const { start, end } = getDatesFromPreset(activePeriod);
        fetchReportData('work-type', { 
            startDate: start, 
            endDate: end,
            userId: selectedEmployee,
            teamId: selectedTeam
        });
    }, [activePeriod, fetchReportData, selectedEmployee, selectedTeam]);

    const rawData = reportData['work-type'] || [];
    const activeData = React.useMemo(() => {
        const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-indigo-500", "bg-slate-400"];
        const formatLabel = (label) => {
            if (!label) return "Unknown";
            // Convert PRODUCTIVE to Productive, etc.
            return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
        };

        return rawData.map((item, idx) => ({
            name: formatLabel(item.productivity || item.appName),
            hours: Math.round((item.duration / 3600) * 10) / 10,
            color: colors[idx % colors.length]
        }));
    }, [rawData]);

    // --- Handlers ---
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // In a real app, tags might fetch a different endpoint or use different grouping
    };

    const handleCancelCalendar = () => {
        setIsCalendarOpen(false);
    };

    const handleApplyCalendar = () => {
        setActivePeriod(selectedPreset);
        setIsCalendarOpen(false);
    };

    const totalHours = activeData.reduce((acc, curr) => acc + curr.hours, 0);

    return (
        <div className="space-y-6">
            {/* Header / Tabs */}
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports</h1>
                    <div className="mt-4 flex items-center border-b border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => handleTabChange('category')}
                            className={`px-4 py-2 text-sm font-bold transition-all relative ${activeTab === 'category' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Category
                            {activeTab === 'category' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full" />}
                        </button>
                        <button
                            onClick={() => handleTabChange('tags')}
                            className={`px-4 py-2 text-sm font-bold transition-all relative ${activeTab === 'tags' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Tags
                            {activeTab === 'tags' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full" />}
                        </button>
                    </div>
                </div>

                <div className="relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Period Select / Calendar Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                className={`calendar-toggle rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 shadow-sm ring-1 ${isCalendarOpen ? 'bg-primary-50 text-primary-600 ring-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-900/40' : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800'}`}
                            >
                                <Calendar size={14} />
                                {selectedPreset}
                            </button>

                            {/* Calendar Popover */}
                            {isCalendarOpen && (
                                <div
                                    ref={calendarRef}
                                    className="absolute left-0 mt-2 z-50 w-full md:w-[600px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-top-2 duration-300"
                                >
                                    {/* Left: Calendar Section */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Calendar</h3>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white min-w-[100px] text-center">
                                                    {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}
                                                </span>
                                                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 text-center mb-4">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                                <div key={day} className="text-[10px] font-black text-slate-300 uppercase py-2">{day}</div>
                                            ))}
                                            {calendarDays.map((date, idx) => (
                                                <div key={idx} className="h-10 flex items-center justify-center">
                                                    {date ? (
                                                        <button
                                                            onClick={() => setSelectedDate(date)}
                                                            className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${isSameDay(date, selectedDate) ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                                        >
                                                            {date.getDate()}
                                                        </button>
                                                    ) : <div className="h-8 w-8" />}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 flex gap-3">
                                            <button
                                                onClick={handleCancelCalendar}
                                                className="flex-1 h-12 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleApplyCalendar}
                                                className="flex-1 h-12 rounded-xl bg-primary-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-200 hover:brightness-95 transition-all"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Presets Section */}
                                    <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Preset Filters</h3>
                                        <div className="space-y-1">
                                            {presets.map(preset => (
                                                <button
                                                    key={preset}
                                                    onClick={() => setSelectedPreset(preset)}
                                                    className={`w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${selectedPreset === preset ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                                >
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <FilterDropdown />
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800 transition-all">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Content / Data Listing */}
            <div className="grid gap-6">
                {activeData.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Dynamic List */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="mb-6 text-lg font-bold dark:text-white">Distribution by {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                            <div className="space-y-6">
                                {activeData.map((item) => (
                                    <div key={item.name} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{item.hours}h ({Math.round((item.hours / totalHours) * 100)}%)</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className={`h-full rounded-full ${item.color} transition-all duration-700`}
                                                style={{ width: `${(item.hours / totalHours) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="rounded-2xl border border-slate-200 bg-primary-600 p-6 shadow-lg shadow-primary-500/20 text-white">
                            <h3 className="mb-2 text-lg font-bold">Total Time ({activePeriod})</h3>
                            <p className="text-4xl font-black">{totalHours} Hours</p>
                            <p className="mt-4 text-sm text-primary-100">Performance insights based on selected {activeTab} data.</p>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-md">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">Focus Score</p>
                                    <p className="text-lg font-bold">92 / 100</p>
                                </div>
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-md">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">Trend</p>
                                    <p className="text-lg font-bold">+12.5%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Monitor size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No data for the selected period</h3>
                        <p className="text-slate-500 text-center max-w-sm">Try choosing a different time period or adjusting your filters in the dashboard.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
