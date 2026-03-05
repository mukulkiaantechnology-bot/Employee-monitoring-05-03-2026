import React, { useState } from 'react';
import { X, Check, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';

export function RoleFilterModal({ isOpen, onClose, selectedRoles, onApply }) {
    const [localSelected, setLocalSelected] = useState(selectedRoles);

    const roles = ['Owner', 'Admin', 'Manager', 'HR', 'Employee'];

    if (!isOpen) return null;

    const toggleRole = (role) => {
        setLocalSelected(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role) 
                : [...prev, role]
        );
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Filter by Role</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-3">
                    {roles.map(role => (
                        <button
                            key={role}
                            onClick={() => toggleRole(role)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                localSelected.includes(role)
                                    ? "border-primary-500 bg-primary-50/50 dark:bg-primary-500/10"
                                    : "border-slate-50 dark:border-slate-800 hover:border-slate-100 dark:hover:border-slate-700"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center",
                                    role === 'Owner' ? "bg-rose-100 text-rose-600" :
                                    role === 'Admin' ? "bg-amber-100 text-amber-600" :
                                    "bg-slate-100 text-slate-600"
                                )}>
                                    <Shield size={16} />
                                </div>
                                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{role}</span>
                            </div>
                            {localSelected.includes(role) && (
                                <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white animate-in zoom-in duration-200">
                                    <Check size={14} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button 
                        onClick={() => setLocalSelected([])}
                        className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={() => onApply(localSelected)}
                        className="flex-1 h-12 rounded-xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
