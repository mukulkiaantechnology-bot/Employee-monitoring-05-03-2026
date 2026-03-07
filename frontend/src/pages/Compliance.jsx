import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, MapPin, CheckCircle2, AlertCircle, Search, Download, Info, AlertTriangle } from 'lucide-react';
import { useRealTime } from '../hooks/RealTimeContext';
import complianceService from '../services/complianceService';

const cn = (...inputs) => inputs.filter(Boolean).join(' ');

const ComplianceToggle = ({ title, desc, icon: Icon, enabled, onToggle }) => (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center gap-4">
            <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                enabled ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20" : "bg-slate-50 text-slate-400 dark:bg-slate-800"
            )}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h4>
                <p className="text-xs text-slate-500 font-medium">{desc}</p>
            </div>
        </div>
        <button
            onClick={onToggle}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    enabled ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    </div>
);

export function Compliance() {
    const { addNotification } = useRealTime();
    const [settings, setSettings] = useState({
        gdprEnabled: true,
        activityMonitoring: true,
        locationTracking: true
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [fetchedSettings, fetchedLogs] = await Promise.all([
                complianceService.getSettings(),
                complianceService.getAuditLogs()
            ]);
            setSettings(fetchedSettings);
            setLogs(fetchedLogs);
        } catch (error) {
            console.error('Failed to fetch compliance data:', error);
            addNotification('Failed to load compliance data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key) => {
        try {
            const newSettings = { ...settings, [key]: !settings[key] };
            // Optimistic update
            setSettings(newSettings);
            
            await complianceService.updateSettings(newSettings);
            addNotification(`Compliance setting updated`, 'success');
            
            // Refresh logs to show the update action
            const updatedLogs = await complianceService.getAuditLogs();
            setLogs(updatedLogs);
        } catch (error) {
            console.error('Failed to update compliance settings:', error);
            addNotification('Failed to update settings', 'error');
            // Rollback on failure
            fetchData();
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        try {
            const filteredLogs = await complianceService.getAuditLogs(query);
            setLogs(filteredLogs);
        } catch (error) {
            console.error('Failed to search logs:', error);
        }
    };

    if (loading) {
        return <div className="p-8">Loading compliance data...</div>;
    }

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Compliance & Privacy</h1>
                <p className="text-slate-500 font-medium mt-1">Manage data privacy and monitoring toggles.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Enterprise Shield Active</h3>
                            <p className="text-indigo-100 text-sm mt-1 max-w-md">Your organization is currently operating under SOC2 and GDPR standards.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Monitoring Toggles</h3>
                    <ComplianceToggle
                        title="GDPR Anonymization"
                        desc="Automatically mask employee PII in shared work logs."
                        icon={Lock}
                        enabled={settings.gdprEnabled}
                        onToggle={() => handleToggle('gdprEnabled')}
                    />
                    <ComplianceToggle
                        title="Activity Monitoring"
                        desc="Collect app and website usage data."
                        icon={Eye}
                        enabled={settings.activityMonitoring}
                        onToggle={() => handleToggle('activityMonitoring')}
                    />
                    <ComplianceToggle
                        title="Location Tracking"
                        desc="Log GPS coordinates for field-based roles."
                        icon={MapPin}
                        enabled={settings.locationTracking}
                        onToggle={() => handleToggle('locationTracking')}
                    />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                        <h3 className="text-lg font-bold">Audit Logs</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Action</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">User</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {logs && logs.length > 0 ? logs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold">{log.action}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{log.user}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {new Date(log.time).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold",
                                                log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 
                                                log.status === 'Denied' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                            )}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm font-medium">
                                            No audit logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
