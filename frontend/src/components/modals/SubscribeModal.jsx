import React, { useState } from 'react';
import { Check, X, Loader2, Zap, ArrowUp, AlertTriangle } from 'lucide-react';
import { PLANS, useBillingStore } from '../../store/billingStore';
import { cn } from '../../utils/cn';

export function SubscribeModal({ isOpen, onClose, targetPlanId }) {
    const { currentPlan, subscriptionStatus, subscribeToPlan } = useBillingStore();
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    if (!isOpen || !targetPlanId) return null;

    const plan = PLANS[targetPlanId];
    const currentPlanObj = currentPlan ? PLANS[currentPlan] : null;

    const planOrder = ['productivity', 'timeTracking', 'processImprovement', 'enterprise'];
    const targetIdx = planOrder.indexOf(targetPlanId);
    const currentIdx = currentPlan ? planOrder.indexOf(currentPlan) : -1;

    const isUpgrade = targetIdx > currentIdx;
    const isDowngrade = currentPlan && targetIdx < currentIdx;
    const isTrialActivation = subscriptionStatus === 'trial';

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            subscribeToPlan(targetPlanId);
            setLoading(false);
            setDone(true);
            setTimeout(() => {
                setDone(false);
                onClose();
            }, 1500);
        }, 1200);
    };

    const handleClose = () => {
        if (loading) return;
        setDone(false);
        onClose();
    };

    const iconBg = isDowngrade
        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
        : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {done ? (
                    <div className="p-12 flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                            <Check size={40} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                            Subscription Active!
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            You're now on the <strong>{plan.name}</strong> plan.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-start justify-between mb-5">
                                <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center', iconBg)}>
                                    {isDowngrade ? <AlertTriangle size={22} /> : <Zap size={22} />}
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                {isTrialActivation
                                    ? 'Activate Subscription'
                                    : isUpgrade
                                    ? 'Upgrade Plan'
                                    : 'Downgrade Plan'}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                {isTrialActivation
                                    ? 'Your trial will end and the plan will be activated immediately.'
                                    : isUpgrade
                                    ? 'You will be upgraded and charged the difference immediately.'
                                    : 'Access to premium features will be reduced at the next billing cycle.'}
                            </p>
                        </div>

                        {/* Plan Summary */}
                        <div className="px-8 py-6 space-y-3">
                            {currentPlanObj && (
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
                                        <p className="text-sm font-black text-slate-600 dark:text-slate-300">{currentPlanObj.name}</p>
                                    </div>
                                    <ArrowUp size={18} className={cn('rotate-90', isUpgrade ? 'text-emerald-500' : 'text-amber-500')} />
                                </div>
                            )}
                            <div className={cn(
                                'flex items-center justify-between p-4 rounded-xl border-2',
                                isDowngrade
                                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30'
                                    : 'bg-violet-50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800/30'
                            )}>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        {isTrialActivation ? 'Activating Plan' : 'New Plan'}
                                    </p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{plan.name}</p>
                                </div>
                                <Check size={18} className={isDowngrade ? 'text-amber-500' : 'text-violet-500'} />
                            </div>

                            {isDowngrade && (
                                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 flex gap-3 items-start">
                                    <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400 leading-relaxed">
                                        Downgrading may result in loss of access to features your team currently uses.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="px-8 pb-8 flex gap-3">
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className={cn(
                                    'flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100',
                                    isDowngrade
                                        ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-none'
                                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-violet-200 dark:shadow-none'
                                )}
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : isDowngrade ? 'Confirm Downgrade' : 'Confirm & Subscribe'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
