import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useUtilizationStore } from '../../store/utilizationStore';
import { FormulaStepType } from './FormulaStepType';
import { FormulaStepEdit } from './FormulaStepEdit';
import { FormulaStepScope } from './FormulaStepScope';
import { cn } from '../../utils/cn';

const STEPS = ['Type', 'Edit', 'Scope & Confirmation'];

function Stepper({ steps, current }) {
    return (
        <div className="flex items-center gap-1 mb-6">
            {steps.map((s, i) => (
                <React.Fragment key={s}>
                    {i > 0 && (
                        <svg className="flex-1 mx-1" height="2" viewBox="0 0 32 2">
                            <rect width="32" height="2" rx="1" fill={i < current ? '#7c3aed' : '#e2e8f0'} />
                        </svg>
                    )}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <div className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all',
                            i + 1 < current ? 'bg-violet-600 border-violet-600 text-white'
                                : i + 1 === current ? 'bg-white dark:bg-slate-900 border-violet-600 text-violet-600'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400')}>
                            {i + 1 < current ? <Check size={12} strokeWidth={3} /> : i + 1}
                        </div>
                        <span className={cn('text-xs font-bold hidden sm:block', i + 1 === current ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400')}>{s}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

const DEFAULT_FORM = {
    name: '',
    type: null,
    teams: 'all',
    isDefault: false,
    config: {},
};

export function AddFormulaWizard({ isOpen, editFormula, onClose }) {
    const { addFormula, updateFormula } = useUtilizationStore();
    const isEdit = !!editFormula;

    const [step, setStep] = useState(1);
    const [form, setForm] = useState(isEdit ? { ...editFormula } : { ...DEFAULT_FORM, config: {} });

    React.useEffect(() => {
        if (isOpen) {
            setStep(1);
            setForm(editFormula ? { ...editFormula } : { ...DEFAULT_FORM, config: {} });
        }
    }, [isOpen, editFormula]);

    if (!isOpen) return null;

    const updateForm = (updates) => setForm((f) => ({ ...f, ...updates }));
    const updateConfig = (cfg) => setForm((f) => ({ ...f, config: { ...f.config, ...cfg } }));

    const canNext1 = !!form.type;
    const canNext2 = true; // Edit step always valid (optional checkboxes)
    const canSave = form.name.trim().length > 0;

    const handleNext = () => setStep((s) => Math.min(s + 1, 3));
    const handleBack = () => {
        if (step === 1) { onClose(); return; }
        setStep((s) => s - 1);
    };

    const handleSave = () => {
        const payload = {
            ...form,
            teamCount: form.teams === 'all' ? 1 : (Array.isArray(form.teams) ? form.teams.length : 0),
        };
        if (isEdit) {
            updateFormula(editFormula.id, payload);
        } else {
            addFormula(payload);
        }
        onClose();
    };

    const isLastStep = step === 3;
    const canProceed = step === 1 ? canNext1 : step === 2 ? canNext2 : canSave;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-6 pb-4 shrink-0">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {isEdit ? 'Edit Formula' : 'Add New Formula'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Stepper */}
                <div className="px-7 pb-2 shrink-0">
                    <Stepper steps={STEPS} current={step} />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-7 pb-6">
                    {step === 1 && (
                        <FormulaStepType selected={form.type} onChange={(type) => updateForm({ type, config: {} })} />
                    )}
                    {step === 2 && (
                        <FormulaStepEdit type={form.type} config={form.config} onChange={updateConfig} />
                    )}
                    {step === 3 && (
                        <FormulaStepScope
                            form={form}
                            onChange={(updates) => updateForm(updates)}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-7 py-5 shrink-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/20 rounded-b-[2rem]">
                    <button
                        onClick={handleBack}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    {!isLastStep ? (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none"
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none"
                        >
                            {isEdit ? 'Update' : 'Save'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
