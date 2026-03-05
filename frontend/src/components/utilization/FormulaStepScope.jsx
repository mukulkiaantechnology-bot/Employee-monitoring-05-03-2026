import React from 'react';
import { FORMULA_TYPES } from '../../store/utilizationStore';
import { cn } from '../../utils/cn';

const TEAMS_OPTIONS = ['All Teams', 'Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];

function configSummary(type, config) {
    const lines = [];
    if (type === 'standard_hours') lines.push(`Standard daily hours: ${config.standardDailyHours ?? 8}h`);
    if (type === 'scheduled_hours') lines.push(`Use scheduled shifts: ${config.useScheduledShifts ? 'Yes' : 'No'}`);
    if (type === 'active_hours') {
        if (config.excludeIdle) lines.push('Exclude idle time');
        if (config.excludeBreaks) lines.push('Exclude breaks');
        if (config.includeManual) lines.push('Include manual time');
    }
    if (type === 'work_hours') {
        if (config.includeIdle) lines.push('Include idle');
        if (config.includeManual) lines.push('Include manual');
        if (config.includeMeetings) lines.push('Include meetings');
        if (config.includeBreaks) lines.push('Include breaks');
    }
    return lines.length ? lines.join(', ') : '—';
}

export function FormulaStepScope({ form, onChange }) {
    const typeLabel = FORMULA_TYPES.find((t) => t.id === form.type)?.label ?? form.type;

    const toggleTeam = (team) => {
        if (form.teams === 'all') {
            onChange({ teams: [team] });
        } else if (Array.isArray(form.teams)) {
            const exists = form.teams.includes(team);
            const next = exists ? form.teams.filter((t) => t !== team) : [...form.teams, team];
            onChange({ teams: next.length === 0 ? 'all' : next });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Name */}
            <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Formula Name <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter formula name"
                    value={form.name}
                    onChange={(e) => onChange({ name: e.target.value })}
                    className={cn(
                        'w-full h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
                        !form.name.trim() ? 'border-rose-300' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                    )}
                />
            </div>

            {/* Assign to */}
            <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Assign To</label>
                <div className="flex gap-3">
                    <button
                        onClick={() => onChange({ teams: 'all' })}
                        className={cn('flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all',
                            form.teams === 'all' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10 text-violet-700 dark:text-violet-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300')}
                    >
                        All Teams
                    </button>
                    <button
                        onClick={() => form.teams === 'all' && onChange({ teams: [] })}
                        className={cn('flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all',
                            form.teams !== 'all' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10 text-violet-700 dark:text-violet-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300')}
                    >
                        Selected Teams
                    </button>
                </div>
                {form.teams !== 'all' && (
                    <div className="flex flex-wrap gap-2 mt-2 animate-in fade-in duration-200">
                        {TEAMS_OPTIONS.slice(1).map((team) => {
                            const selected = Array.isArray(form.teams) && form.teams.includes(team);
                            return (
                                <button key={team} onClick={() => toggleTeam(team)} className={cn(
                                    'px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all',
                                    selected ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300'
                                )}>
                                    {team}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Summary Preview</p>
                {[
                    { label: 'Type', value: typeLabel },
                    { label: 'Teams', value: form.teams === 'all' ? 'All Teams' : (Array.isArray(form.teams) ? form.teams.join(', ') || 'None selected' : form.teams) },
                    { label: 'Author', value: 'User (you)' },
                    { label: 'Settings', value: configSummary(form.type, form.config) },
                ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 text-xs">
                        <span className="font-bold text-slate-400 shrink-0 w-16">{row.label}</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-right">{row.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
