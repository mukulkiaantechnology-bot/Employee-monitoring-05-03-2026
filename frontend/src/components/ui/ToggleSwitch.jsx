import React from 'react';
import { cn } from '../../utils/cn';

export function ToggleSwitch({ checked, onChange, label, disabled = false, size = 'md' }) {
    const sizes = {
        sm: { track: 'h-5 w-9', thumb: 'h-4 w-4', on: 'left-4', off: 'left-0.5' },
        md: { track: 'h-6 w-11', thumb: 'h-5 w-5', on: 'left-5', off: 'left-0.5' },
        lg: { track: 'h-7 w-14', thumb: 'h-6 w-6', on: 'left-7', off: 'left-0.5' },
    };
    const s = sizes[size] ?? sizes.md;

    return (
        <label className={cn('flex items-center gap-3 cursor-pointer select-none', disabled && 'cursor-not-allowed opacity-50')}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={cn(
                    'relative shrink-0 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30',
                    s.track,
                    checked ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
                )}
            >
                <span className={cn(
                    'absolute top-0.5 rounded-full bg-white shadow transition-all duration-300',
                    s.thumb,
                    checked ? s.on : s.off
                )} />
            </button>
            {label && (
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">{label}</span>
            )}
        </label>
    );
}
