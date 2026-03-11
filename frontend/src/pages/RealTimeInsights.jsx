import React, { useState, useEffect, useMemo } from 'react';
import { Users, Zap, TrendingDown, Search, Download, LayoutGrid, List, Clock, Activity, MapPin } from 'lucide-react';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { useRealTime } from '../hooks/RealTimeContext';
import { LiveMapView } from '../components/location/LiveMapView';

const statusColors = {
    online: 'bg-emerald-400',
    idle: 'bg-amber-400',
    offline: 'bg-slate-300 dark:bg-slate-600',
};

const InsightStatCard = ({ title, value, total, icon: Icon, color, subLabel }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1 flex-1">
        <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{title}</span>
            <Icon size={16} className={color} />
        </div>
        <div className="flex items-baseline gap-1 mt-auto">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{value}</h3>
            {total && <span className="text-xs font-bold text-slate-400">/ {total}</span>}
        </div>
        {subLabel && <p className="text-[10px] text-slate-400 font-medium">{subLabel}</p>}
    </div>
);

export function RealTimeInsights() {
    const { stats, addEmployee } = useRealTime();
    const employees = stats.empMetrics || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ONLINE' | 'IDLE' | 'OFFLINE'
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'map'
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
    const [secAgo, setSecAgo] = useState(0);

    // Update "last refreshed" counter every second
    useEffect(() => {
        const t = setInterval(() => setSecAgo(s => s + 1), 1000);
        return () => clearInterval(t);
    }, []);
    // Reset on data change
    useEffect(() => { setSecAgo(0); }, [employees]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return employees.filter(e => {
            const matchesSearch = e.name.toLowerCase().includes(q) || (e.team || '').toLowerCase().includes(q);
            const matchesStatus = statusFilter === 'ALL' || (e.status || '').toUpperCase() === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [employees, search, statusFilter]);

    const onlineEmps = employees.filter(e => e.status === 'online');
    const idleEmps = employees.filter(e => e.status === 'idle');
    const presentToday = onlineEmps.length + idleEmps.length;

    const handleAddEmployee = (emp) => { addEmployee(emp); setIsModalOpen(false); };

    const handleDownload = () => {
        const headers = ['Name', 'Team', 'Status', 'Productivity (%)', 'Utilization (%)'];
        const rows = filtered.map(e => [
            e.name,
            e.team || '—',
            e.status,
            e.productivityScore || 0,
            e.utilizationScore || 0
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `real-time-insights-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Real-Time Insights</h1>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live — refreshed {secAgo < 5 ? 'just now' : `${secAgo}s ago`}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('map')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'map' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >
                            <MapPin size={14} className={activeTab === 'map' ? 'text-emerald-500' : ''} />
                            Live Map
                        </button>
                    </div>
                    {/* <button onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg uppercase tracking-wider">
                        Add New Employee
                    </button> */}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="flex flex-wrap gap-4 mb-8">
                <InsightStatCard title="Present Today" value={presentToday} total={employees.length} icon={Users} color="text-slate-400" subLabel={`${employees.length} total employees`} />
                <InsightStatCard title="Currently Active" value={onlineEmps.length} icon={Zap} color="text-emerald-500" subLabel={`${stats.online} online`} />
                <InsightStatCard title="Idle" value={idleEmps.length} icon={Clock} color="text-amber-500" subLabel="Inactive employees" />
                <InsightStatCard title="Offline" value={stats.offline} icon={TrendingDown} color="text-rose-500" subLabel="Not tracked today" />
                <InsightStatCard title="Productivity Today" value={`${stats.summary?.productivity ?? 0}%`} icon={Activity} color="text-violet-500" subLabel="vs. active time" />
            </div>

            {activeTab === 'overview' ? (
                <>
                    {/* Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ONLINE">Online</option>
                                <option value="IDLE">Idle</option>
                                <option value="OFFLINE">Offline</option>
                            </select>

                            <div className="relative w-full md:w-64 group">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Search employee or team"
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-medium outline-none shadow-sm dark:text-white" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                title="Download CSV"
                                className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-violet-600 dark:hover:bg-slate-800 transition-all"
                            >
                                <Download size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode(v => v === 'list' ? 'grid' : 'list')}
                                title={viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'}
                                className={`p-2 border rounded-lg transition-all ${viewMode === 'grid' ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-600' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                {viewMode === 'list' ? <LayoutGrid size={16} /> : <List size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Employee List/Grid */}
                    {viewMode === 'list' ? (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 bg-[#fcfdfe] dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-4">Employee Name</th>
                                            <th className="px-6 py-4">Team</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Productivity</th>
                                            <th className="px-6 py-4">Utilization</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                        {filtered.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-2 w-2 rounded-full shrink-0 ${statusColors[emp.status] || statusColors.offline}`} />
                                                        <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                                                            {emp.avatar ? (
                                                                <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover"
                                                                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                                                                />
                                                            ) : null}
                                                            <span className={`text-[10px] font-black text-violet-700 dark:text-violet-300 ${emp.avatar ? 'hidden' : 'flex'}`}>
                                                                {emp.initials || (emp.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                                                            </span>
                                                        </div>
                                                        <span className="font-bold text-slate-800 dark:text-white">{emp.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300">{emp.team || '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        emp.status === 'online' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                        emp.status === 'idle' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                                        'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${statusColors[emp.status] || statusColors.offline}`} />
                                                        {emp.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${emp.productivityScore || 0}%` }} />
                                                        </div>
                                                        <span className="font-black text-slate-700 dark:text-slate-300 min-w-[32px]">{emp.productivityScore || 0}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-400 rounded-full transition-all" style={{ width: `${emp.utilizationScore || 0}%` }} />
                                                        </div>
                                                        <span className="font-black text-slate-700 dark:text-slate-300 min-w-[32px]">{emp.utilizationScore || 0}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filtered.length === 0 && (
                                    <div className="py-16 text-center text-slate-400 font-bold text-sm">No employees match your search.</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Grid View */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filtered.length === 0 ? (
                                <div className="col-span-full py-16 text-center text-slate-400 font-bold text-sm">No employees match your search.</div>
                            ) : filtered.map((emp) => (
                                <div key={emp.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                                                {emp.avatar ? (
                                                    <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover"
                                                        onError={e => { e.target.style.display='none'; }}
                                                    />
                                                ) : (
                                                    <span className="text-sm font-black text-violet-700 dark:text-violet-300">
                                                        {emp.initials || (emp.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${statusColors[emp.status] || statusColors.offline}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-sm text-slate-900 dark:text-white truncate">{emp.name}</p>
                                            <p className="text-[11px] font-semibold text-slate-400 truncate">{emp.team || '—'}</p>
                                        </div>
                                        <span className={`ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                            emp.status === 'online' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                            emp.status === 'idle' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                            'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                        }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${statusColors[emp.status] || statusColors.offline}`} />
                                            {emp.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                                <span>Productivity</span><span className="text-violet-600">{emp.productivityScore || 0}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${emp.productivityScore || 0}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                                <span>Utilization</span><span className="text-indigo-500">{emp.utilizationScore || 0}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-400 rounded-full transition-all" style={{ width: `${emp.utilizationScore || 0}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <LiveMapView />
            )}

            <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddEmployee} />
        </div>
    );
}
