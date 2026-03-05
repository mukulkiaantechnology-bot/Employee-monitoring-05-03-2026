import React from 'react';
import { Info } from 'lucide-react';
import { ADD_ONS } from '../../../store/billingStore';
import { AddOnCard } from '../../../components/billing/AddOnCard';

const ADD_ON_ORDER = ['screenshotFrequency', 'onDemandScreenshots', 'securityBundle'];

export function AddOns() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Info Banner */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
                <Info size={18} className="text-violet-500 shrink-0" />
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                    <strong>Learn more</strong> about how Insightful Add-ons work
                </p>
            </div>

            {/* Add-ons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {ADD_ON_ORDER.map((addOnId) => (
                    <AddOnCard key={addOnId} addOnId={addOnId} />
                ))}
            </div>
        </div>
    );
}
