import React, { useState } from 'react';
import { X, Shield, ShieldAlert, Globe } from 'lucide-react';
import { usePrivacyStore } from '../../store/privacyStore';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { cn } from '../../utils/cn';

// ── Ask Support Modal ─────────────────────────────────────────────────────────
function AskSupportModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                        <Shield size={22} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Contact Compliance Team</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                    Our compliance specialists can help you understand HIPAA and GDPR obligations for your organization.
                </p>
                <div className="space-y-3 mb-7">
                    <input type="text" placeholder="Your name" className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all" />
                    <input type="email" placeholder="Your email" className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all" />
                    <textarea rows={3} placeholder="Describe your compliance question..." className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all resize-none" />
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        Cancel
                    </button>
                    <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all">
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionLabel({ title, description }) {
    return (
        <div className="min-w-[200px] max-w-[220px] shrink-0">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}

export function PrivacyCompliance() {
    const { privacy, updateField } = usePrivacyStore();
    const [askOpen, setAskOpen] = useState(false);

    const bothApply = privacy.collectPHI === true && privacy.gdprApplicable === true;

    return (
        <>
            <div className="space-y-10">
                {/* Combined alert */}
                {bothApply && (
                    <InfoBanner variant="warning">
                        <strong>Both HIPAA and GDPR compliance policies apply</strong> to your organization. Please ensure you have addressed all requirements for both frameworks.
                    </InfoBanner>
                )}

                {/* ── HIPAA ────────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
                    <SectionLabel
                        title="HIPAA"
                        description={
                            <>
                                <span>The <strong className="text-violet-500">Health Insurance Portability and Accountability Act</strong> of 1996 (HIPAA) is US federal law created to protect sensitive patient health information from being disclosed without the patient's consent or knowledge</span>
                                <br /><br />
                                <span className="font-bold">PHI - Personal Health Information</span>
                            </>
                        }
                    />

                    <div className="flex-1 space-y-4">
                        {/* Question */}
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert size={18} className="text-rose-500 shrink-0" />
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">Do you collect PHI data?</h4>
                        </div>

                        {/* Radio options */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: true, label: 'Yes, I confirm that I collect' },
                                { value: false, label: "No, I don't collect" },
                            ].map((opt) => (
                                <label
                                    key={String(opt.value)}
                                    className={cn(
                                        'flex items-center gap-3 px-5 py-4 rounded-2xl border-2 cursor-pointer transition-all text-sm font-semibold',
                                        privacy.collectPHI === opt.value
                                            ? opt.value
                                                ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400'
                                                : 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="collectPHI"
                                        checked={privacy.collectPHI === opt.value}
                                        onChange={() => updateField('collectPHI', opt.value)}
                                        className="accent-violet-600"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {/* Conditional banners */}
                        {privacy.collectPHI === true && (
                            <InfoBanner variant="warning">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-800/40 text-amber-900 dark:text-amber-300 text-[10px] font-black uppercase tracking-widest">HIPAA compliance required</span>
                                </div>
                                <div className="mt-1">In case that your organization collects information in the category mentioned above, this compliance section is applicable to you.</div>
                            </InfoBanner>
                        )}
                        {privacy.collectPHI === false && (
                            <InfoBanner variant="info">
                                In case that your organization collects information in the category mentioned above, this compliance section is applicable to you. If not, please choose 'No, I don't collect'.
                            </InfoBanner>
                        )}
                        {privacy.collectPHI === null && (
                            <InfoBanner variant="info">
                                In case that your organization collects information in the category mentioned above, this compliance section is applicable to you. If not, please choose 'No, I don't collect'.
                            </InfoBanner>
                        )}
                    </div>
                </div>

                {/* ── GDPR ─────────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
                    <SectionLabel
                        title="GDPR"
                        description={
                            <span>GDPR is an EU law with mandatory rules for how organisations and companies must use personal data in an integrity friendly way. Personal data means any <strong className="text-violet-500">information</strong> which, directly or indirectly, could <strong className="text-violet-500">identify a living person</strong>.</span>
                        }
                    />

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Globe size={18} className="text-violet-500 shrink-0" />
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">Interested in data subject rights?</h4>
                        </div>

                        <InfoBanner variant="info">
                            In case that your organisation does not conduct business under the territory of EU, UK and California or does not process data of the EU, UK and California citizens, please ignore this part of the Compliance section, since it is not applicable to your organisation.
                        </InfoBanner>

                        {privacy.gdprApplicable && (
                            <InfoBanner variant="info">
                                GDPR compliance requires your organization to respond to data subject access requests within 30 days, maintain a record of processing activities, and appoint a Data Protection Officer if required.
                            </InfoBanner>
                        )}
                    </div>
                </div>

                {/* ── Ask Insightful Button ─────────────────────────── */}
                <div>
                    <button
                        onClick={() => setAskOpen(true)}
                        className="w-full md:w-auto py-4 px-8 rounded-2xl border-2 border-violet-300 dark:border-violet-700 text-sm font-black text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all hover:scale-[1.01] active:scale-95"
                    >
                        Ask Insightful
                    </button>
                </div>
            </div>

            <AskSupportModal isOpen={askOpen} onClose={() => setAskOpen(false)} />
        </>
    );
}
