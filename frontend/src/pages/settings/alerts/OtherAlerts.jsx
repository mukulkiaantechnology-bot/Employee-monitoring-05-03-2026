import React, { useEffect } from 'react';
import { 
    Info, 
    CheckCircle,
    LayoutDashboard,
    Clock,
    Zap
} from 'lucide-react';
import { useAlertsStore } from '../../../store/alertsStore';
import { cn } from '../../../utils/cn';

export function OtherAlerts() {
    const { alertsSettings, updateOtherSettings, fetchSettings, loading } = useAlertsStore();
    const other = alertsSettings.other;

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

    const frequencies = [
        { id: 'daily', label: 'Once per day' },
        { id: 'weekly', label: 'Once per week' },
        { id: 'monthly', label: 'Once per month' }
    ];

    const FrequencySelector = ({ title, description, value, onChange }) => (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
            <div className="flex-1 max-w-xl">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">{description}</p>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                {frequencies.map((freq) => (
                    <button
                        key={freq.id}
                        onClick={() => onChange(freq.id)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap",
                            value === freq.id 
                                ? "bg-white dark:bg-slate-900 text-primary-600 shadow-md ring-1 ring-slate-200 dark:ring-slate-700 scale-105" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                    >
                        {freq.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Info Banner */}
            <div className="flex items-center gap-4 p-6 bg-primary-50/50 dark:bg-primary-500/5 rounded-[2.5rem] border border-primary-100 dark:border-primary-500/10 shadow-sm">
                <div className="h-12 w-12 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-600">
                    <Info size={24} />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Frequency Configuration</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Choose when notifications will appear at the top of the list</p>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notification List</h3>
                        <p className="text-xs font-bold text-slate-400">Set the intervals for system analysis alerts</p>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Frequency</div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    <FrequencySelector 
                        title="Productivity Labeling" 
                        description="Notifications about productivity labeling of apps and websites"
                        value={other.productivityLabeling}
                        onChange={(val) => updateOtherSettings({ productivityLabeling: val })}
                    />
                    <FrequencySelector 
                        title="Manual Time Entries" 
                        description="Notifications about unreviewed manual time entries"
                        value={other.manualTimeEntries}
                        onChange={(val) => updateOtherSettings({ manualTimeEntries: val })}
                    />
                </div>
            </div>

            {/* Hint Box */}
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl -mr-16 -mt-16 rounded-full" />
                <div className="flex items-start gap-6 relative z-10">
                    <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 shrink-0">
                        <Zap size={24} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary-400">System Optimization</h4>
                        <p className="text-xs font-bold text-slate-300 leading-relaxed max-w-2xl">
                            Frequency settings help prevent notification fatigue. Analysis jobs run continuously in the background, but alerts are grouped according to these preferences to ensure meaningful insights without over-alerting management.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
