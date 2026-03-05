import React from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { SHIFT_THRESHOLD_OPTIONS } from '../../store/trackingStore';
import { cn } from '../../utils/cn';

function SectionLabel({ title, description, note }) {
    return (
        <div className="min-w-[160px] max-w-[200px] shrink-0 space-y-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{title}</h3>
            {description && <p className="text-xs font-medium text-slate-400 leading-relaxed">{description}</p>}
            {note && <p className="text-[10px] font-semibold text-amber-500 italic leading-relaxed">{note}</p>}
        </div>
    );
}

function FieldLabel({ children }) {
    return <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{children}</label>;
}

function CheckRow({ checked, onChange, disabled = false, children }) {
    return (
        <label className={cn('flex items-center gap-2.5 cursor-pointer', disabled && 'opacity-40 cursor-not-allowed')}>
            <div
                className={cn(
                    'h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                    checked ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600'
                )}
                onClick={() => !disabled && onChange(!checked)}
            >
                {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.82 7.5L8.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">{children}</span>
        </label>
    );
}

function SubCheckRow({ checked, onChange, disabled, children }) {
    return (
        <CheckRow checked={checked} onChange={onChange} disabled={disabled}>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{children}</span>
        </CheckRow>
    );
}

export function AdvancedForm({ settings, onChange }) {
    const update = (key, value) => onChange({ [key]: value });

    return (
        <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
            {/* ── GENERAL ─────────────────────────────────────────── */}
            <div className="flex gap-10 py-8">
                <SectionLabel
                    title="General"
                    description="General tracking settings which will apply to all users."
                />
                <div className="flex-1 space-y-5">
                    <div className="space-y-1.5">
                        <FieldLabel>Shift Threshold</FieldLabel>
                        <div className="relative">
                            <select
                                value={settings.shiftThreshold}
                                onChange={(e) => update('shiftThreshold', Number(e.target.value))}
                                className="w-full h-10 pl-3 pr-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none transition-all appearance-none"
                            >
                                {SHIFT_THRESHOLD_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <FieldLabel>Strict time</FieldLabel>
                        <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 space-y-4">
                            <CheckRow checked={settings.strictTime} onChange={(v) => update('strictTime', v)}>
                                Use strict time
                            </CheckRow>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Inactivity pop-ups</span>
                                <ToggleSwitch size="sm" checked={settings.inactivityPopups} onChange={(v) => update('inactivityPopups', v)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── IDENTIFICATION ──────────────────────────────────── */}
            <div className="flex gap-10 py-8">
                <SectionLabel
                    title="Identification"
                    description="This is how any employees you add will show within the dashboard."
                    note="Company computer identification will be only applied to future employees."
                />
                <div className="flex-1 space-y-5">
                    <div className="space-y-2">
                        <FieldLabel>Company Computers</FieldLabel>
                        <div className="space-y-2">
                            {[
                                { value: 'hwid', label: 'HWID/Username' },
                                { value: 'computer-user', label: 'Computer Name/Username' },
                                { value: 'computer', label: 'Computer Name' },
                            ].map((opt) => (
                                <label key={opt.value} className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all',
                                    settings.identificationMode === opt.value ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                )}>
                                    <input type="radio" name="identificationMode" value={opt.value} checked={settings.identificationMode === opt.value} onChange={() => update('identificationMode', opt.value)} className="accent-violet-600" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <FieldLabel>Personal Computers</FieldLabel>
                        <div className="p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            User <span className="text-violet-600 font-bold">email</span> will be used for identification
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ENGAGEMENT ──────────────────────────────────────── */}
            <div className="flex gap-10 py-8">
                <SectionLabel
                    title="Engagement"
                    description="Engagement is shown via percentage and it represents employees' engagement based on mouse and keyboard usage"
                />
                <div className="flex-1">
                    <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Show engagement level</span>
                        <ToggleSwitch size="sm" checked={settings.showEngagement} onChange={(v) => update('showEngagement', v)} />
                    </div>
                </div>
            </div>

            {/* ── ACTIVE DIRECTORY ────────────────────────────────── */}
            <div className="flex gap-10 py-8">
                <SectionLabel
                    title="Active directory"
                    description="Settings related to the usage and syncing of Active Directory."
                    note="Active Directory settings will only be applied to future employees."
                />
                <div className="flex-1 space-y-4">
                    <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div
                                className={cn(
                                    'h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all',
                                    settings.useActiveDirectory ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600'
                                )}
                                onClick={() => update('useActiveDirectory', !settings.useActiveDirectory)}
                            >
                                {settings.useActiveDirectory && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.82 7.5L8.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Use Active Directory</span>
                        </div>
                        {settings.useActiveDirectory && (
                            <div className="ml-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <SubCheckRow checked={settings.adEmail} onChange={(v) => update('adEmail', v)}>
                                    Email - from the email field in user object in active directory
                                </SubCheckRow>
                                <SubCheckRow checked={settings.adTeam} onChange={(v) => update('adTeam', v)}>
                                    Team - from the department field in user object in active directory
                                </SubCheckRow>
                                <SubCheckRow checked={settings.adTrackingSettings} onChange={(v) => update('adTrackingSettings', v)}>
                                    Tracking settings - from the department field in user object in active directory
                                </SubCheckRow>
                            </div>
                        )}
                    </div>
                    {settings.useActiveDirectory && (
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                <strong>Active Directory Identification:</strong> Domain/User will be used for identification
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
