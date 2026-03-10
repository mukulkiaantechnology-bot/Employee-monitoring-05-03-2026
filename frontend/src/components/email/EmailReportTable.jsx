import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { CONTENT_OPTIONS } from '../../store/emailReportStore';
import { cn } from '../../utils/cn';

function ActionMenu({ report, onEdit, onDelete, onToggle }) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const ref = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleMenu = () => {
        if (!open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX - 192, // 192 is w-48
            });
        }
        setOpen(!open);
    };

    return (
        <div ref={ref}>
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <div 
                    style={{ top: position.top, left: position.left }}
                    className="fixed z-[100] w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                >
                    <button
                        onClick={() => { onEdit(report); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        <Edit2 size={15} className="text-slate-400" /> Edit
                    </button>
                    <button
                        onClick={() => { onToggle(report.id); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        {report.isActive
                            ? <ToggleRight size={15} className="text-violet-500" />
                            : <ToggleLeft size={15} className="text-slate-400" />}
                        {report.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800" />
                    <button
                        onClick={() => { onDelete(report); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
                    >
                        <Trash2 size={15} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function getContentLabels(contentIds) {
    return contentIds
        .map((id) => CONTENT_OPTIONS.find((o) => o.id === id)?.label)
        .filter(Boolean)
        .join(', ');
}

export function EmailReportTable({ reports, onEdit, onDelete, onToggle }) {
    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600 border-4 border-white dark:border-slate-800 shadow-xl">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 8h20M6 4v4M18 4v4" />
                    </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No email reports</h3>
                <p className="text-slate-400 font-medium text-sm max-w-xs">
                    Create your first email report to start receiving scheduled updates.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full relative">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto min-h-[200px]">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        {['Title', 'Frequency', 'Recipients', 'Content', ''].map((h, i) => (
                            <th
                                key={i}
                                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {reports.map((report) => {
                        const contentText = getContentLabels(report.content);
                        const truncated = contentText.length > 55 ? contentText.slice(0, 55) + '…' : contentText;

                        return (
                            <tr
                                key={report.id}
                                className={cn(
                                    'hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 group',
                                    !report.isActive && 'opacity-50'
                                )}
                            >
                                {/* Title */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'h-2 w-2 rounded-full shrink-0',
                                            report.isActive ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                                        )} />
                                        <span className="text-sm font-black text-slate-900 dark:text-white">
                                            {report.title}
                                        </span>
                                    </div>
                                </td>

                                {/* Frequency */}
                                <td className="px-6 py-5">
                                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize">
                                        {report.frequency}
                                    </span>
                                </td>

                                {/* Recipients */}
                                <td className="px-6 py-5">
                                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        {report.recipients.length === 1
                                            ? '1 recipient'
                                            : `${report.recipients.length} recipients`}
                                    </span>
                                </td>

                                {/* Content */}
                                <td className="px-6 py-5 max-w-xs">
                                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400" title={contentText}>
                                        {truncated || '—'}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-5 text-right">
                                    <ActionMenu
                                        report={report}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggle={onToggle}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((report) => {
                    const contentText = getContentLabels(report.content);

                    return (
                        <div 
                            key={report.id}
                            className={cn(
                                "flex flex-col gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                                !report.isActive && 'opacity-50'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'h-2 w-2 rounded-full shrink-0',
                                        report.isActive ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                                    )} />
                                    <span className="text-sm font-black text-slate-900 dark:text-white">
                                        {report.title}
                                    </span>
                                </div>
                                <ActionMenu
                                    report={report}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onToggle={onToggle}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Frequency</p>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">{report.frequency}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Recipients</p>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        {report.recipients.length === 1 ? '1 recipient' : `${report.recipients.length} recipients`}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Content</p>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2" title={contentText}>
                                        {contentText || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
