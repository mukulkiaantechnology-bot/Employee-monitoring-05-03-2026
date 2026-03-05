import React from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { InfoBanner } from '../ui/InfoBanner';
import {
    SCREENSHOT_OPTIONS, BREAK_TIME_OPTIONS, IDLE_TIME_OPTIONS,
    TRACKING_SCENARIOS, DAYS_OF_WEEK
} from '../../store/trackingStore';
import { cn } from '../../utils/cn';

function SectionLabel({ title, description }) {
    return (
        <div className="min-w-[160px] max-w-[200px] shrink-0">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed">{description}</p>
            <button className="text-[10px] font-black text-violet-600 dark:text-violet-400 mt-1 hover:underline">Learn more</button>
        </div>
    );
}

function FieldLabel({ children }) {
    return <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 flex items-center gap-1">{children}</label>;
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
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-tight">{children}</span>
        </label>
    );
}

function StyledSelect({ value, onChange, options, disabled = false }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={cn(
                    'w-full h-10 pl-3 pr-8 rounded-xl border-2 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none transition-all appearance-none',
                    disabled ? 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                )}
            >
                {options.map((o) => (
                    <option key={String(o.value)} value={o.value}>{o.label}</option>
                ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
    );
}

function Divider() {
    return <div className="border-t border-slate-100 dark:border-slate-800" />;
}

export function TrackingForm({ form, setForm }) {
    const isStealth = form.visibility === 'stealth';
    const showWorkingDays = form.trackingScenario === 'fixed';
    const isManualClockIn = form.trackingScenario === 'manual';

    const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
    const updatePermission = (key, value) => setForm((f) => ({ ...f, permissions: { ...f.permissions, [key]: value } }));
    const toggleDay = (day) => {
        setForm((f) => ({
            ...f,
            workingDays: f.workingDays.includes(day)
                ? f.workingDays.filter((d) => d !== day)
                : [...f.workingDays, day],
        }));
    };

    return (
        <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
            {/* ── GENERAL ────────────────────────────────────────── */}
            <div className="flex gap-8 py-8">
                <SectionLabel title="General" description="Set up base options for your Tracking Settings" />
                <div className="flex-1 space-y-5">
                    <div className="space-y-1.5">
                        <FieldLabel>Tracking Settings Name</FieldLabel>
                        <input
                            type="text"
                            placeholder="Enter title for tracking settings"
                            value={form.title}
                            onChange={(e) => update('title', e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <FieldLabel>Type of Computers</FieldLabel>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'company', label: 'Company Computers', desc: 'People who work with your devices' },
                                { value: 'personal', label: 'Personal Computers', desc: 'People who work on their personal devices' },
                            ].map((opt) => (
                                <label key={opt.value} className={cn(
                                    'flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all',
                                    form.computerType === opt.value ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                )}>
                                    <input type="radio" name="computerType" checked={form.computerType === opt.value} onChange={() => update('computerType', opt.value)} className="accent-violet-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white">{opt.label}</p>
                                        <p className="text-[10px] font-medium text-slate-400">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── VISIBILITY ─────────────────────────────────────── */}
            <div className="flex gap-8 py-8">
                <SectionLabel title="Visibility" description="" />
                <div className="flex-1">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'visible', label: 'Visible', desc: 'Employees will see Insightful app icon on the computers' },
                            { value: 'stealth', label: 'Stealth', desc: 'Tracker will be hidden from employees on the computers' },
                        ].map((opt) => (
                            <label key={opt.value} className={cn(
                                'flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all',
                                form.visibility === opt.value
                                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            )}>
                                <input type="radio" name="visibility" value={opt.value} checked={form.visibility === opt.value} onChange={() => update('visibility', opt.value)} className="accent-violet-600 mt-0.5" />
                                <div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white">{opt.label}</p>
                                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{opt.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── SCREENSHOTS ────────────────────────────────────── */}
            <div className="flex gap-8 py-8">
                <SectionLabel title="Screenshots" description="Set up your preferred screenshot frequency and control employee access." />
                <div className="flex-1 space-y-4">
                    <div className="space-y-1.5">
                        <FieldLabel>Screenshots Frequency</FieldLabel>
                        <StyledSelect value={form.screenshotsPerHour} onChange={(v) => update('screenshotsPerHour', Number(v))} options={SCREENSHOT_OPTIONS} disabled={isStealth} />
                    </div>
                    <CheckRow checked={form.allowAccessScreenshots} onChange={(v) => update('allowAccessScreenshots', v)} disabled={isStealth}>
                        Allow employees to access screenshots
                    </CheckRow>
                    <CheckRow checked={form.allowRemoveScreenshots} onChange={(v) => update('allowRemoveScreenshots', v)} disabled={isStealth}>
                        Allow employees to remove screenshots
                    </CheckRow>
                </div>
            </div>

            {/* ── BREAK TIME ─────────────────────────────────────── */}
            <div className="flex gap-8 py-8">
                <SectionLabel title="Break Time" description="Set up allowed break time and rules for your employees during their shifts." />
                <div className="flex-1 space-y-4">
                    <div className="space-y-1.5">
                        <FieldLabel>Break Time</FieldLabel>
                        <StyledSelect
                            value={form.breakTime}
                            onChange={(v) => update('breakTime', Number(v))}
                            options={isStealth ? [{ value: 0, label: 'Not available for stealth mode' }] : BREAK_TIME_OPTIONS}
                            disabled={isStealth}
                        />
                    </div>
                    <CheckRow checked={form.allowOverBreak} onChange={(v) => update('allowOverBreak', v)} disabled={isStealth}>
                        Allow staff to go over allowed break time
                    </CheckRow>
                    <CheckRow checked={form.allowNewBreaks} onChange={(v) => update('allowNewBreaks', v)} disabled={isStealth}>
                        Allow new breaks after break time is exceeded
                    </CheckRow>
                </div>
            </div>

            {/* ── TRACKING TIME ──────────────────────────────────── */}
            <div className="flex gap-8 py-8">
                <SectionLabel title="Tracking Time" description="Set up various time tracking options." />
                <div className="flex-1 space-y-5">
                    <div className="space-y-1.5">
                        <FieldLabel>Idle Time</FieldLabel>
                        <StyledSelect value={form.idleTime} onChange={(v) => update('idleTime', Number(v))} options={IDLE_TIME_OPTIONS} />
                    </div>
                    <div className="space-y-2">
                        <FieldLabel>Tracking Scenario</FieldLabel>
                        <div className="grid grid-cols-1 gap-2">
                            {TRACKING_SCENARIOS.map((s) => (
                                <label key={s.id} className={cn(
                                    'flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all',
                                    form.trackingScenario === s.id ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                                )}>
                                    <input type="radio" name="trackingScenario" value={s.id} checked={form.trackingScenario === s.id} onChange={() => update('trackingScenario', s.id)} className="accent-violet-600 mt-0.5" />
                                    <div>
                                        <p className={cn('text-xs font-black', form.trackingScenario === s.id ? 'text-violet-700 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300')}>{s.label}</p>
                                        <p className="text-[10px] font-medium text-slate-400">{s.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Working days selector (fixed only) */}
                    {showWorkingDays && (
                        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                            <FieldLabel>Select Working Days</FieldLabel>
                            <div className="flex flex-wrap gap-2">
                                {DAYS_OF_WEEK.map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => toggleDay(d)}
                                        className={cn(
                                            'px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all',
                                            form.workingDays.includes(d)
                                                ? 'border-violet-500 bg-violet-600 text-white'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300'
                                        )}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Manual Clock In message */}
                    {isManualClockIn && (
                        <InfoBanner variant="info">
                            Employees will clock-in and clock-out using Insightful widget on their computer. Their activities will be tracked while they are clocked-in.
                        </InfoBanner>
                    )}
                </div>
            </div>

            {/* ── PERMISSIONS ────────────────────────────────────── */}
            <div className="flex gap-8 py-8">
                <SectionLabel title="Permissions" description="Add or remove in-app employee permissions." />
                {isStealth ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-slate-200 dark:text-slate-700 mb-3">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <p className="text-sm font-bold text-slate-400">You can't set up permission for employees in Stealth mode.</p>
                    </div>
                ) : (
                    <div className="flex-1 space-y-5">
                        <div className="space-y-3">
                            <FieldLabel>Permission Settings</FieldLabel>
                            <CheckRow checked={form.permissions.canAnalyze} onChange={(v) => updatePermission('canAnalyze', v)}>
                                Employees can analyze their <strong>own utilization</strong>
                            </CheckRow>
                            <CheckRow checked={form.permissions.canSeeApps} onChange={(v) => updatePermission('canSeeApps', v)}>
                                Employees can see used <strong>apps</strong> and <strong>websites</strong>
                            </CheckRow>
                            <CheckRow checked={form.permissions.canAddManual} onChange={(v) => updatePermission('canAddManual', v)}>
                                Employees can add <strong>manual time</strong>
                            </CheckRow>
                        </div>
                        <Divider />
                        <div className="space-y-3">
                            <FieldLabel>Tasks</FieldLabel>
                            <CheckRow checked={form.trackTasks} onChange={(v) => update('trackTasks', v)}>
                                Track time on tasks
                            </CheckRow>
                            <CheckRow checked={form.allowAddTasks} onChange={(v) => update('allowAddTasks', v)} disabled={!form.trackTasks}>
                                Allow employees to add new tasks
                            </CheckRow>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
