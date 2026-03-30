import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Monitor, Activity, MapPin, Search, Filter, RefreshCw, Clock, Shield, ShieldAlert, User, ChevronRight, ExternalLink, Image as ImageIcon, Video } from 'lucide-react';
import api from '../services/apiClient';
import { toast } from '../utils/toastManager';

export const ActivityMonitoring = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, idle, offline

    const fetchStatus = async () => {
        try {
            const response = await api.get('/employees');
            // Using real agent status and tracking data from backend
            const enriched = response.data.map(emp => ({
                ...emp,
                agentStatus: emp.agentStatus || 'inactive',
                lastSeen: emp.lastSeen ? emp.lastSeen : new Date(Date.now() - 600000).toISOString(),
                currentActivity: emp.currentActivity || 'Idle',
            }));
            setEmployees(enriched);
        } catch (error) {
            console.error('Fetch monitoring error:', error);
            toast.error('Failed to load monitoring data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'active' && emp.agentStatus === 'active') || (filter === 'offline' && emp.agentStatus === 'inactive');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 space-y-8 bg-slate-50/50 dark:bg-slate-950/20 min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Monitor className="text-indigo-600" size={32} /> Monitoring Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time employee activity and agent compliance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchStatus}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full md:w-80 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Tracked', val: employees.length, icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Agent Active', val: employees.filter(e => e.agentStatus === 'active').length, icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Compliance Issues', val: employees.filter(e => e.agentStatus === 'inactive').length, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Currently Idle', val: employees.filter(e => e.currentActivity === 'Idle').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((s, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-2xl ${s.bg} dark:bg-opacity-10 ${s.color}`}>
                                <s.icon size={24} />
                            </div>
                            <span className="text-2xl font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">{s.val}</span>
                        </div>
                        <p className="mt-4 text-sm font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Employee List */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Active Sessions</h2>
                    <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        {['all', 'active', 'offline'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-tight ${filter === t ? 'bg-slate-900 text-white dark:bg-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {filteredEmployees.map((emp) => (
                        <div key={emp.id} className="p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-black text-xl overflow-hidden shadow-inner">
                                        {emp.avatar ? <img src={emp.avatar} alt="" className="w-full h-full object-cover" /> : emp.fullName[0]}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${emp.agentStatus === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight">{emp.fullName}</h3>
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{emp.role} • {emp.team?.name || 'No Team'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent Status</p>
                                    <div className={`flex items-center gap-1.5 font-bold text-sm ${emp.agentStatus === 'active' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {emp.agentStatus === 'active' ? <Shield size={14} /> : <ShieldAlert size={14} />}
                                        {emp.agentStatus === 'active' ? 'Connected' : 'Missing'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Activity</p>
                                    <p className="font-black text-slate-900 dark:text-white text-sm">
                                        {new Date(emp.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Productivity</p>
                                    <div className="flex items-center gap-1.5 font-bold text-sm text-indigo-600">
                                        <Activity size={14} /> {emp.currentActivity}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</p>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all">
                                            <ImageIcon size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all">
                                            <Video size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-900 hover:text-white transition-all">
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredEmployees.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                <Search size={40} />
                            </div>
                            <p className="text-slate-500 font-bold">No employees matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
