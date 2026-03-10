import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Monitor, Trash2, ShieldAlert, Users, Calendar } from 'lucide-react';
import { useAlertsStore } from '../../../store/alertsStore';
import { cn } from '../../../utils/cn';

export function SecurityAlerts() {
    const { onEditAlert } = useOutletContext();
    const { alertsSettings, deleteAlert, fetchAlertRules, loading } = useAlertsStore();
    const alerts = alertsSettings.security.alerts;

    useEffect(() => {
        fetchAlertRules('security');
    }, []);

    if (loading && alerts.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <div className="relative mb-8">
                    <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <Monitor size={48} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white dark:bg-slate-900 rounded-full border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center">
                        <div className="h-4 w-1 bg-slate-300 dark:bg-slate-600 rounded-full rotate-45" />
                    </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No alerts</h3>
                <p className="text-slate-500 text-center max-w-sm font-bold text-sm">
                    You don't have alerts at this moment. Create your first security alert to stay notified.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {alerts.map((alert) => (
                <div 
                    key={alert.id}
                    className="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{alert.name}</h3>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><ShieldAlert size={12} /> {alert.trigger}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1.5"><Users size={12} /> {alert.scope}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(alert.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => onEditAlert(alert)}
                            className="h-10 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => deleteAlert('security', alert.id)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
