import React from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import {
    ChevronLeft,
    CreditCard,
    MessageSquare,
} from 'lucide-react';
import { useBillingStore } from '../../../store/billingStore';
import { cn } from '../../../utils/cn';

export function BillingLayout() {
    const navigate = useNavigate();
    const { billingCycle, setBillingCycle, trialDaysLeft, subscriptionStatus } = useBillingStore();
    const isTrial = subscriptionStatus === 'trial';

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-20">
            {/* Trial Banner */}
            {isTrial && trialDaysLeft > 0 && (
                <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30 py-3 px-6 flex items-center justify-center gap-3 animate-in fade-in duration-500">
                    <MessageSquare size={16} className="text-amber-500 shrink-0" />
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                        <span>{trialDaysLeft} days left on your trial.</span>{' '}
                        <NavLink
                            to="/settings/billing/plans"
                            className="font-black text-amber-600 dark:text-amber-400 hover:underline"
                        >
                            Choose plan
                        </NavLink>
                    </p>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 pt-8 pb-6">
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span
                                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                onClick={() => navigate('/settings')}
                            >
                                Settings
                            </span>
                            <span>/</span>
                            <span className="text-violet-600">Billing</span>
                        </nav>
                        <div className="flex items-center gap-3">
                            {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                                <CreditCard size={18} />
                            </div> */}
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Billing
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Tabs + Billing Toggle */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 mb-8">
                    {/* Tabs */}
                    <div className="flex items-center gap-1">
                        {[
                            { label: 'Plans', to: '/settings/billing/plans' },
                            { label: 'Add-ons', to: '/settings/billing/add-ons' },
                        ].map(({ label, to }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    cn(
                                        'px-5 py-4 text-sm font-black transition-all relative',
                                        isActive
                                            ? 'text-violet-600 dark:text-violet-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {label}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full animate-in fade-in duration-200" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Billing Toggle (only on Plans tab) */}
                    <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
                        {['monthly', 'annual'].map((cycle) => (
                            <button
                                key={cycle}
                                onClick={() => setBillingCycle(cycle)}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200',
                                    billingCycle === cycle
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 dark:shadow-none'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                )}
                            >
                                {cycle === 'monthly' ? 'Monthly Billing' : 'Annual Billing'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <Outlet />
            </div>
        </div>
    );
}
