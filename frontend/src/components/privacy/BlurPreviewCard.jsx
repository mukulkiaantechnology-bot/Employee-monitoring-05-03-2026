import React from 'react';
import { cn } from '../../utils/cn';

export function BlurPreviewCard({ blurLevel }) {
    // blurLevel 0-5 → CSS blur 0-16px
    const blurPx = blurLevel * 3.2;

    return (
        <div className="relative rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden select-none">
            {/* Blurred overlay */}
            <div
                className="absolute inset-0 transition-all duration-300 z-10 pointer-events-none"
                style={{ backdropFilter: blurLevel > 0 ? `blur(${blurPx}px)` : 'none' }}
            />

            {/* Content */}
            <div className="p-6 relative z-0">
                {/* Title */}
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                    Title - 36pt
                </h2>

                {/* Body text */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua - 13pt
                </p>

                {/* Fields row */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">Password - 16pt</p>
                        <div className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                            <span className="text-sm font-mono font-bold text-slate-900 dark:text-white tracking-widest">abcd1234</span>
                            <span className="text-xs text-slate-400 ml-1">· 14pt</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">Card Number - 16pt</p>
                        <div className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                            <span className="text-sm font-mono font-bold text-slate-900 dark:text-white tracking-widest">1234 5678 9101</span>
                            <span className="text-xs text-slate-400 ml-1">· 14pt</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
