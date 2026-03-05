import React, { useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { PLANS, useBillingStore } from '../../store/billingStore';
import { cn } from '../../utils/cn';

export function PlanCard({ planId, onSubscribeClick }) {
    const { currentPlan, billingCycle, subscriptionStatus } = useBillingStore();
    const plan = PLANS[planId];
    const isActive = currentPlan === planId && subscriptionStatus === 'active';
    const isEnterprise = planId === 'enterprise';
    const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                'relative flex flex-col rounded-[2rem] border-2 bg-white dark:bg-slate-900 p-7 transition-all duration-300 cursor-default group',
                isActive
                    ? 'border-violet-500 shadow-2xl shadow-violet-100 dark:shadow-violet-900/20 scale-[1.01]'
                    : hovered
                    ? 'border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-slate-900/20 -translate-y-1'
                    : 'border-slate-100 dark:border-slate-800 shadow-sm'
            )}
        >
            {isActive && (
                <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-violet-200 dark:shadow-none">
                    Current Plan
                </div>
            )}

            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
                <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-br', plan.color)} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {plan.badge}
                </span>
            </div>

            {/* Name */}
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 leading-tight">
                {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-1">
                {isEnterprise ? (
                    <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Custom
                    </div>
                ) : (
                    <div className="flex items-end gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-all duration-300">
                            ${price?.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            {!isEnterprise && (
                <p className="text-[11px] font-semibold text-slate-400 mb-6">
                    Per seat / a month.{' '}
                    <span className="text-violet-500">
                        Billed {billingCycle === 'annual' ? 'annually' : 'monthly'}.
                    </span>
                </p>
            )}

            {isEnterprise && (
                <p className="text-[11px] font-semibold text-slate-400 mb-6">Custom pricing for your needs.</p>
            )}

            {/* CTA Button */}
            {isEnterprise ? (
                <button className="w-full py-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 hover:border-violet-500 hover:text-violet-600 dark:hover:border-violet-500 dark:hover:text-violet-400 transition-all flex items-center justify-center gap-2 group/btn mb-6">
                    Contact Sales
                    <ExternalLink size={14} className="opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                </button>
            ) : isActive ? (
                <div className="w-full py-3.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-sm font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 flex items-center justify-center gap-2 mb-6">
                    <Check size={16} /> Active
                </div>
            ) : (
                <button
                    onClick={() => onSubscribeClick(planId)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all mb-6"
                >
                    Subscribe
                </button>
            )}

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-800 mb-5" />

            {/* Feature note */}
            <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight mb-3">
                {plan.featureNote}
            </p>

            {/* Features */}
            <ul className="space-y-2 flex-1">
                {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                        <Check size={13} className="text-violet-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                            {feat}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
