import React, { useState, useMemo } from 'react';
import { Bell, Download, Search, Filter, X, CheckCheck, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { CreateAlertModal } from '../components/CreateAlertModal';
import { useRealTime } from '../hooks/RealTimeContext';

const SEVERITY_CONFIG = {
    critical: { label: 'Critical', cls: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800', icon: AlertOctagon,  dot: 'bg-rose-500' },
    warning:  { label: 'Warning',  cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800', icon: AlertTriangle, dot: 'bg-amber-400' },
    info:     { label: 'Info',     cls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', icon: Info, dot: 'bg-blue-400' },
};

const TYPE_LABELS = { idle: 'Idle Alert', unproductive: 'Low Productivity', late_login: 'Late Login' };

function AlertRow({ alert, onDismiss }) {
    const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
    const Icon = cfg.icon;
    return (
        <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${alert.read ? 'opacity-50' : ''} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-sm`}>
            <div className={`mt-0.5 p-2 rounded-xl border ${cfg.cls}`}>
                <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{alert.employeeName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${cfg.cls}`}>{cfg.label}</span>
                    {!alert.read && <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />}
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{alert.team}</span>
                    <span>•</span>
                    <span>{TYPE_LABELS[alert.type] || alert.type}</span>
                    <span>•</span>
                    <span>{alert.date}</span>
                </div>
            </div>
            {!alert.read && (
                <button onClick={() => onDismiss(alert.id)}
                    className="shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

export function Alerts() {
    const { alerts, dismissAlert, dismissAllAlerts } = useRealTime();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filtered = useMemo(() => {
        return alerts.filter(a => {
            if (filterType !== 'all' && a.severity !== filterType) return false;
            if (search && !a.message.toLowerCase().includes(search.toLowerCase()) && !a.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [alerts, filterType, search]);

    const unreadCount = alerts.filter(a => !a.read).length;
    const bySeverity = {
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning:  alerts.filter(a => a.severity === 'warning').length,
        info:     alerts.filter(a => a.severity === 'info').length,
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        Alerts
                        {unreadCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-black">{unreadCount}</span>
                        )}
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">Auto-generated from productivity monitoring</p>
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button onClick={dismissAllAlerts} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <CheckCheck size={14} /> Mark All Read
                        </button>
                    )}
                    <button onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg uppercase tracking-wider">
                        New Alert Rule
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Critical', count: bySeverity.critical, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800' },
                    { label: 'Warning',  count: bySeverity.warning,  color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' },
                    { label: 'Info',     count: bySeverity.info,     color: 'text-blue-600',  bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' },
                ].map(card => (
                    <button key={card.label} onClick={() => setFilterType(filterType === card.label.toLowerCase() ? 'all' : card.label.toLowerCase())}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${card.bg} ${filterType === card.label.toLowerCase() ? 'ring-2 ring-offset-2 ring-primary-400' : ''}`}>
                        <p className={`text-2xl font-black ${card.color}`}>{card.count}</p>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
                    </button>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 mb-6 border-b border-slate-100 dark:border-slate-800">
                {['Overview', 'Logs'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-black transition-all relative ${activeTab === tab ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600'}`}>
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-600 rounded-full" />}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-medium outline-none shadow-sm dark:text-white" />
                </div>
                {search && (
                    <button onClick={() => setSearch('')} className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1">
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            {/* Alert List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <Bell size={40} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                        <p className="font-bold text-slate-400">No alerts found</p>
                        <p className="text-xs text-slate-300 font-medium mt-1">All clear — no threshold violations detected</p>
                    </div>
                ) : (
                    filtered.map(alert => (
                        <AlertRow key={alert.id} alert={alert} onDismiss={dismissAlert} />
                    ))
                )}
            </div>

            <CreateAlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
