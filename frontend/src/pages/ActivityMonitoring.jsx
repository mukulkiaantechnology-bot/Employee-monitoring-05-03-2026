import React, { useState } from 'react';
import {
    Bell,
    Calendar,
    Plus,
    Search,
    ZoomIn,
    RotateCcw,
    ZoomOut,
    LayoutGrid,
    Info,
    X,
    FileText,
    Globe,
    Monitor,
    Play
} from 'lucide-react';
import { FilterDropdown } from '../components/FilterDropdown';
import { GlobalCalendar } from '../components/GlobalCalendar';
import { useRealTime } from '../hooks/RealTimeContext';
import { cn } from '../utils/cn';

const LegendItem = ({ color, label, isStriped, isHashed, isOutline }) => (
    <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${color} ${isStriped ? 'bg-gradient-to-r from-orange-400 to-orange-200' : ''} ${isHashed ? 'bg-slate-200 dark:bg-slate-800 opacity-50' : ''} ${isOutline ? 'border border-orange-400 dark:border-orange-500 text-transparent' : ''}`}></div>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{label}</span>
        <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500">?</div>
    </div>
);

export function ActivityMonitoring() {
    const { activityLogs, employees } = useRealTime();
    const [activeTab, setActiveTab] = useState('Timeline');
    const [activitySearch, setActivitySearch] = useState('');
    const [zoomLevel, setZoomLevel] = useState(1);   // 0.75 | 1 | 1.5
    const [viewMode, setViewMode] = useState('normal'); // 'normal' | 'compact'

    const handleZoomIn  = () => setZoomLevel(z => Math.min(2, +(z + 0.25).toFixed(2)));
    const handleZoomOut = () => setZoomLevel(z => Math.max(0.5, +(z - 0.25).toFixed(2)));
    const handleReset   = () => { setZoomLevel(1); setActivitySearch(''); };

    const timelineHours = [
        '12:00 AM', '02:00 AM', '04:00 AM', '06:00 AM', '08:00 AM',
        '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'
    ];

    const logsData = (activityLogs || []).map(act => ({
        date: 'Feb 26, 2026',
        startTime: act.startTime,
        endTime: act.endTime,
        duration: act.duration,
        employee: act.employee,
        computer: act.computer,
        app: act.app,
        appIcon: act.app?.includes('Chrome') ? Globe : act.app?.includes('VS Code') ? Monitor : Monitor,
        website: act.website,
        webIcon: Globe,
        hasAction: Math.random() > 0.5
    }));

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8 transition-colors duration-200">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Activities</h1>
                </div>
                <div className="flex items-center gap-4">
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-10 mb-8 border-b border-slate-100 dark:border-slate-800">
                {['Timeline', 'Logs'].map(tab => (
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

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <GlobalCalendar />
                <FilterDropdown />

                <div className="ml-auto flex items-center gap-3">
                    <div className="relative group w-full md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search employee or team"
                            value={activitySearch}
                            onChange={(e) => setActivitySearch(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-medium dark:text-slate-200 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    {activeTab === 'Timeline' && (
                        <>
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
                                <button onClick={handleZoomIn}  title="Zoom In"  className={`p-1.5 rounded-md transition-colors text-primary-600 dark:text-primary-400 ${zoomLevel >= 2 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}><ZoomIn size={16} /></button>
                                <button onClick={handleReset}   title="Reset"   className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-primary-600 dark:text-primary-400 rounded-md transition-colors"><RotateCcw size={16} /></button>
                                <button onClick={handleZoomOut} title="Zoom Out" className={`p-1.5 rounded-md transition-colors text-primary-600 dark:text-primary-400 ${zoomLevel <= 0.5 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}><ZoomOut size={16} /></button>
                            </div>
                            <button
                                onClick={() => setViewMode(v => v === 'normal' ? 'compact' : 'normal')}
                                title={viewMode === 'normal' ? 'Compact View' : 'Normal View'}
                                className={`p-2 border rounded-lg transition-colors shadow-sm ${
                                    viewMode === 'compact'
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600'
                                        : 'border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                            >
                                <LayoutGrid size={18} strokeWidth={2.5} />
                            </button>
                        </>
                    )}
                    {activeTab === 'Logs' && (
                        <button className="p-2 border border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                            <LayoutGrid size={18} strokeWidth={2.5} />
                        </button>
                    )}
                </div>
            </div>

            {activeTab === 'Timeline' ? (
                <div className="space-y-6">
                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                        <LegendItem color="bg-primary-300 dark:bg-primary-500/80" label="Active Time" />
                        <LegendItem color="bg-sky-200 dark:bg-sky-500/50" label="Break Time" />
                        <LegendItem color="bg-primary-400 dark:bg-primary-500" label="Break Time Overages" />
                        <LegendItem color="bg-orange-300 dark:bg-orange-500/80" label="Manual Time" />
                        <LegendItem color="bg-white dark:bg-slate-900" label="Unreviewed Manual Time" isOutline />
                        <LegendItem color="bg-orange-200 dark:bg-orange-500/50" label="Manual Time (Processing)" isStriped />
                        <LegendItem color="bg-white dark:bg-slate-900" label="Idle Time" isHashed />
                        <div className="flex items-center gap-2">
                            <div className="h-[2px] w-4 bg-primary-600 dark:bg-primary-500"></div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Scheduled Time</span>
                            <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-400 dark:text-slate-500">?</div>
                        </div>
                    </div>

                    {/* Timeline Grid */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                        <div className="grid grid-cols-12 min-w-[1200px]" style={{ zoom: zoomLevel }}>
                            {/* Empty space + Time headers */}
                            <div className="col-span-3 p-4 border-b border-r border-slate-50 dark:border-slate-800 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Employee Name</div>
                            <div className="col-span-9 grid grid-cols-11 border-b border-slate-50 dark:border-slate-800">
                                {timelineHours.map((hour, idx) => (
                                    <div key={idx} className="p-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 border-r border-slate-50/50 dark:border-slate-800/50 flex items-center justify-center relative">
                                        {idx === 0 && <Play size={8} className="absolute left-2 text-primary-500 rotate-180" />}
                                        {hour}
                                    </div>
                                ))}
                            </div>

                            {employees
                                .filter(emp => (emp.name?.toLowerCase() ?? '').includes(activitySearch.toLowerCase()))
                                .slice(0, 8).map((emp, empIdx) => (
                                <React.Fragment key={emp.id}>
                                    <div className={`col-span-3 border-b border-r border-slate-50 dark:border-slate-800 flex items-center gap-4 ${viewMode === 'compact' ? 'p-3' : 'p-6'}`}>
                                        <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                                            <img src={emp.avatar} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{emp.name}</p>
                                            <p className="text-[10px] font-bold text-emerald-500 mt-1">92% utilization</p>
                                        </div>
                                    </div>
                                    <div className="col-span-9 grid grid-cols-11 border-b border-slate-50 dark:border-slate-800 relative">
                                        {/* Activity blocks based on index to look varied */}
                                        <div className="absolute top-[10%] w-[30%] h-[80%] flex gap-[1px]" style={{ left: `${10 + (empIdx * 7) % 40}%` }}>
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <div key={i} className={cn("flex-1", i % 4 === 0 ? "bg-primary-300 dark:bg-primary-500/60" : "bg-primary-300/40 opacity-30")}></div>
                                            ))}
                                        </div>
                                        {empIdx % 2 === 0 && (
                                            <div className="absolute top-[10%] w-[15%] h-[80%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 opacity-20" style={{ left: `${60 + (empIdx * 10) % 20}%`, backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
                                        )}
                                        {Array.from({ length: 11 }).map((_, i) => <div key={i} className="border-r border-slate-50/50 dark:border-slate-800/50"></div>)}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Info Bar */}
                    <div className="bg-[#eef8ff] dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/50 text-[#00609b] dark:text-primary-300 px-5 py-3.5 rounded-lg flex items-center gap-3 text-xs font-bold w-full shadow-sm">
                        <Info size={18} className="text-[#0092e0] dark:text-primary-400" />
                        <span className="flex-1">Visibility of URLs and titles can be changed in the privacy settings. <button className="hover:underline font-black text-primary-600 dark:text-primary-400">Click here to change this.</button></span>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={16} /></button>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead className="bg-[#fcfdfe] dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 w-12"></th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Duration [h]</th>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Computer</th>
                                    <th className="px-6 py-4">App</th>
                                    <th className="px-6 py-4">Website</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {logsData.map((log, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            {log.hasAction && <Play size={12} className="text-primary-500 fill-primary-500" />}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{log.date}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{log.startTime} - {log.endTime}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-slate-200">{log.duration}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-slate-300">{log.employee}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">{log.computer}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 rounded bg-slate-100 dark:bg-slate-800">
                                                    <log.appIcon size={14} className="text-primary-600 dark:text-primary-400" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-400">{log.app}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.website && (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
                                                    <log.webIcon size={12} className="text-slate-400 dark:text-slate-500" />
                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-400">{log.website}</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
