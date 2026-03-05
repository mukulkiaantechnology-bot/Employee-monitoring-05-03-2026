import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export function CopyField({ label, value, className }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback for non-secure contexts
            const el = document.createElement('textarea');
            el.value = value;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{label}</label>
            )}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-11 px-4 flex items-center rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-mono text-slate-600 dark:text-slate-300 select-all overflow-hidden">
                    <span className="truncate">{value}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className={cn(
                        'h-11 px-4 rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all border-2',
                        copied
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600'
                    )}
                >
                    {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
}
