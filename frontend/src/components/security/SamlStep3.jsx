import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { useSecurityStore } from '../../store/securityStore';

export function SamlStep3({ onError }) {
    const { saml, verifySaml } = useSecurityStore();
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500)); // simulate API
        const result = verifySaml();
        setLoading(false);
        if (!result.success) onError(result.error);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Verify SAML</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Initiate a test login to verify your SAML configuration is correct.
                </p>
            </div>

            {/* Status card */}
            <div className={`rounded-3xl border-2 p-8 flex flex-col items-center gap-5 transition-all duration-500 ${saml.verified
                ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'
                }`}>
                {saml.verified ? (
                    <>
                        <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-in zoom-in-75 duration-500">
                            <ShieldCheck size={40} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-400 mb-1">SAML Successfully Verified</h3>
                            <p className="text-sm font-medium text-emerald-600/70 dark:text-emerald-500">Single Sign-On is configured and ready to use.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <ShieldAlert size={40} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-black text-slate-700 dark:text-slate-300 mb-1">Waiting for Verification</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Click the button below to verify your SAML configuration.</p>
                        </div>
                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                        >
                            {loading && <Loader2 size={15} className="animate-spin" />}
                            {loading ? 'Verifying...' : 'Verify SAML'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
