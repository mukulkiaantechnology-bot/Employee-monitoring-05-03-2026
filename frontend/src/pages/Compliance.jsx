import React, { useState } from 'react';
import { Shield, Lock, Eye, MapPin, CheckCircle2, AlertCircle, Search, Download, Info, AlertTriangle } from 'lucide-react';
import { useRealTime } from '../hooks/RealTimeContext';

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
        gdpr: true,
        screenshots: true,
        location: true,
        mfa: false
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [logs] = useState([
        { id: 1, action: 'User Login', user: 'admin@shoppeal.tech', ip: '192.168.1.1', time: '2 mins ago', status: 'Success' },
        { id: 2, action: 'Access Sensitive Document', user: 'manager_01', ip: '192.168.1.45', time: '15 mins ago', status: 'Warning' },
        { id: 3, action: 'Updated Monitoring Policy', user: 'admin@shoppeal.tech', ip: '192.168.1.1', time: '1 hour ago', status: 'Success' },
        { id: 4, action: 'Bulk Export Attempt', user: 'employee_test', ip: '45.12.89.2', time: '3 hours ago', status: 'Denied' },
    ]);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        addNotification(`Compliance setting "${key}" updated`, 'success');
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        enabled={settings.gdpr}
                        onToggle={() => handleToggle('gdpr')}
                    />
                    <ComplianceToggle
                        title="Activity Monitoring"
                        desc="Collect app and website usage data."
                        icon={Eye}
                        enabled={settings.screenshots}
                        onToggle={() => handleToggle('screenshots')}
                    />
                    <ComplianceToggle
                        title="Location Tracking"
                        desc="Log GPS coordinates for field-based roles."
                        icon={MapPin}
                        enabled={settings.location}
                        onToggle={() => handleToggle('location')}
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
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                {filteredLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold">{log.action}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{log.user}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{log.time}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold",
                                                log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            )}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
