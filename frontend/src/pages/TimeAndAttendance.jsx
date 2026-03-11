import React, { useState, useEffect, useMemo } from 'react';
import {
    Bell,
    Calendar,
    Search,
    Download,
    LayoutGrid,
    Plus,
    Clock,
    User,
    Play,
    Info,
    ChevronDown,
    Zap,
    History,
    AlertTriangle,
    ShieldAlert,
    X,
    Loader
} from 'lucide-react';
import { GlobalCalendar } from '../components/GlobalCalendar';
import { AddManualTimeModal } from '../components/AddManualTimeModal';
import { AddTimeOffModal } from '../components/AddTimeOffModal';
import { ImportTimeOffModal } from '../components/ImportTimeOffModal';
import { Upload } from 'lucide-react';
import { useRealTime } from '../hooks/RealTimeContext';
import { useShiftLogic, sampleShiftData } from '../hooks/useShiftLogic';
import { cn } from '../utils/cn';
import useAttendanceStore from '../store/attendanceStore';
import { useFilterStore } from '../store/filterStore';
import { format, addDays, startOfWeek, parseISO, isWithinInterval, isSameDay } from 'date-fns';
import { createPortal } from 'react-dom';

export function TimeAndAttendance() {
    const { employees } = useRealTime();
    const [activeTab, setActiveTab] = useState('Timesheets');
    const [viewMode, setViewMode] = useState('Day View');
    const [isManualTimeModalOpen, setIsManualTimeModalOpen] = useState(false);
    const [isTimeOffMenuOpen, setIsTimeOffMenuOpen] = useState(false);
    const [isAddTimeOffModalOpen, setIsAddTimeOffModalOpen] = useState(false);
    const [isImportTimeOffModalOpen, setIsImportTimeOffModalOpen] = useState(false);
    const [isAddShiftsOpen, setIsAddShiftsOpen] = useState(false);
    const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
    const [generalSearch, setGeneralSearch] = useState('');
    const [scheduleSearch, setScheduleSearch] = useState('');
    const [showShifts, setShowShifts] = useState(true);
    const [showTimeOff, setShowTimeOff] = useState(true);
    const { checkShiftStatus } = useShiftLogic();

    const { dateRange, selectedTeam, selectedEmployee } = useFilterStore();

    const {
        timesheets,
        manualTimes,
        shifts,
        timeOffs,
        loading,
        fetchTimesheets,
        fetchManualTimes,
        fetchShifts,
        fetchTimeOffs,
        addShift,
        clockIn,
        clockOut
    } = useAttendanceStore();

    // Re-fetch all data when date range or filters change
    useEffect(() => {
        const params = {
            startDate: dateRange?.start,
            endDate: dateRange?.end,
            teamId: selectedTeam,
            employeeId: selectedEmployee
        };
        fetchTimesheets(params);
        fetchManualTimes(params);
        fetchShifts(params);
        fetchTimeOffs(params);
    }, [dateRange, selectedTeam, selectedEmployee, fetchTimesheets, fetchManualTimes, fetchShifts, fetchTimeOffs]);

    // Build the 7-day grid starting from the start of the filter week (or today's week)
    const gridDays = useMemo(() => {
        const base = dateRange?.start ? parseISO(dateRange.start) : new Date();
        const weekStart = startOfWeek(base, { weekStartsOn: 1 }); // Monday
        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }, [dateRange]);

    // Unique employees who have shifts in current view
    const scheduleEmployees = useMemo(() => {
        const empMap = new Map();
        shifts.forEach(s => {
            if (!empMap.has(s.employeeId)) empMap.set(s.employeeId, s.employee?.fullName || 'Unknown');
        });
        timeOffs.forEach(t => {
            if (!empMap.has(t.employeeId)) empMap.set(t.employeeId, t.employee?.fullName || 'Unknown');
        });
        // Also include all org employees
        employees.forEach(e => {
            if (!empMap.has(e.id)) empMap.set(e.id, e.fullName || e.name || 'Unknown');
        });
        return Array.from(empMap, ([id, name]) => ({ id, name }));
    }, [shifts, timeOffs, employees]);

    // Filtered lists for various tabs
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch = (emp.fullName || emp.name || '').toLowerCase().includes(generalSearch.toLowerCase());
            const matchesTeam = !selectedTeam || emp.teamId === selectedTeam;
            const matchesEmp = !selectedEmployee || emp.id === selectedEmployee;
            return matchesSearch && matchesTeam && matchesEmp;
        });
    }, [employees, generalSearch, selectedTeam, selectedEmployee]);

    const filteredScheduleEmps = useMemo(() => {
        return scheduleEmployees.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(scheduleSearch.toLowerCase());
            const orgEmp = employees.find(e => e.id === emp.id);
            const matchesTeam = !selectedTeam || orgEmp?.teamId === selectedTeam;
            const matchesEmp = !selectedEmployee || emp.id === selectedEmployee;
            return matchesSearch && matchesTeam && matchesEmp;
        });
    }, [scheduleEmployees, scheduleSearch, selectedTeam, selectedEmployee, employees]);


    const handleDownload = () => {
        if (!timesheets.length) return alert('No data to download');
        const rows = [['Name', 'Location', 'Team', 'Date', 'Clock-in', 'Clock-out', 'Duration'],
        ...timesheets.map(r => [
            r.employee?.fullName,
            r.employee?.location,
            r.employee?.team?.name,
            format(new Date(r.date), 'MMM dd, yyyy'),
            r.clockIn ? format(new Date(r.clockIn), 'hh:mm a') : '--',
            r.clockOut ? format(new Date(r.clockOut), 'hh:mm a') : '--',
            r.duration ? `${Math.floor(r.duration / 3600)}h ${Math.floor((r.duration % 3600) / 60)}m` : '--'
        ])];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'attendance_report.csv'; a.click();
        URL.revokeObjectURL(url);
    };


    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8 transition-colors duration-200">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Time and Attendance</h1>
                </div>
                <div className="flex items-center gap-4">
                    {activeTab === 'Timesheets' && (
                        <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
                            {['Day View', 'Shift View'].map(view => (
                                <button
                                    key={view}
                                    onClick={() => setViewMode(view)}
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-tight transition-all ${viewMode === view ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>
                    )}
                    {activeTab === 'Manual Time' && (
                        <button
                            onClick={() => setIsManualTimeModalOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg shadow-primary-200 uppercase tracking-wider"
                        >
                            Add Manual Time
                        </button>
                    )}
                    {activeTab === 'Schedules' && (
                        <div className="flex gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setIsTimeOffMenuOpen(!isTimeOffMenuOpen)}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg shadow-primary-200 uppercase tracking-wider flex items-center gap-2"
                                >
                                    Add Time Off <ChevronDown size={14} className={`transition-transform duration-200 ${isTimeOffMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isTimeOffMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsTimeOffMenuOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <button
                                                onClick={() => {
                                                    setIsAddTimeOffModalOpen(true);
                                                    setIsTimeOffMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <Plus size={16} className="text-primary-600 dark:text-primary-500" />
                                                <span className="text-xs font-bold">Add Time Off</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsImportTimeOffModalOpen(true);
                                                    setIsTimeOffMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <Upload size={16} className="text-primary-600 dark:text-primary-500" />
                                                <span className="text-xs font-bold">Import Time Off</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => setIsAddShiftsOpen(!isAddShiftsOpen)}
                                className="relative border border-primary-200 dark:border-primary-800/50 text-primary-600 dark:text-primary-400 px-4 py-2.5 rounded-lg text-xs font-black transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 uppercase tracking-wider flex items-center gap-2"
                            >
                                Add Shifts <ChevronDown size={14} className={`transition-transform duration-200 ${isAddShiftsOpen ? 'rotate-180' : ''}`} />
                                {isAddShiftsOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                                        <button className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            onClick={() => { setIsAddShiftModalOpen(true); setIsAddShiftsOpen(false); }}
                                        >
                                            <Plus size={16} className="text-primary-600" />
                                            <span className="text-xs font-bold normal-case tracking-normal">Add Shift</span>
                                        </button>
                                        <button className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <Upload size={16} className="text-primary-600" />
                                            <span className="text-xs font-bold normal-case tracking-normal">Import Shifts</span>
                                        </button>
                                    </div>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="overflow-x-auto mb-8">
                <div className="flex items-center gap-10 border-b border-slate-100 dark:border-slate-800 min-w-max">
                    {['Timesheets', 'Attendance', 'Manual Time', 'Schedules'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-black transition-all relative ${activeTab === tab ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-600 rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Hub */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <GlobalCalendar />

                <div className="ml-auto flex items-center gap-3">
                    {activeTab !== 'Schedules' && (
                        <div className="relative group w-full md:w-64">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={activeTab === 'Manual Time' ? "Search employee" : "Search employee or team"}
                                value={generalSearch}
                                onChange={(e) => setGeneralSearch(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-medium dark:text-slate-200 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    )}
                    {activeTab === 'Schedules' && (
                        <div className="relative group w-full md:w-64">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search employee..."
                                value={scheduleSearch}
                                onChange={(e) => setScheduleSearch(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-medium dark:text-slate-200 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    )}
                    {(activeTab === 'Timesheets' || activeTab === 'Manual Time') && (
                        <button
                            onClick={handleDownload}
                            title="Download CSV"
                            className="p-2 border border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm"
                        >
                            <Download size={18} strokeWidth={2.5} />
                        </button>
                    )}
                    {/* <button
                        onClick={() => setScheduleViewMode(scheduleViewMode === 'grid' ? 'list' : 'grid')}
                        className={`p-2 border rounded-lg transition-colors shadow-sm ${
                            scheduleViewMode === 'list'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                : 'border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                        title="Toggle View"
                    >
                        <LayoutGrid size={18} strokeWidth={2.5} />
                    </button> */}
                    {activeTab === 'Schedules' && (
                        <button
                            onClick={() => { setScheduleSearch(''); setShowShifts(true); setShowTimeOff(true); }}
                            className="p-2 border border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm"
                            title="Reset Filters"
                        >
                            <History size={18} strokeWidth={2.5} />
                        </button>
                    )}
                </div>
            </div>

            {/* Tab Specific Content */}
            {activeTab === 'Timesheets' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-[#fcfdfe] dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Employee Name</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Team</th>
                                <th className="px-6 py-4">Team Description</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Clock-in</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {timesheets.filter(row => {
                                const matchesSearch = (row.employee?.fullName?.toLowerCase() ?? '').includes(generalSearch.toLowerCase()) ||
                                    (row.employee?.team?.name?.toLowerCase() ?? '').includes(generalSearch.toLowerCase());
                                const matchesTeam = !selectedTeam || row.employee?.teamId === selectedTeam;
                                const matchesEmp = !selectedEmployee || row.employeeId === selectedEmployee;
                                return matchesSearch && matchesTeam && matchesEmp;
                            }).map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-xs font-black text-rose-600 border border-rose-200">
                                                {(row.employee?.fullName || row.employee?.name || '??').split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{row.employee?.fullName || row.employee?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-600 dark:text-slate-400 border-l border-slate-50 dark:border-slate-800">{row.employee?.location || 'Remote'}</td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-600 dark:text-slate-400">{row.employee?.team?.name || 'General'}</td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-400 dark:text-slate-500 italic">{row.employee?.team?.description}</td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-800 dark:text-slate-300">
                                        {format(new Date(row.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-800 dark:text-slate-300">
                                        <div className="flex items-center gap-1 group">
                                            {row.clockIn ? format(new Date(row.clockIn), 'hh:mm a') : '--'}
                                            {row.clockIn && <Play size={10} className="text-primary-500 fill-primary-500 rotate-90" />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && timesheets.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-bold">No attendance records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'Attendance' && (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-6 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary-200 dark:bg-primary-500/30"></div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Attended</span>
                            <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500">?</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Currently Working</span>
                            <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500">?</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full border border-slate-300 dark:border-slate-600"></div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Absent</span>
                            <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500">?</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Time Off</span>
                            <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500">?</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-orange-400"></div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Below Threshold</span>
                            <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500">?</div>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-900">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Attendance Threshold</span>
                                <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500">?</div>
                                <span className="text-xs font-black border-l border-slate-100 dark:border-slate-700 pl-3 ml-1 dark:text-slate-300">0</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold ml-2">minutes</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-48">Employee Name</th>
                                    {gridDays.map((date, i) => (
                                        <th key={i} className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                                            {format(date, 'MMM dd')}
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredEmployees.map((emp, idx) => {
                                    const empTimesheets = timesheets.filter(t => t.employeeId === emp.id);
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black border border-white bg-blue-100 text-blue-600`}>
                                                        {(emp.fullName || emp.name || '??').split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{emp.fullName || emp.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            {gridDays.map((date, i) => {
                                                const dayStr = format(date, 'yyyy-MM-dd');
                                                const hasAttended = empTimesheets.some(t => format(new Date(t.date), 'yyyy-MM-dd') === dayStr);
                                                return (
                                                    <td key={i} className="px-3 py-5 text-center">
                                                        <div className={`h-5 w-5 rounded-full mx-auto ${hasAttended ? 'bg-primary-400 dark:bg-primary-500/60' : 'border border-slate-300 dark:border-slate-700'}`} />
                                                    </td>
                                                );
                                            })}
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                                                    {empTimesheets.filter(t => {
                                                        const d = format(new Date(t.date), 'yyyy-MM-dd');
                                                        return gridDays.some(gd => format(gd, 'yyyy-MM-dd') === d);
                                                    }).length}/7
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr className="bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
                                    <td className="px-6 py-4"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Count</span></td>
                                    {gridDays.map((date, i) => {
                                        const dayStr = format(date, 'yyyy-MM-dd');
                                        const count = filteredEmployees.filter(emp =>
                                            timesheets.some(t => t.employeeId === emp.id && format(new Date(t.date), 'yyyy-MM-dd') === dayStr)
                                        ).length;
                                        return (
                                            <td key={i} className="px-3 py-4 text-center text-xs font-black text-slate-700 dark:text-slate-300">{count}</td>
                                        );
                                    })}
                                    <td className="px-6 py-4 text-center text-xs font-black text-primary-600">
                                        {filteredEmployees.reduce((acc, emp) => {
                                            const empTimesheets = timesheets.filter(t => t.employeeId === emp.id);
                                            return acc + empTimesheets.filter(t => {
                                                const d = format(new Date(t.date), 'yyyy-MM-dd');
                                                return gridDays.some(gd => format(gd, 'yyyy-MM-dd') === d);
                                            }).length;
                                        }, 0)}/{filteredEmployees.length * 7}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Shift Status Preview (Integrated from Alerts) */}
                    <div className="mt-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shift Compliance Preview</h3>
                                <p className="text-xs font-bold text-slate-400">Real-time status based on Alerts & Scheduling settings</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-black text-[10px] uppercase tracking-widest">
                                <Zap size={14} /> Live
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#fcfdfe] dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                                    <tr>
                                        <th className="px-8 py-4">Employee</th>
                                        <th className="px-8 py-4">Scheduled</th>
                                        <th className="px-8 py-4">Actual</th>
                                        <th className="px-8 py-4">Status & Alerts</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {shifts.map((shift) => {
                                        const attendance = timesheets.find(t =>
                                            t.employeeId === shift.employeeId &&
                                            format(new Date(t.date), 'yyyy-MM-dd') === format(new Date(shift.date), 'yyyy-MM-dd')
                                        );

                                        const actualStart = attendance?.clockIn ? format(new Date(attendance.clockIn), 'HH:mm') : null;
                                        const actualEnd = attendance?.clockOut ? format(new Date(attendance.clockOut), 'HH:mm') : null;

                                        const status = checkShiftStatus(
                                            shift.startTime,
                                            shift.endTime,
                                            actualStart,
                                            actualEnd
                                        );

                                        return (
                                            <tr key={shift.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-400">
                                                            {shift.employee?.fullName?.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{shift.employee?.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-xs font-bold text-slate-500">
                                                    {shift.startTime} – {shift.endTime}
                                                </td>
                                                <td className="px-8 py-6 text-xs font-bold text-slate-900 dark:text-white">
                                                    {actualStart ? `${actualStart} – ${actualEnd || '--:--'}` : '--'}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-wrap gap-2">
                                                        {!actualStart ? (
                                                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                                                                <ShieldAlert size={12} /> Absent
                                                            </span>
                                                        ) : !status.warning && !status.overtime && !status.incomplete ? (
                                                            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">On Track</span>
                                                        ) : (
                                                            <>
                                                                {status.warning && (
                                                                    <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-500/20 flex items-center gap-1">
                                                                        <AlertTriangle size={12} /> {status.message}
                                                                    </span>
                                                                )}
                                                                {status.overtime && (
                                                                    <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-500/20 flex items-center gap-1">
                                                                        <Zap size={12} /> Overtime
                                                                    </span>
                                                                )}
                                                                {status.incomplete && (
                                                                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                                                                        <ShieldAlert size={12} /> {status.message}
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Manual Time' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-[#fcfdfe] dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Employee Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Start Time</th>
                                <th className="px-6 py-4">End Time</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {manualTimes.filter(t => {
                                const matchesSearch = (t.employee?.fullName || '').toLowerCase().includes(generalSearch.toLowerCase());
                                const matchesTeam = !selectedTeam || t.employee?.teamId === selectedTeam;
                                const matchesEmp = !selectedEmployee || t.employeeId === selectedEmployee;
                                return matchesSearch && matchesTeam && matchesEmp;
                            }).map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-200">
                                                {(row.employee?.fullName || row.employee?.name || '??').split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{row.employee?.fullName || row.employee?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-600 dark:text-slate-400">{row.type || 'Regular'}</td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-800 dark:text-slate-300">
                                        {format(new Date(row.startTime), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-800 dark:text-slate-300">
                                        {format(new Date(row.startTime), 'hh:mm a')}
                                    </td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-800 dark:text-slate-300">
                                        {format(new Date(row.endTime), 'hh:mm a')}
                                    </td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-800 dark:text-slate-300">
                                        {row.duration ? `${Math.floor(row.duration / 3600)}h ${Math.floor((row.duration % 3600) / 60)}m` : '--'}
                                    </td>
                                    <td className="px-6 py-6 text-xs font-bold text-slate-400 italic">{row.note || 'Manual entry'}</td>
                                </tr>
                            ))}
                            {!loading && manualTimes.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-slate-400 font-bold">No entries found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'Schedules' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <button
                            onClick={() => setShowShifts(!showShifts)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-black uppercase tracking-tight ${showShifts
                                ? 'border-primary-200 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-900'
                                }`}
                        >
                            <div className={`h-3 w-3 rounded-full transition-colors ${showShifts ? 'bg-primary-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                            Shifts
                        </button>
                        <button
                            onClick={() => setShowTimeOff(!showTimeOff)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-black uppercase tracking-tight ${showTimeOff
                                ? 'border-slate-300 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                : 'border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-900'
                                }`}
                        >
                            <div className={`h-3 w-3 rounded-full transition-colors ${showTimeOff ? 'bg-slate-400 dark:bg-slate-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                            Time Off
                        </button>
                        {scheduleSearch && (
                            <span className="text-[10px] font-bold text-slate-400">Filtering: "{scheduleSearch}"</span>
                        )}
                        {loading && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Loader size={10} className="animate-spin" /> Loading...</span>}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex min-h-[400px]">
                        {/* Employee Column */}
                        <div className="w-[180px] shrink-0 border-r border-slate-100 dark:border-slate-800">
                            <div className="p-4 border-b border-slate-50 dark:border-slate-800 font-bold text-slate-400 text-[10px] uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                                Employee
                            </div>
                            {filteredScheduleEmps.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 text-xs font-bold">No employees</div>
                            ) : filteredScheduleEmps.map((emp) => (
                                <div key={emp.id} className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center gap-2.5 min-h-[80px]">
                                    <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-black bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                                        {emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-300 leading-tight truncate">{emp.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Day Columns */}
                        <div className="flex-1 overflow-x-auto">
                            {/* Header row */}
                            <div className="flex border-b border-slate-50 dark:border-slate-800" style={{ minWidth: gridDays.length * 140 }}>
                                {gridDays.map((day, i) => {
                                    const isToday = isSameDay(day, new Date());
                                    return (
                                        <div key={i} className={`p-4 border-r border-slate-50 dark:border-slate-800 flex-1 min-w-[140px] relative ${isToday ? '' : ''}`}>
                                            {isToday && <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-500" />}
                                            <p className={`text-[10px] font-black uppercase ${isToday ? 'text-primary-500' : 'text-slate-400'}`}>
                                                {format(day, 'EEE')}
                                            </p>
                                            <p className={`text-[10px] font-black uppercase ${isToday ? 'text-primary-500' : 'text-slate-400'}`}>
                                                {format(day, 'MMM d')}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Employee rows */}
                            {filteredScheduleEmps.map((emp) => (
                                <div key={emp.id} className="flex border-b border-slate-50 dark:border-slate-800 last:border-0" style={{ minWidth: gridDays.length * 140 }}>
                                    {gridDays.map((day, di) => {
                                        const dayStr = format(day, 'yyyy-MM-dd');
                                        // Find shift for this employee on this day
                                        const shift = showShifts ? shifts.find(s =>
                                            s.employeeId === emp.id &&
                                            format(new Date(s.date), 'yyyy-MM-dd') === dayStr
                                        ) : null;
                                        // Find time-off spanning this day
                                        const timeOff = showTimeOff ? timeOffs.find(t =>
                                            t.employeeId === emp.id &&
                                            dayStr >= format(new Date(t.startDate), 'yyyy-MM-dd') &&
                                            dayStr <= format(new Date(t.endDate), 'yyyy-MM-dd')
                                        ) : null;

                                        return (
                                            <div key={di} className="flex-1 min-w-[140px] min-h-[80px] border-r border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors p-2 flex flex-col items-center justify-center gap-1">
                                                {shift && (
                                                    <div className="w-full bg-primary-100 dark:bg-primary-900/30 rounded-lg px-2 py-1.5 text-center">
                                                        <span className="text-[10px] font-black text-primary-600 dark:text-primary-400">
                                                            {shift.startTime}–{shift.endTime}
                                                        </span>
                                                    </div>
                                                )}
                                                {timeOff && (
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1.5 text-center">
                                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">
                                                            {timeOff.timeOffType || 'Time Off'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            {filteredScheduleEmps.length === 0 && (
                                <div className="flex items-center justify-center h-48 text-slate-400 font-bold text-sm">
                                    No schedule data for this date range
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <AddManualTimeModal
                isOpen={isManualTimeModalOpen}
                onClose={() => setIsManualTimeModalOpen(false)}
                onSave={async (data) => {
                    try {
                        await useAttendanceStore.getState().addManualTime(data);
                        alert('Manual time entry saved successfully');
                    } catch (err) {
                        alert('Failed to save manual time: ' + err.message);
                    }
                }}
                employees={employees}
            />
            <AddTimeOffModal
                isOpen={isAddTimeOffModalOpen}
                onClose={() => setIsAddTimeOffModalOpen(false)}
                onSave={() => {
                    // Refresh time-offs after saving
                    if (dateRange?.start && dateRange?.end) {
                        fetchTimeOffs({ startDate: dateRange.start, endDate: dateRange.end });
                    } else {
                        fetchTimeOffs();
                    }
                }}
            />
            <ImportTimeOffModal
                isOpen={isImportTimeOffModalOpen}
                onClose={() => setIsImportTimeOffModalOpen(false)}
            />

            {/* Add Shift Modal */}
            {isAddShiftModalOpen && <AddShiftModal
                employees={employees}
                onClose={() => setIsAddShiftModalOpen(false)}
                onSave={async (data) => {
                    try {
                        await addShift(data);
                        setIsAddShiftModalOpen(false);
                        // Refresh
                        if (dateRange?.start && dateRange?.end) {
                            fetchShifts({ startDate: dateRange.start, endDate: dateRange.end });
                        } else {
                            fetchShifts();
                        }
                    } catch (err) {
                        alert('Failed to add shift: ' + err.message);
                    }
                }}
            />}
        </div>
    );
}

// ─── Add Shift Modal ──────────────────────────────────────────────────────────
function AddShiftModal({ employees, onClose, onSave }) {
    const [form, setForm] = useState({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!form.employeeId) { alert('Please select an employee'); return; }
        setSaving(true);
        try { await onSave(form); }
        finally { setSaving(false); }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-lg font-black text-slate-700">Add Shift</h3>
                    <button onClick={onClose}><X size={22} className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1.5">Employee</label>
                        <select value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
                            className="w-full h-11 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-white text-slate-600 font-medium appearance-none focus:border-primary-500 outline-none text-sm">
                            <option value="">Select employee...</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.fullName || e.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-1.5">Date</label>
                        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                            className="w-full h-11 px-4 rounded-lg border-2 border-slate-100 bg-white text-slate-700 font-medium focus:border-primary-500 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-1.5">Start Time</label>
                            <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                                className="w-full h-11 px-4 rounded-lg border-2 border-slate-100 bg-white text-slate-700 font-medium focus:border-primary-500 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-1.5">End Time</label>
                            <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                                className="w-full h-11 px-4 rounded-lg border-2 border-slate-100 bg-white text-slate-700 font-medium focus:border-primary-500 outline-none text-sm" />
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-primary-200 text-primary-600 font-black text-xs uppercase tracking-wider hover:bg-primary-50 transition-all">Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                        className="px-5 py-2.5 rounded-lg bg-primary-600 text-white font-black text-xs uppercase tracking-wider hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center gap-2">
                        {saving && <Loader size={13} className="animate-spin" />} Save Shift
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

