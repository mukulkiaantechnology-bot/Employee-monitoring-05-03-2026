import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock } from 'lucide-react';
import { useSecurityStore } from '../../store/securityStore';
import { Stepper } from '../../components/ui/Stepper';
import { SamlStep1 } from '../../components/security/SamlStep1';
import { SamlStep2 } from '../../components/security/SamlStep2';
import { SamlStep3 } from '../../components/security/SamlStep3';
import { cn } from '../../utils/cn';

const STEPS = [
    { id: 'config', label: 'SAML Configuration' },
    { id: 'cert', label: 'Copy Certificate' },
    { id: 'verify', label: 'Verify SAML' },
];

function Toast({ show, message, type }) {
    if (!show) return null;
    return (
        <div className={`fixed bottom-8 right-8 z-[300] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-3 ${type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'}`}>
            <span>{type === 'error' ? '✗' : '✓'}</span> {message}
        </div>
    );
}

export function SamlWizard() {
    const navigate = useNavigate();
    const { saml, nextStep, previousStep, saveSaml, resetWizard } = useSecurityStore();
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
    };

    // ── Step 1 Validation ─────────────────────────────────────────────────────
    const validateStep1 = () => {
        const errs = {};
        if (!saml.name.trim() || saml.name.trim().length < 3) errs.name = 'Name must be at least 3 characters.';
        if (!saml.issuerId.trim()) errs.issuerId = 'Issuer ID is required.';
        if (!saml.loginUrl.trim() || !saml.loginUrl.startsWith('https://')) errs.loginUrl = 'Login URL must start with https://';
        if (!saml.certificate.trim() || !saml.certificate.includes('CERTIFICATE')) {
            errs.certificate = 'Certificate must contain "-----BEGIN CERTIFICATE-----".';
        }
        return errs;
    };

    const handleNext = () => {
        if (saml.step === 1) {
            const errs = validateStep1();
            if (Object.keys(errs).length) { setErrors(errs); return; }
            setErrors({});
        }
        nextStep();
    };

    const handleBack = () => {
        if (saml.step === 1) {
            resetWizard();
            navigate('/settings/security');
        } else {
            previousStep();
        }
    };

    const handleFinish = () => {
        saveSaml();
        showToast('SAML configuration saved successfully!');
        setTimeout(() => navigate('/settings/security'), 1200);
    };

    const handleError = (msg) => showToast(msg, 'error');

    const isLastStep = saml.step === 3;
    const isFirstStep = saml.step === 1;

    return (
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 pt-8 pb-8">
                <button
                    onClick={() => navigate('/settings/security')}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors" onClick={() => navigate('/settings')}>Settings</span>
                        <span>/</span>
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors" onClick={() => navigate('/settings/security')}>Security and Identity</span>
                        <span>/</span>
                        <span className="text-violet-600">SAML</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                            <Lock size={18} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Security and Identity</h1>
                    </div>
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="px-8 pt-8">
                    <Stepper steps={STEPS} currentStep={saml.step} />
                </div>

                {/* Step content */}
                <div className="px-8 pb-4">
                    {/* Back link */}
                    <button
                        onClick={handleBack}
                        className="text-xs font-black text-violet-600 dark:text-violet-400 hover:underline mb-5 block transition-all"
                    >
                        ← Back to Previous Step
                    </button>

                    {saml.step === 1 && (
                        <SamlStep1 errors={errors} setErrors={setErrors} />
                    )}
                    {saml.step === 2 && <SamlStep2 />}
                    {saml.step === 3 && <SamlStep3 onError={handleError} />}
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-3 px-8 pb-8 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        {isFirstStep ? 'Cancel' : 'Back'}
                    </button>
                    {!isLastStep ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Next step
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            disabled={!saml.verified}
                            className={cn(
                                'px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all',
                                saml.verified
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:scale-[1.02] active:scale-95'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            )}
                        >
                            Finish
                        </button>
                    )}
                </div>
            </div>

            <Toast show={toast.show} message={toast.message} type={toast.type} />
        </div>
    );
}
