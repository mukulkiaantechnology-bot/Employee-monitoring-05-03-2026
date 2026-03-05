import React from 'react';
import { cn } from '../../utils/cn';

function CheckRow({ checked, onChange, disabled = false, children }) {
    return (
        <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-40 cursor-not-allowed')}>
            <div className={cn('h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                checked ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600')}
                onClick={() => !disabled && onChange(!checked)}>
                {checked && <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.82 7.5L8.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{children}</span>
        </label>
    );
}

export function FormulaStepEdit({ type, config, onChange }) {
    const update = (key, value) => onChange({ ...config, [key]: value });

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Standard Hours */}
            {type === 'standard_hours' && (
                <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Standard Hours Configuration</p>
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1.5">
                            Standard daily hours <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min={1}
                                max={24}
                                value={config.standardDailyHours ?? 8}
                                onChange={(e) => update('standardDailyHours', Number(e.target.value))}
                                className="w-28 h-10 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all text-center"
                            />
                            <span className="text-sm font-semibold text-slate-400">hours / day</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Scheduled Hours */}
            {type === 'scheduled_hours' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Scheduled Hours Configuration</p>
                    <CheckRow checked={!!config.useScheduledShifts} onChange={(v) => update('useScheduledShifts', v)}>
                        Use scheduled shifts from tracking settings
                    </CheckRow>
                    <p className="text-xs font-medium text-slate-400 italic">Utilization will be calculated against the employee's defined shift schedule.</p>
                </div>
            )}

            {/* Active Hours */}
            {type === 'active_hours' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Hours Configuration</p>
                    <CheckRow checked={!!config.excludeIdle} onChange={(v) => update('excludeIdle', v)}>Exclude idle time</CheckRow>
                    <CheckRow checked={!!config.excludeBreaks} onChange={(v) => update('excludeBreaks', v)}>Exclude breaks</CheckRow>
                    <CheckRow checked={!!config.includeManual} onChange={(v) => update('includeManual', v)}>Include manual time</CheckRow>
                </div>
            )}

            {/* Work Hours */}
            {type === 'work_hours' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Work Hours Configuration</p>
                    <CheckRow checked={!!config.includeIdle} onChange={(v) => update('includeIdle', v)}>Include idle time</CheckRow>
                    <CheckRow checked={!!config.includeManual} onChange={(v) => update('includeManual', v)}>Include manual time</CheckRow>
                    <CheckRow checked={!!config.includeMeetings} onChange={(v) => update('includeMeetings', v)}>Include meetings</CheckRow>
                    <CheckRow checked={!!config.includeBreaks} onChange={(v) => update('includeBreaks', v)}>Include breaks</CheckRow>
                </div>
            )}
        </div>
    );
}
