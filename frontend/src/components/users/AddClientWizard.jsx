import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useUserStore, ALL_FEATURES } from '../../store/userStore';
import { cn } from '../../utils/cn';

const SCOPE_FIELDS = ['employees', 'teams', 'projects', 'orgGroups'];

function WizardStepper({ steps, current }) {
    return (
        <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
                <React.Fragment key={s}>
                    {i > 0 && <svg width="16" height="2" viewBox="0 0 16 2"><rect width="16" height="2" rx="1" fill={i < current ? '#7c3aed' : '#e2e8f0'} /></svg>}
                    <div className="flex items-center gap-2">
                        <div className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all',
                            i + 1 < current ? 'bg-violet-600 border-violet-600 text-white'
                                : i + 1 === current ? 'bg-white dark:bg-slate-900 border-violet-600 text-violet-600'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400')}>
                            {i + 1 < current ? <Check size={12} strokeWidth={3} /> : i + 1}
                        </div>
                        <span className={cn('text-xs font-bold', i + 1 === current ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400')}>{s}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

function ScopeModal({ scope, onChange, onClose }) {
    const [local, setLocal] = useState({ ...scope });
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">Set Scope</h3>
                <div className="space-y-4">
                    {SCOPE_FIELDS.map((field) => (
                        <div key={field} className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 capitalize">{field.replace('orgGroups', 'Org Groups')}</label>
                            <div className="flex gap-2">
                                {['all', 'selected'].map((opt) => (
                                    <button key={opt} onClick={() => setLocal({ ...local, [field]: opt })} className={cn('flex-1 py-2 rounded-xl text-xs font-black capitalize border-2 transition-all',
                                        local[field] === opt ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10 text-violet-700 dark:text-violet-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300')}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                    <button onClick={() => { onChange(local); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black hover:scale-[1.02] transition-all">Apply</button>
                </div>
            </div>
        </div>
    );
}

const BLANK = { name: '', email: '', scope: { employees: 'all', teams: 'all', projects: 'all', orgGroups: 'all' }, features: [] };

export function AddClientWizard({ isOpen, onClose }) {
    const { addUser } = useUserStore();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ ...BLANK, features: [] });
    const [errors, setErrors] = useState({});
    const [scopeOpen, setScopeOpen] = useState(false);

    if (!isOpen) return null;

    const STEPS = ['General', 'Add Features'];

    const validateStep1 = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required.';
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required.';
        return errs;
    };

    const handleNext = () => {
        const errs = validateStep1();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setStep(2);
    };

    const handleSave = () => {
        addUser({
            name: form.name.trim(), email: form.email.trim(),
            role: 'client', loginType: 'email',
            features: form.features.length === ALL_FEATURES.length ? 'all' : form.features,
            scope: form.scope,
            permissions: {
                canManageEmployees: false, canManageTeams: false, canManageProjects: false,
                canEditTracking: false, canViewAnalytics: false,
            },
        });
        setForm({ ...BLANK, features: [] }); setStep(1); setErrors({}); onClose();
    };

    const toggleFeature = (id) => setForm((f) => ({
        ...f, features: f.features.includes(id) ? f.features.filter((x) => x !== id) : [...f.features, id],
    }));

    const inputClass = (err) => cn('w-full h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none transition-all', err ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500');

    return (
        <>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
                <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-7 pt-6 pb-4 shrink-0">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">Add New Client</h2>
                        <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
                    </div>
                    <div className="px-7 pb-2 shrink-0"><WizardStepper steps={STEPS} current={step} /></div>

                    <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-5">
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">ℹ In Scope section select which employees, teams, projects, and org groups this manager will be able to see.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-700 dark:text-slate-300">Name</label>
                                    <input type="text" placeholder="Enter Manager Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass(errors.name)} />
                                    {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-700 dark:text-slate-300">Email</label>
                                    <input type="email" placeholder="mail@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass(errors.email)} />
                                    {errors.email && <p className="text-xs font-bold text-rose-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-700 dark:text-slate-300">Scope</label>
                                    <div className="p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 min-h-[56px]">
                                        <button onClick={() => setScopeOpen(true)} className="flex items-center gap-1.5 text-xs font-black text-violet-700 dark:text-violet-400 border border-violet-300 dark:border-violet-700 px-3 py-1.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all">
                                            <Plus size={12} strokeWidth={3} /> Add scope
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select features this client can view (read-only):</p>
                                {ALL_FEATURES.map((f) => (
                                    <label key={f.id} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all',
                                        form.features.includes(f.id) ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300')}>
                                        <div className={cn('h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                                            form.features.includes(f.id) ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600')}
                                            onClick={() => toggleFeature(f.id)}>
                                            {form.features.includes(f.id) && <Check size={10} color="white" strokeWidth={3} />}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{f.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 px-7 py-5 shrink-0 bg-slate-50/70 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 rounded-b-[2rem]">
                        <button onClick={step === 1 ? onClose : () => setStep(1)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        {step === 1 ? (
                            <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none">Next Step</button>
                        ) : (
                            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none">Save</button>
                        )}
                    </div>
                </div>
            </div>
            {scopeOpen && <ScopeModal scope={form.scope} onChange={(s) => setForm({ ...form, scope: s })} onClose={() => setScopeOpen(false)} />}
        </>
    );
}
