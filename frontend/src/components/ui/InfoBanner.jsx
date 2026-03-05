import React from 'react';
import { Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANTS = {
    info: {
        icon: Info,
        wrapper: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-800 dark:text-blue-300',
    },
    warning: {
        icon: AlertTriangle,
        wrapper: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30',
        iconColor: 'text-amber-500',
        textColor: 'text-amber-800 dark:text-amber-400',
    },
    success: {
        icon: CheckCircle2,
        wrapper: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30',
        iconColor: 'text-emerald-500',
        textColor: 'text-emerald-800 dark:text-emerald-400',
    },
    error: {
        icon: AlertCircle,
        wrapper: 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/30',
        iconColor: 'text-rose-500',
        textColor: 'text-rose-800 dark:text-rose-400',
    },
};

export function InfoBanner({ variant = 'info', children, className }) {
    const { icon: Icon, wrapper, iconColor, textColor } = VARIANTS[variant] ?? VARIANTS.info;
    return (
        <div className={cn('flex items-start gap-3 px-4 py-3.5 rounded-2xl border', wrapper, className)}>
            <Icon size={16} className={cn('shrink-0 mt-0.5', iconColor)} />
            <p className={cn('text-xs font-semibold leading-relaxed', textColor)}>{children}</p>
        </div>
    );
}
