import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock } from 'lucide-react';
import { useSecurityStore } from '../../store/securityStore';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';

export function SecurityLanding() {
    const navigate = useNavigate();
    const { saml, isConfigured, toggleEnforceSso } = useSecurityStore();
    const configured = isConfigured();

    return (
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 pt-8 pb-10">
                <button
                    onClick={() => navigate('/settings')}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors" onClick={() => navigate('/settings')}>Settings</span>
                        <span>/</span>
                        <span className="text-violet-600">Security and Identity</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                            <Lock size={18} />
                        </div> */}
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Security and Identity</h1>
                    </div>
                </div>
            </div>

            {/* SSO Status Banner */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border-2 mb-8 transition-all ${saml.verified ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30'}`}>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${saml.verified ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        {saml.verified ? '✓ SSO Enabled' : 'SSO Not Configured'}
                    </span>
                    {saml.verified && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">via SAML — <strong className="text-slate-700 dark:text-slate-200">{saml.name}</strong></span>}
                </div>
                {saml.verified && (
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Enforce SSO Login</span>
                        <ToggleSwitch
                            checked={saml.enforceSso}
                            onChange={toggleEnforceSso}
                            size="sm"
                        />
                    </div>
                )}
            </div>

            {saml.enforceSso && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 mb-6">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">⚠ SSO enforcement is active. Password-based login has been disabled for all members.</p>
                </div>
            )}

            {/* SAML Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8">
                <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#F59E0B" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#F59E0B" opacity="0.6" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#F59E0B" opacity="0.6" />
                            <path d="M14 17.5C14 15.567 15.567 14 17.5 14S21 15.567 21 17.5 19.433 21 17.5 21 14 19.433 14 17.5z" fill="#F59E0B" />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">SAML</h2>
                            {saml.verified && (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck size={11} /> Active
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-5">
                            Configure SAML to enable <span className="text-violet-600 font-bold">SSO</span> for your team
                        </p>
                        <button
                            onClick={() => navigate('/settings/security/saml')}
                            className="px-5 py-2.5 rounded-xl border-2 border-violet-300 dark:border-violet-700 text-sm font-black text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {configured ? 'Edit Configuration' : 'Configure SAML'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
