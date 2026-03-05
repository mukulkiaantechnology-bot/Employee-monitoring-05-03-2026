import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { cn } from '../../utils/cn';

export function AddAdminModal({ isOpen, onClose }) {
    const { addUser } = useUserStore();
    const [form, setForm] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required.';
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required.';
        return errs;
    };

    const handleSave = () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        addUser({
            name: form.name.trim(),
            email: form.email.trim(),
            role: 'admin',
            loginType: 'email',
            features: 'all',
            scope: { employees: 'all', teams: 'all', projects: 'all', orgGroups: 'all' },
            permissions: {
                canManageEmployees: true, canManageTeams: true, canManageProjects: true,
                canEditTracking: true, canViewAnalytics: true,
            },
        });
        setForm({ name: '', email: '' });
        setErrors({});
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-7 pb-5">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Admin</h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={18} /></button>
                </div>

                {/* Body */}
                <div className="px-7 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300">Name</label>
                        <input type="text" placeholder="Enter admin name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
                            className={cn('w-full h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none transition-all', errors.name ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500')} />
                        {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300">Email</label>
                        <input type="email" placeholder="mail@example.com" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
                            className={cn('w-full h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none transition-all', errors.email ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500')} />
                        {errors.email && <p className="text-xs font-bold text-rose-500">{errors.email}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-7 py-6 mt-2 bg-slate-50/70 dark:bg-slate-800/20 rounded-b-[2rem] border-t border-slate-100 dark:border-slate-800">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none">Save</button>
                </div>
            </div>
        </div>
    );
}
