import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { PRODUCTIVITY_OPTIONS } from '../../store/manualTimeStore';
import { cn } from '../../utils/cn';

const PRODUCTIVITY_BADGE = {
    productive: 'text-emerald-600 dark:text-emerald-400 font-bold',
    neutral: 'text-slate-500 dark:text-slate-400 font-bold',
    unproductive: 'text-rose-600 dark:text-rose-400 font-bold',
};

function formatDuration(minutes) {
    if (minutes >= 60) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h ${m}m` : `${h} h`;
    }
    return `${minutes} min`;
}

function ActionMenu({ entryId, onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
            >
                <MoreVertical size={18} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                        onClick={() => { onEdit(entryId); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        <Edit2 size={15} className="text-slate-400" /> Edit
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800" />
                    <button
                        onClick={() => { onDelete(entryId); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
                    >
                        <Trash2 size={15} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export function ManualTimeTable({ types, onEdit, onDelete }) {
    if (types.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600 shadow-xl">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4l3 3" />
                    </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No manual time types</h3>
                <p className="text-slate-400 font-medium text-sm">Add a new type to get started.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        {['Title', 'Auto-approval', 'Billable', 'Productivity', 'Max Duration', 'Project', ''].map((h, i) => (
                            <th key={i} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {types.map((type) => {
                        const prodLabel = PRODUCTIVITY_OPTIONS.find(p => p.id === type.productivity)?.label ?? type.productivity;
                        return (
                            <tr key={type.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 group">
                                {/* Title */}
                                <td className="px-6 py-5 max-w-[220px]">
                                    <span className="text-sm font-black text-slate-900 dark:text-white truncate block" title={type.title}>
                                        {type.title}
                                    </span>
                                </td>

                                {/* Auto-approval */}
                                <td className="px-6 py-5">
                                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        {type.autoApproval ? 'On' : 'Off'}
                                    </span>
                                </td>

                                {/* Billable */}
                                <td className="px-6 py-5">
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        {type.billable ? 'Billable' : 'Non-Billable'}
                                    </span>
                                </td>

                                {/* Productivity */}
                                <td className="px-6 py-5">
                                    <span className={cn('text-sm capitalize', PRODUCTIVITY_BADGE[type.productivity])}>
                                        {prodLabel}
                                    </span>
                                </td>

                                {/* Max Duration */}
                                <td className="px-6 py-5">
                                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        {formatDuration(type.maxDuration)}
                                    </span>
                                </td>

                                {/* Project */}
                                <td className="px-6 py-5">
                                    <span className={cn(
                                        'text-sm font-semibold',
                                        type.projectRequired ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'
                                    )}>
                                        {type.projectRequired ? 'Enabled' : 'Disabled'}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-5 text-right">
                                    <ActionMenu entryId={type.id} onEdit={onEdit} onDelete={onDelete} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
