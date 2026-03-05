import React, { useState, useMemo, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    Filter,
    ChevronDown,
    ChevronUp,
    Search,
    Users,
    Shield,
    Clock,
    MoreHorizontal,
    ChevronLeft,
    Check,
    X,
    Activity,
    Info,
    Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuditLogStore } from '../../store/auditLogStore';
import { UserFilterModal } from '../../components/filters/UserFilterModal';
import { RoleFilterModal } from '../../components/filters/RoleFilterModal';
import { cn } from '../../utils/cn';

export function AuditLogs() {
    const navigate = useNavigate();
    const { auditLogs, filters, setFilters, sortConfig, setSort, clearFilters } = useAuditLogStore();

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- Filter Logic ---
    const filteredLogs = useMemo(() => {
        return auditLogs.filter(log => {
            // Date Filter
            const logDate = new Date(log.dateTime);
            const now = new Date();
            let matchesDate = true;

            if (filters.dateRange === 'today') {
                matchesDate = logDate.toDateString() === now.toDateString();
            } else if (filters.dateRange === 'yesterday') {
                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);
                matchesDate = logDate.toDateString() === yesterday.toDateString();
            } else if (filters.dateRange === 'last7') {
                const last7 = new Date();
                last7.setDate(now.getDate() - 7);
                matchesDate = logDate >= last7;
            } else if (filters.dateRange === 'last30') {
                const last30 = new Date();
                last30.setDate(now.getDate() - 30);
                matchesDate = logDate >= last30;
            }

            // User Filter
            const matchesUser = filters.users.length === 0 || filters.users.includes(log.userName);

            // Role Filter
            const matchesRole = filters.userRoles.length === 0 || filters.userRoles.includes(log.userRole);

            // Search Query
            const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.action.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesDate && matchesUser && matchesRole && matchesSearch;
        }).sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];
            if (sortConfig.direction === 'asc') {
                return valA > valB ? 1 : -1;
            }
            return valA < valB ? 1 : -1;
        });
    }, [auditLogs, filters, sortConfig, searchQuery]);

    const dateOptions = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 Days', value: 'last7' },
        { label: 'Last 30 Days', value: 'last30' }
    ];

    const getBadgeStyle = (type) => {
        if (type === 'Create') return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
        if (type === 'Update') return "bg-primary-50 text-primary-600 border-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20";
        if (type === 'Delete') return "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
        return "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
    };

    const handleDateSelect = (val) => {
        setFilters({ dateRange: val });
        setIsDateDropdownOpen(false);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.date-dropdown-container')) setIsDateDropdownOpen(false);
            if (!e.target.closest('.filter-dropdown-container')) setIsFilterDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const activeFiltersCount = (filters.users.length > 0 ? 1 : 0) + (filters.userRoles.length > 0 ? 1 : 0);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate('/settings')}>Settings</span>
                            <span>/</span>
                            <span className="text-primary-600">Audit Logs</span>
                        </nav>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Audit Logs</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="h-11 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Date Filter */}
                <div className="relative date-dropdown-container">
                    <button
                        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                        className={cn(
                            "h-11 px-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:border-primary-500/50",
                            filters.dateRange !== 'today' ? "text-primary-600 border-primary-500/30" : "text-slate-600 dark:text-slate-400"
                        )}
                    >
                        <CalendarIcon size={16} />
                        {dateOptions.find(o => o.value === filters.dateRange)?.label}
                        <ChevronDown size={14} className={cn("transition-transform", isDateDropdownOpen && "rotate-180")} />
                    </button>

                    {isDateDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            {dateOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleDateSelect(opt.value)}
                                    className={cn(
                                        "w-full px-5 py-4 text-left text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between",
                                        filters.dateRange === opt.value ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    {opt.label}
                                    {filters.dateRange === opt.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Filter */}
                <div className="relative filter-dropdown-container">
                    <button
                        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                        className={cn(
                            "h-11 px-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:border-primary-500/50",
                            activeFiltersCount > 0 ? "text-primary-600 bg-primary-50/50 border-primary-500/30" : "text-slate-600 dark:text-slate-400"
                        )}
                    >
                        <Filter size={16} />
                        Add Filter
                        {activeFiltersCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white text-[10px]">{activeFiltersCount}</span>}
                        <ChevronDown size={14} className={cn("transition-transform", isFilterDropdownOpen && "rotate-180")} />
                    </button>

                    {isFilterDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Filter By</span>
                            </div>
                            <button onClick={() => { setIsUserModalOpen(true); setIsFilterDropdownOpen(false); }} className="w-full px-5 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3">
                                <Users size={16} className="text-slate-400" /> Users
                                {filters.users.length > 0 && <span className="ml-auto flex h-2 w-2 rounded-full bg-primary-500" />}
                            </button>
                            <button onClick={() => { setIsRoleModalOpen(true); setIsFilterDropdownOpen(false); }} className="w-full px-5 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3">
                                <Shield size={16} className="text-slate-400" /> User Roles
                                {filters.userRoles.length > 0 && <span className="ml-auto flex h-2 w-2 rounded-full bg-primary-500" />}
                            </button>
                        </div>
                    )}
                </div>

                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors flex items-center gap-2 px-3"
                    >
                        <X size={14} /> Clear Applied
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                {filteredLogs.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center text-center">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700 mb-8 border-4 border-white dark:border-slate-800 shadow-xl">
                            <Monitor size={48} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No data for the selected period</h3>
                        <p className="text-slate-400 font-bold text-sm max-w-sm">
                            Try choosing a different time period in the calendar or clearing your filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-8 px-8 h-12 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfdfe] dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-8 py-6 cursor-pointer group" onClick={() => setSort('dateTime')}>
                                        <div className="flex items-center gap-2">
                                            Date & Time
                                            {sortConfig.key === 'dateTime' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                        </div>
                                    </th>
                                    <th className="px-8 py-6 cursor-pointer" onClick={() => setSort('userName')}>
                                        <div className="flex items-center gap-2">
                                            User
                                            {sortConfig.key === 'userName' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                        </div>
                                    </th>
                                    <th className="px-8 py-6">User Role</th>
                                    <th className="px-8 py-6">IP Address</th>
                                    <th className="px-8 py-6">Action Type</th>
                                    <th className="px-8 py-6">Action</th>
                                    <th className="px-8 py-6">Object Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <Clock size={14} className="text-slate-300" />
                                                <div>
                                                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                                                        {new Date(log.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        {new Date(log.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{log.userName}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                                log.userRole === 'Owner' ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" :
                                                    log.userRole === 'Admin' ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" :
                                                        "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                            )}>
                                                {log.userRole}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{log.ipAddress}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border",
                                                getBadgeStyle(log.actionType)
                                            )}>
                                                {log.actionType}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 max-w-xs">{log.action}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Activity size={14} className="text-slate-300" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.objectType}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <UserFilterModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                selectedUsers={filters.users}
                onApply={(users) => { setFilters({ users }); setIsUserModalOpen(false); }}
            />
            <RoleFilterModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                selectedRoles={filters.userRoles}
                onApply={(userRoles) => { setFilters({ userRoles }); setIsRoleModalOpen(false); }}
            />
        </div>
    );
}
