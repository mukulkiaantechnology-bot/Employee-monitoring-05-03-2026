import React from 'react';

export function TagBadge({ tag, size = 'sm', onClick }) {
    if (!tag) return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
            Unassigned
        </span>
    );

    const style = {
        backgroundColor: tag.color + '22',
        color: tag.color,
        borderColor: tag.color + '44',
    };

    return (
        <span
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${size === 'lg' ? 'px-4 py-1.5 text-sm' : ''}`}
            style={style}
        >
            {tag.name}
        </span>
    );
}
