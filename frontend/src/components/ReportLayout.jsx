import React from 'react';
import { Calendar, Filter, Download, ChevronDown } from 'lucide-react';

export function ReportLayout({ title, children }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and analyze your {title.toLowerCase()} data.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                        <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 transition-all">
                            Today
                        </button>
                        <button className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-all">
                            Last 7 Days
                        </button>
                    </div>

                    <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 dark:hover:bg-slate-800 transition-all">
                        <Calendar size={16} className="text-slate-400" />
                        <span>Custom Range</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>

                    <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 dark:hover:bg-slate-800 transition-all">
                        <Filter size={16} className="text-slate-400" />
                        <span>Add Filter</span>
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {children}
            </div>
        </div>
    );
}
