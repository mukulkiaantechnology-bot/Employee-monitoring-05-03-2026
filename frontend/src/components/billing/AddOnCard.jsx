import React from 'react';
import { BarChart2, Camera, ShieldCheck, Check, ToggleLeft, ToggleRight, Zap } from 'lucide-react';
import { ADD_ONS, useBillingStore } from '../../store/billingStore';
import { cn } from '../../utils/cn';

const ICONS = { BarChart2, Camera, ShieldCheck };

export function AddOnCard({ addOnId }) {
    const { addOns, toggleAddOn, subscriptionStatus } = useBillingStore();
    const addOn = ADD_ONS[addOnId];
    const isTrial = subscriptionStatus === 'trial';
    const isEnabled = addOns[addOnId];
    const IconComponent = ICONS[addOn.icon] || Zap;

    return (
        <div className={cn(
            'relative flex flex-col rounded-[2rem] border-2 bg-white dark:bg-slate-900 transition-all duration-300',
            isEnabled && !isTrial
                ? 'border-violet-400 dark:border-violet-700 shadow-xl shadow-violet-50 dark:shadow-violet-900/10'
                : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5'
        )}>
            {/* Card Body */}
            <div className="p-7 flex-1">
                {/* Icon + Name + Price */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                            <IconComponent size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-violet-600 dark:text-violet-400 leading-tight">
                                {addOn.name}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">${addOn.price}.0</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-400 mb-6">per seat / a month</p>

                {/* Features */}
                <div className="mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Key Features</p>
                    <ul className="space-y-2">
                        {addOn.features.map((feat) => (
                            <li key={feat} className="flex items-center gap-2.5">
                                <div className="h-5 w-5 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                    <Zap size={10} className="text-slate-400" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className={cn(
                'px-7 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between',
                isTrial ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''
            )}>
                {isTrial ? (
                    <div className="flex items-center gap-2">
                        <Check size={15} className="text-emerald-500" />
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Included while on trial</span>
                    </div>
                ) : (
                    <>
                        <span className={cn(
                            'text-xs font-black uppercase tracking-widest',
                            isEnabled ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
                        )}>
                            {isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                            onClick={() => toggleAddOn(addOnId)}
                            className="transition-all hover:scale-105 active:scale-95 focus:outline-none"
                            aria-label={`Toggle ${addOn.name}`}
                        >
                            {isEnabled ? (
                                <ToggleRight size={34} className="text-violet-500" />
                            ) : (
                                <ToggleLeft size={34} className="text-slate-300 dark:text-slate-600" />
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
