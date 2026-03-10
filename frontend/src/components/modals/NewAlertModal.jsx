import React, { useState } from 'react';
import { X, Bell, ShieldCheck, Save, Loader2, Info } from 'lucide-react';
import { useAlertsStore } from '../../store/alertsStore';
import { cn } from '../../utils/cn';

export function NewAlertModal({ isOpen, onClose, type = 'attendance', editAlert = null }) {
    const { addAlert, updateAlert } = useAlertsStore();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        trigger: type === 'attendance' ? 'Late' : 'Unauthorized Access',
        scope: 'All Employees'
    });

    // Populate form data when opening in edit mode
    React.useEffect(() => {
        if (isOpen && editAlert) {
            setFormData({
                name: editAlert.name,
                trigger: editAlert.trigger,
                scope: editAlert.scope
            });
        } else if (isOpen && !editAlert) {
             setFormData({
                name: '',
                trigger: type === 'attendance' ? 'Late' : 'Unauthorized Access',
                scope: 'All Employees'
            });
        }
    }, [isOpen, editAlert, type]);

    if (!isOpen) return null;

    const triggers = type === 'attendance' 
        ? ['Late', 'Absent', 'Overtime', 'Incomplete Shift']
        : ['Unauthorized Access', 'Suspicious Login', 'Data Export', 'IP Mismatch'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (editAlert) {
                await updateAlert(type, editAlert.id, formData);
            } else {
                await addAlert(type, formData);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save alert:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                            type === 'attendance' ? "bg-primary-600 shadow-primary-500/20" : "bg-amber-600 shadow-amber-500/20"
                        )}>
                            {type === 'attendance' ? <Bell size={24} /> : <ShieldCheck size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                {editAlert ? 'Edit' : 'New'} {type === 'attendance' ? 'Attendance' : 'Security'} Alert
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Custom monitoring trigger</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Alert Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alert Name</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. Critical Absence Warning"
                            className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Trigger Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trigger On</label>
                            <select 
                                className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 outline-none focus:border-primary-500"
                                value={formData.trigger}
                                onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                            >
                                {triggers.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee Scope</label>
                            <select 
                                className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 outline-none focus:border-primary-500"
                                value={formData.scope}
                                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                            >
                                <option>All Employees</option>
                                <option>Engineering Team</option>
                                <option>Sales Team</option>
                                <option>HR Team</option>
                            </select>
                        </div>
                    </div>

                    {/* Hint */}
                    <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <Info size={18} className="text-primary-500 mt-0.5 shrink-0" />
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                            This alert will trigger notifications for management and admins whenever the selected condition is met during tracking hours.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-500 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={loading || !formData.name}
                            type="submit"
                            className="flex-[2] h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl dark:shadow-white/10"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            Save Alert
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
