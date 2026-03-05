import React, { useRef, useState } from 'react';
import { MoreVertical, Star } from 'lucide-react';
import { SCREENSHOT_OPTIONS, TRACKING_SCENARIOS } from '../../store/trackingStore';
import { cn } from '../../utils/cn';

function ActionMenu({ profileId, isDefault, onSetDefault, onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    React.useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <MoreVertical size={18} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <button onClick={() => { onEdit(profileId); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Edit</button>
                    {!isDefault && (
                        <button onClick={() => { onSetDefault(profileId); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <Star size={13} className="text-amber-400" /> Set as Default
                        </button>
                    )}
                    <div className="border-t border-slate-100 dark:border-slate-800" />
                    <button onClick={() => { onDelete(profileId); setOpen(false); }} disabled={isDefault} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Delete</button>
                </div>
            )}
        </div>
    );
}

export function TrackingTable({ profiles, search, onEdit, onDelete, onSetDefault }) {
    const filtered = profiles.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    const screenshotLabel = (val) => SCREENSHOT_OPTIONS.find(o => o.value === val)?.label ?? `${val}/h`;
    const scenarioLabel = (id) => TRACKING_SCENARIOS.find(s => s.id === id)?.label ?? id;

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <p className="text-slate-400 font-bold text-sm">No tracking profiles match your search.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                        {['Title', 'Visibility', 'Screenshots', 'Tracking Settings', 'Tracking Scenario', 'Track time on Tasks', ''].map((h, i) => (
                            <th key={i} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 whitespace-nowrap">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {filtered.map((p) => (
                        <tr key={p.id} className="hover:bg-violet-50/20 dark:hover:bg-violet-900/5 transition-all group">
                            {/* Title */}
                            <td className="px-6 py-5">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{p.title}</span>
                                        {p.default && (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-violet-600 dark:text-violet-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />Default
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 capitalize">{p.computerType} Computers</span>
                                </div>
                            </td>
                            {/* Visibility */}
                            <td className="px-6 py-5">
                                <span className={cn(
                                    'text-sm font-bold capitalize',
                                    p.visibility === 'stealth' ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                                )}>
                                    {p.visibility === 'stealth' ? 'Stealth' : 'Visible'}
                                </span>
                            </td>
                            {/* Screenshots */}
                            <td className="px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                {screenshotLabel(p.screenshotsPerHour)}
                            </td>
                            {/* Tracking Settings */}
                            <td className="px-6 py-5">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        <span className="font-black">{p.breakTime}</span> min Break Time
                                    </p>
                                    <p className="text-xs font-bold text-slate-400">
                                        <span className="font-black">{p.idleTime}</span> min Idle Time
                                    </p>
                                </div>
                            </td>
                            {/* Tracking Scenario */}
                            <td className="px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                {scenarioLabel(p.trackingScenario)}
                            </td>
                            {/* Track Tasks */}
                            <td className="px-6 py-5">
                                <span className={cn(
                                    'text-sm font-bold',
                                    p.trackTasks ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                                )}>
                                    {p.trackTasks ? 'Enabled' : 'Disabled'}
                                </span>
                            </td>
                            {/* Actions */}
                            <td className="px-6 py-5 text-right">
                                <ActionMenu
                                    profileId={p.id}
                                    isDefault={p.default}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onSetDefault={onSetDefault}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
