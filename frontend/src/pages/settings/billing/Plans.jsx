import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { PLANS } from '../../../store/billingStore';
import { PlanCard } from '../../../components/billing/PlanCard';
import { SubscribeModal } from '../../../components/modals/SubscribeModal';

const PLAN_ORDER = ['productivity', 'timeTracking', 'processImprovement', 'enterprise'];

export function Plans() {
    const [subscribingPlan, setSubscribingPlan] = useState(null);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Info Banner */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
                <Info size={18} className="text-violet-500 shrink-0" />
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                    <strong>Learn more</strong> about how Insightful Billing works
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {PLAN_ORDER.map((planId) => (
                    <PlanCard
                        key={planId}
                        planId={planId}
                        onSubscribeClick={setSubscribingPlan}
                    />
                ))}
            </div>

            {/* Compare Link */}
            <div className="text-center py-4">
                <p className="text-sm text-slate-400 font-medium">Not sure which one to choose?</p>
                <button className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline mt-1">
                    See All Features and Compare Plans
                </button>
            </div>

            {/* Subscribe Modal */}
            <SubscribeModal
                isOpen={!!subscribingPlan}
                onClose={() => setSubscribingPlan(null)}
                targetPlanId={subscribingPlan}
            />
        </div>
    );
}
