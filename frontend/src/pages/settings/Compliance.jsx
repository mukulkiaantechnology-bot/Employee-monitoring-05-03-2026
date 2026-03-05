import React, { useState } from 'react';
import { Shield, Lock, Eye, MapPin, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRealTime } from '../../hooks/RealTimeContext';

const cn = (...inputs) => inputs.filter(Boolean).join(' ');

const ComplianceToggle = ({ title, desc, icon: Icon, enabled, onToggle }) => (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center gap-4">
            <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                enabled ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20" : "bg-slate-50 text-slate-400 dark:bg-slate-800"
            )}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h4>
                <p className="text-xs text-slate-500 font-medium">{desc}</p>
            </div>
        </div>
        <button
            onClick={onToggle}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    enabled ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    </div>
);

export default function Compliance() {
    const { addNotification } = useRealTime();
    const [settings, setSettings] = useState({
        gdpr: true,
        screenshots: true,
        location: true,
        mfa: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        addNotification(`Compliance setting "${key}" updated`, 'success');
    };

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Compliance & Privacy</h1>
                <p className="text-slate-500 font-medium mt-1">Manage data privacy, monitoring toggles, and enterprise security protocols.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Enterprise Shield Active</h3>
                            <p className="text-indigo-100 text-sm mt-1 max-w-md">Your organization is currently operating under high-fidelity privacy standards. All data processing is encrypted and logged for audit purposes.</p>
                            <div className="flex gap-4 mt-6">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                    <CheckCircle2 size={14} /> SOC2 Compliant
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                    <CheckCircle2 size={14} /> HIPAA Ready
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Privacy Controls</h3>
                    <ComplianceToggle
                        title="GDPR Anonymization"
                        desc="Automatically mask employee PII in shared work logs and exports."
                        icon={Lock}
                        enabled={settings.gdpr}
                        onToggle={() => handleToggle('gdpr')}
                    />
                    <ComplianceToggle
                        title="Activity Monitoring"
                        desc="Collect app and website usage data for productivity analytics."
                        icon={Eye}
                        enabled={settings.screenshots}
                        onToggle={() => handleToggle('screenshots')}
                    />
                    <ComplianceToggle
                        title="Location Tracking"
                        desc="Simulate and log GPS coordinates for field-based roles."
                        icon={MapPin}
                        enabled={settings.location}
                        onToggle={() => handleToggle('location')}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Security</h3>
                    <ComplianceToggle
                        title="Two-Factor Authentication (2FA)"
                        desc="Require a secondary code for all administrative actions."
                        icon={Shield}
                        enabled={settings.mfa}
                        onToggle={() => handleToggle('mfa')}
                    />
                </div>

                <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Audit Log Retention</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-1">Changes to compliance settings are permanently logged and cannot be deleted. Ensure you have the necessary authorization before modifying these toggles.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
