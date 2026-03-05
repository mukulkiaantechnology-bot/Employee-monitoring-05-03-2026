import React, { useRef, useState } from 'react';
import { MoreVertical, Pin } from 'lucide-react';
import { FORMULA_TYPES } from '../../store/utilizationStore';
import { cn } from '../../utils/cn';

function ActionMenu({ formula, onEdit, onDelete, onSetDefault }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    React.useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    const isSystem = formula.author === 'system';
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <MoreVertical size={18} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <button onClick={() => { onEdit(formula); setOpen(false); }} className="w-full px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">Edit</button>
                    {!formula.isDefault && (
                        <button onClick={() => { onSetDefault(formula.id); setOpen(false); }} className="w-full px-4 py-3 text-sm font-semibold text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 text-left transition-all">Set as Default</button>
                    )}
                    <div className="border-t border-slate-100 dark:border-slate-800" />
                    <button
                        onClick={() => { if (!isSystem) { onDelete(formula); setOpen(false); } }}
                        disabled={isSystem}
                        className="w-full px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-left transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title={isSystem ? 'System formulas cannot be deleted' : ''}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function TypeLabel({ typeId }) {
    const type = FORMULA_TYPES.find((t) => t.id === typeId);
    return <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{type?.label ?? typeId}</span>;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function UtilizationTable({ formulas, onEdit, onDelete, onSetDefault }) {
    if (formulas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-slate-400 font-bold text-sm">No formulas match your search or filters.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                        {['Formula Name', 'Created At', 'Formula Type', '# of Teams', 'Author', 'Last Edited', ''].map((h, i) => (
                            <th key={i} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 whitespace-nowrap">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {formulas.map((f) => (
                        <tr key={f.id} className="hover:bg-violet-50/20 dark:hover:bg-violet-900/5 transition-all group">
                            {/* Formula Name */}
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                    {f.isDefault && (
                                        <Pin size={13} className="text-violet-600 dark:text-violet-400 shrink-0 rotate-45" />
                                    )}
                                    <span className={cn('text-sm font-black', f.isDefault ? 'text-violet-700 dark:text-violet-400' : 'text-slate-900 dark:text-white')}>
                                        {f.name}
                                    </span>
                                    {f.isDefault && (
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400">
                                            Default
                                        </span>
                                    )}
                                </div>
                            </td>
                            {/* Created At */}
                            <td className="px-5 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                {formatDate(f.createdAt)}
                            </td>
                            {/* Formula Type */}
                            <td className="px-5 py-4"><TypeLabel typeId={f.type} /></td>
                            {/* Teams */}
                            <td className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                {f.teams === 'all' ? `All (${f.teamCount ?? 1})` : f.teamCount ?? 0}
                            </td>
                            {/* Author */}
                            <td className="px-5 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize">{f.author}</td>
                            {/* Last Edited */}
                            <td className="px-5 py-4">
                                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    {formatDate(f.lastEdited)}
                                </div>
                            </td>
                            {/* Actions */}
                            <td className="px-5 py-4 text-right">
                                <ActionMenu formula={f} onEdit={onEdit} onDelete={onDelete} onSetDefault={onSetDefault} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
