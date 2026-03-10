import React, { useState, useEffect } from 'react';
import { 
    Clock, 
    Bell, 
    AlertCircle, 
    Save, 
    CheckCircle2,
    LayoutDashboard,
    Mail,
    Monitor,
    Zap,
    AlertTriangle
} from 'lucide-react';
import { useAlertsStore } from '../../../store/alertsStore';
import { logAction } from '../../../utils/logAction';
import { cn } from '../../../utils/cn';

export function ShiftScheduling() {
    const { alertsSettings, updateShiftScheduling, toggleNotification, fetchSettings, loading } = useAlertsStore();
    const config = alertsSettings.shiftScheduling;
    
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20 animate-in fade-in duration-500">
                <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleSave = () => {
        setShowToast(true);
        logAction('Jane Smith', 'Owner', 'Update', 'Alerts', 'Updated Shift Scheduling rules and notification preferences');
        setTimeout(() => setShowToast(false), 3000);
    };

    const SettingRow = ({ title, description, children, valueLabel }) => (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
            <div className="flex-1 max-w-xl">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">{description}</p>
            </div>
            <div className="flex items-center gap-4 min-w-[200px] justify-end">
                {children}
                {valueLabel && (
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">{valueLabel}</span>
                )}
            </div>
        </div>
    );

    const NotificationItem = ({ title, description, category, config: notifConfig }) => (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="flex-1 max-w-xl">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                {/* Custom Delivery Selectors */}
                <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-slate-50 dark:bg-slate-950">
                    <button 
                        onClick={() => toggleNotification(category, 'inApp', !notifConfig.inApp)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                            notifConfig.inApp 
                                ? "bg-primary-600 text-white shadow-inner" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                    >
                        <Monitor size={14} />
                        In App
                    </button>
                    <button 
                        onClick={() => toggleNotification(category, 'email', !notifConfig.email)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border-l border-slate-200 dark:border-slate-800",
                            notifConfig.email 
                                ? "bg-primary-600 text-white shadow-inner" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                    >
                        <Mail size={14} />
                        Email
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Main Config Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Basic Rule</h3>
                        <p className="text-xs font-bold text-slate-400">Core shift constraints and late-arrival tolerances</p>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        Configuration
                    </div>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    <SettingRow 
                        title="Earliest Clock In" 
                        description="Choose how long before a scheduled shift employees can start their work"
                        valueLabel="minutes"
                    >
                        <input 
                            type="number"
                            min="0"
                            className="w-24 h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 font-black text-sm text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all text-center"
                            value={config.earliestClockIn}
                            onChange={(e) => updateShiftScheduling({ earliestClockIn: parseInt(e.target.value) || 0 })}
                        />
                    </SettingRow>

                    <SettingRow 
                        title="Latest Clock Out" 
                        description="Choose how long (in minutes) an employee is permitted to work after their scheduled shift"
                        valueLabel="minutes"
                    >
                        <input 
                            type="number"
                            min="0"
                            className="w-24 h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 font-black text-sm text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all text-center"
                            value={config.latestClockOut}
                            onChange={(e) => updateShiftScheduling({ latestClockOut: parseInt(e.target.value) || 0 })}
                        />
                    </SettingRow>

                    <SettingRow 
                        title="Tolerance" 
                        description="Choose how much time can be lost for a shift to still be considered completed"
                        valueLabel="minutes"
                    >
                        <input 
                            type="number"
                            min="0"
                            className="w-24 h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 font-black text-sm text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all text-center"
                            value={config.tolerance}
                            onChange={(e) => updateShiftScheduling({ tolerance: parseInt(e.target.value) || 0 })}
                        />
                    </SettingRow>
                </div>
            </div>

            {/* Notification Config Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notifications</h3>
                        <p className="text-xs font-bold text-slate-400">Define preference for delivery of scheduling alerts</p>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        Delivery
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    <NotificationItem 
                        title="Absent Employees" 
                        description="Select notification preferences for employee absences"
                        category="absent"
                        config={config.absentNotification}
                    />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white dark:bg-slate-900">
                        <div className="flex-1 max-w-xl">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Headcount Notification</h4>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed">Select notification preferences for employee lateness and no-shows</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 justify-end">
                            <select 
                                className="h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none transition-all focus:border-primary-500"
                                value={config.headcountNotification.sendAfter}
                                onChange={(e) => updateShiftScheduling({ headcountNotification: { ...config.headcountNotification, sendAfter: e.target.value } })}
                            >
                                <option value="scheduled_time">Send notifications after</option>
                                <option value="shift_start">At Shift Start</option>
                                <option value="before_start">15m Before Start</option>
                            </select>

                            <div className="flex items-center gap-2 px-4 h-11 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Late threshold</span>
                                <input 
                                    type="number"
                                    className="w-12 bg-transparent text-center font-black text-xs text-slate-900 dark:text-white outline-none"
                                    value={config.headcountNotification.lateThreshold}
                                    onChange={(e) => updateShiftScheduling({ headcountNotification: { ...config.headcountNotification, lateThreshold: parseInt(e.target.value) || 0 } })}
                                />
                                <span className="text-[10px] font-black text-slate-400 uppercase">minutes</span>
                            </div>

                            <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-slate-50 dark:bg-slate-950">
                                <button 
                                    onClick={() => toggleNotification('headcount', 'inApp', !config.headcountNotification.inApp)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                        config.headcountNotification.inApp 
                                            ? "bg-primary-600 text-white shadow-inner" 
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    )}
                                >
                                    <Monitor size={14} />
                                    In App
                                </button>
                                <button 
                                    onClick={() => toggleNotification('headcount', 'email', !config.headcountNotification.email)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border-l border-slate-200 dark:border-slate-800",
                                        config.headcountNotification.email 
                                            ? "bg-primary-600 text-white shadow-inner" 
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    )}
                                >
                                    <Mail size={14} />
                                    Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button Mock */}
            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    className="h-14 px-10 bg-primary-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary-500/20"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-emerald-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest">
                        <CheckCircle2 size={20} />
                        Settings Updated Successfully
                    </div>
                </div>
            )}
        </div>
    );
}
