import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { cn } from '../../utils/cn';

export function AddOrgGroupModal({ isOpen, onClose }) {
    const { orgGroups, users, addOrgGroup, isOrgGroupNameUnique } = useUserStore();
    const [form, setForm] = useState({ name: '', description: '', managerId: null, employees: [] });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Org group name is required.';
        else if (!isOrgGroupNameUnique(form.name)) errs.name = 'This name is already taken.';
        return errs;
    };

    const handleSave = () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        addOrgGroup({ name: form.name.trim(), description: form.description.trim(), managerId: form.managerId, employees: form.employees });
        setForm({ name: '', description: '', managerId: null, employees: [] });
        setErrors({});
        onClose();
    };

    const inputClass = (err) => cn('w-full h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none transition-all', err ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500');
    const managers = users.filter((u) => u.role === 'admin' || u.role === 'manager');

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-7 pt-6 pb-5 shrink-0">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Add Org Group</h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto px-7 pb-4 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300">Org Group Name <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="Enter group name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
                            className={inputClass(errors.name)} />
                        {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300">Description <span className="text-slate-400 font-medium">(optional)</span></label>
                        <textarea placeholder="Enter description..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none transition-all resize-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300">Manager <span className="text-slate-400 font-medium">(optional)</span></label>
                        <div className="relative">
                            <select value={form.managerId ?? ''} onChange={(e) => setForm({ ...form, managerId: e.target.value || null })}
                                className="w-full h-11 pl-4 pr-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none appearance-none transition-all">
                                <option value="">No manager</option>
                                {managers.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300">Add Employees <span className="text-slate-400 font-medium">(optional)</span></label>
                        <div className="p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 min-h-14 text-xs font-medium text-slate-400">
                            Employee multi-selection can be configured after creation.
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-7 py-5 shrink-0 bg-slate-50/70 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 rounded-b-[2rem]">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none">Create Group</button>
                </div>
            </div>
        </div>
    );
}
