import React, { useState, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { PRODUCTIVITY_OPTIONS } from '../../store/manualTimeStore';
import { cn } from '../../utils/cn';

const EMPTY_FORM = {
    title: '',
    autoApproval: false,
    billable: null,     // true | false
    productivity: null, // 'productive' | 'neutral' | 'unproductive'
    maxDuration: '',
    projectRequired: false,
};

const PRODUCTIVITY_STYLES = {
    productive: 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700',
    neutral: 'border-slate-300 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
    unproductive: 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-700',
};

export function AddEditManualTimeModal({ isOpen, onClose, onSave, existingType = null, existingTitles = [] }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (existingType) {
            setForm({
                title: existingType.title,
                autoApproval: existingType.autoApproval,
                billable: existingType.billable,
                productivity: existingType.productivity,
                maxDuration: String(existingType.maxDuration),
                projectRequired: existingType.projectRequired,
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
    }, [existingType, isOpen]);

    if (!isOpen) return null;

    const isEdit = !!existingType;

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required.';
        else if (
            !isEdit &&
            existingTitles.map((t) => t.toLowerCase()).includes(form.title.trim().toLowerCase())
        ) errs.title = 'A type with this title already exists.';
        if (form.billable === null) errs.billable = 'Select billability.';
        if (!form.productivity) errs.productivity = 'Select productivity level.';
        const dur = parseInt(form.maxDuration, 10);
        if (!form.maxDuration || isNaN(dur) || dur <= 0) errs.maxDuration = 'Enter a valid duration in minutes.';
        return errs;
    };

    const handleSave = () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSave({
            title: form.title.trim(),
            autoApproval: form.autoApproval,
            billable: form.billable,
            productivity: form.productivity,
            maxDuration: parseInt(form.maxDuration, 10),
            projectRequired: form.projectRequired,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        {isEdit ? 'Edit Type' : 'Add New Type'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-8 py-6 flex-1 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Title</label>
                        <input
                            type="text"
                            placeholder="Insert title here"
                            value={form.title}
                            onChange={(e) => { setForm(f => ({ ...f, title: e.target.value })); setErrors(e2 => ({ ...e2, title: undefined })); }}
                            className={cn(
                                'w-full h-12 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
                                errors.title ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                            )}
                        />
                        {errors.title && <p className="text-xs font-bold text-rose-500">{errors.title}</p>}
                    </div>

                    {/* Auto-Approval */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Auto-Approval</label>
                            <HelpCircle size={13} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, autoApproval: !f.autoApproval }))}
                                className={cn(
                                    'relative h-6 w-11 rounded-full transition-all duration-300',
                                    form.autoApproval ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
                                )}
                            >
                                <span className={cn(
                                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300',
                                    form.autoApproval ? 'left-5' : 'left-0.5'
                                )} />
                            </button>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {form.autoApproval ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    {/* Billability */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Billability</label>
                            <HelpCircle size={13} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[{ value: true, label: 'Billable' }, { value: false, label: 'Non-Billable' }].map(opt => (
                                <label key={String(opt.value)}
                                    className={cn(
                                        'flex items-center gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold',
                                        form.billable === opt.value
                                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="billable"
                                        checked={form.billable === opt.value}
                                        onChange={() => { setForm(f => ({ ...f, billable: opt.value })); setErrors(e => ({ ...e, billable: undefined })); }}
                                        className="accent-violet-600"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                        {errors.billable && <p className="text-xs font-bold text-rose-500">{errors.billable}</p>}
                    </div>

                    {/* Productivity */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Productivity</label>
                            <HelpCircle size={13} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {PRODUCTIVITY_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => { setForm(f => ({ ...f, productivity: opt.id })); setErrors(e => ({ ...e, productivity: undefined })); }}
                                    className={cn(
                                        'px-5 py-2.5 rounded-full border-2 text-sm font-bold transition-all',
                                        form.productivity === opt.id
                                            ? PRODUCTIVITY_STYLES[opt.id]
                                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        {errors.productivity && <p className="text-xs font-bold text-rose-500">{errors.productivity}</p>}
                    </div>

                    {/* Max Duration + Project Required */}
                    <div className="flex items-start gap-6">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Max Duration</label>
                                <HelpCircle size={13} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="max duration"
                                    value={form.maxDuration}
                                    onChange={(e) => { setForm(f => ({ ...f, maxDuration: e.target.value })); setErrors(e2 => ({ ...e2, maxDuration: undefined })); }}
                                    className={cn(
                                        'flex-1 h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
                                        errors.maxDuration ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                                    )}
                                />
                                <span className="text-xs font-bold text-slate-400 shrink-0">minutes</span>
                            </div>
                            {errors.maxDuration && <p className="text-xs font-bold text-rose-500">{errors.maxDuration}</p>}
                        </div>

                        {/* Project Required */}
                        <div className="space-y-2 mt-7">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div
                                    className={cn('h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0',
                                        form.projectRequired ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600')}
                                    onClick={() => setForm(f => ({ ...f, projectRequired: !f.projectRequired }))}
                                >
                                    {form.projectRequired && (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project required</span>
                                <HelpCircle size={13} className="text-slate-300 dark:text-slate-600" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
                    <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
