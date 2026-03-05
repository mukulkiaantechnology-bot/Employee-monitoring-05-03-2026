import React, { useState, useEffect } from 'react';
import { X, Info, Plus, Trash2, HelpCircle } from 'lucide-react';
import { CONTENT_OPTIONS } from '../../store/emailReportStore';
import { cn } from '../../utils/cn';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FREQUENCIES = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
];

const EMPTY_FORM = {
    title: '',
    frequency: 'weekly',
    recipients: [],
    sendToSelf: true,
    content: [],
};

export function CreateEmailReportModal({ isOpen, onClose, onSave, existingReport = null, existingTitles = [] }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [emailInput, setEmailInput] = useState('');
    const [errors, setErrors] = useState({});

    // Pre-fill for edit
    useEffect(() => {
        if (existingReport) {
            setForm({
                title: existingReport.title,
                frequency: existingReport.frequency,
                recipients: [...existingReport.recipients],
                sendToSelf: existingReport.sendToSelf,
                content: [...existingReport.content],
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setEmailInput('');
        setErrors({});
    }, [existingReport, isOpen]);

    if (!isOpen) return null;

    const isEdit = !!existingReport;

    // --- Validation ---
    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Report title is required.';
        else if (
            !isEdit &&
            existingTitles.map((t) => t.toLowerCase()).includes(form.title.trim().toLowerCase())
        ) {
            errs.title = 'A report with this title already exists.';
        }
        if (form.recipients.length === 0) errs.recipients = 'At least one recipient is required.';
        if (form.content.length === 0) errs.content = 'Select at least one content type.';
        return errs;
    };

    const addEmail = () => {
        const email = emailInput.trim();
        if (!email) return;
        if (!EMAIL_REGEX.test(email)) {
            setErrors((e) => ({ ...e, emailInput: 'Invalid email format.' }));
            return;
        }
        if (form.recipients.includes(email)) {
            setErrors((e) => ({ ...e, emailInput: 'Email already added.' }));
            return;
        }
        setForm((f) => ({ ...f, recipients: [...f.recipients, email] }));
        setEmailInput('');
        setErrors((e) => ({ ...e, recipients: undefined, emailInput: undefined }));
    };

    const removeEmail = (email) => {
        setForm((f) => ({ ...f, recipients: f.recipients.filter((r) => r !== email) }));
    };

    const toggleContent = (id) => {
        setForm((f) => ({
            ...f,
            content: f.content.includes(id) ? f.content.filter((c) => c !== id) : [...f.content, id],
        }));
        setErrors((e) => ({ ...e, content: undefined }));
    };

    const handleSave = () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        onSave({ ...form });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                            {isEdit ? 'Edit Email Report' : 'New Email Report'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto px-8 py-6 space-y-6 flex-1">
                    {/* Info Banner */}
                    <div className="flex items-start gap-3 px-4 py-3.5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 leading-relaxed">
                            Email reports will be sent out at midnight in the timezone of the user who sets up the report.{' '}
                            <button className="font-black hover:underline">Click Here to Learn More</button>
                        </p>
                    </div>

                    {/* Report Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            Report Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter report title"
                            value={form.title}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, title: e.target.value }));
                                setErrors((e2) => ({ ...e2, title: undefined }));
                            }}
                            className={cn(
                                'w-full h-12 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
                                errors.title
                                    ? 'border-rose-400 focus:border-rose-500'
                                    : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                            )}
                        />
                        {errors.title && (
                            <p className="text-xs font-bold text-rose-500">{errors.title}</p>
                        )}
                    </div>

                    {/* Frequency */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                Frequency
                            </label>
                            <HelpCircle size={14} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {FREQUENCIES.map((freq) => (
                                <label
                                    key={freq.id}
                                    className={cn(
                                        'flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold',
                                        form.frequency === freq.id
                                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value={freq.id}
                                        checked={form.frequency === freq.id}
                                        onChange={() => setForm((f) => ({ ...f, frequency: freq.id }))}
                                        className="accent-violet-600"
                                    />
                                    {freq.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Recipients */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                Recipients
                            </label>
                            <HelpCircle size={14} className="text-slate-300 dark:text-slate-600" />
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={emailInput}
                                onChange={(e) => {
                                    setEmailInput(e.target.value);
                                    setErrors((er) => ({ ...er, emailInput: undefined }));
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                                className={cn(
                                    'flex-1 h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
                                    errors.emailInput
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                                )}
                            />
                            <button
                                type="button"
                                onClick={addEmail}
                                className="h-11 px-4 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-widest shrink-0"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>

                        {errors.emailInput && (
                            <p className="text-xs font-bold text-rose-500">{errors.emailInput}</p>
                        )}

                        {form.recipients.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.recipients.map((email) => (
                                    <span
                                        key={email}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/30 rounded-xl text-xs font-bold text-violet-700 dark:text-violet-300"
                                    >
                                        {email}
                                        <button
                                            onClick={() => removeEmail(email)}
                                            className="text-violet-400 hover:text-rose-500 transition-colors"
                                        >
                                            <X size={13} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {errors.recipients && (
                            <p className="text-xs font-bold text-rose-500">{errors.recipients}</p>
                        )}

                        {/* Send to self */}
                        <label className="flex items-center gap-3 cursor-pointer mt-1">
                            <div className="relative flex items-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={form.sendToSelf}
                                    onChange={(e) => setForm((f) => ({ ...f, sendToSelf: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className={cn(
                                    'h-5 w-5 rounded-md border-2 transition-all',
                                    form.sendToSelf
                                        ? 'bg-violet-600 border-violet-600'
                                        : 'border-slate-300 dark:border-slate-600'
                                )} />
                                {form.sendToSelf && (
                                    <svg className="absolute inset-0 m-auto text-white" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                I want to receive email reports
                            </span>
                        </label>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                Content
                            </label>
                            <HelpCircle size={14} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {CONTENT_OPTIONS.map((opt) => {
                                const checked = form.content.includes(opt.id);
                                return (
                                    <label
                                        key={opt.id}
                                        onClick={() => toggleContent(opt.id)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all',
                                            checked
                                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                        )}
                                    >
                                        <div className={cn(
                                            'h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0',
                                            checked ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600'
                                        )}>
                                            {checked && (
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={cn(
                                            'text-sm font-semibold',
                                            checked ? 'text-violet-700 dark:text-violet-300' : 'text-slate-600 dark:text-slate-400'
                                        )}>
                                            {opt.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        {errors.content && (
                            <p className="text-xs font-bold text-rose-500">{errors.content}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
