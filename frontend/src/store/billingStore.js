import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const PLANS = {
    productivity: {
        id: 'productivity',
        name: 'Productivity Management',
        badge: 'NO USER MINIMUM',
        monthlyPrice: 8,
        annualPrice: 6.4,
        userLimitLabel: 'No user minimum',
        features: [
            'Apps & Web Activity Analysis',
            'Attendance',
            'Screenshots',
            'Activities Analysis',
            'Productivity Reports',
            'Work Type Reports',
            'HRIS Integrations',
            '2FA',
            'Stealth mode',
        ],
        featureNote: 'Productivity Management Plan includes:',
        color: 'from-violet-500 to-indigo-600',
    },
    timeTracking: {
        id: 'timeTracking',
        name: 'Time Tracking',
        badge: 'NO USER MINIMUM',
        monthlyPrice: 10,
        annualPrice: 8,
        userLimitLabel: 'No user minimum',
        features: [
            'Project Management',
            'Project & Task Time Tracking',
            'Budgeting',
            'Invoicing',
            'Project Management Integrations',
            'Customer Service Integrations',
            'Invoicing Integrations',
        ],
        featureNote: 'Includes Productivity Management Features, plus:',
        color: 'from-blue-500 to-cyan-600',
    },
    processImprovement: {
        id: 'processImprovement',
        name: 'Process Improvement',
        badge: 'OVER 50 USERS',
        monthlyPrice: 15,
        annualPrice: 12,
        userLimitLabel: 'For teams 50+',
        features: [
            'Automated Project & Task Time Tracking',
            'Workflow Analysis',
            'Budgeting',
            'Industry-Specific Process Optimization',
            'Location (Hybrid Work) Reports',
        ],
        featureNote: 'Includes Time Tracking Features, plus:',
        color: 'from-emerald-500 to-teal-600',
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise Solution',
        badge: 'OVER 100 USERS',
        monthlyPrice: null,
        annualPrice: null,
        userLimitLabel: 'For large enterprises',
        features: [
            'License Management',
            'Capacity Analysis',
            'Insider Threat Detection',
            'Advanced Reporting',
            'Data Warehouse Integrations',
            'SAML SSO',
            'Audit Logs',
            'Customized Onboarding & Support',
            'On-Premise Deployment',
        ],
        featureNote: 'Includes Process Improvement Features, plus:',
        color: 'from-rose-500 to-pink-600',
    },
};

export const ADD_ONS = {
    screenshotFrequency: {
        id: 'screenshotFrequency',
        name: 'Increased Screenshot Frequency',
        price: 2,
        icon: 'BarChart2',
        features: ['Up to 120 screenshots per hour', 'Privacy Control'],
        relatedFeature: 'screenshots',
    },
    onDemandScreenshots: {
        id: 'onDemandScreenshots',
        name: 'On-Demand Screenshots',
        price: 1,
        icon: 'Camera',
        features: ['Instant Snapshots', 'Privacy Control'],
        relatedFeature: 'screenshots',
    },
    securityBundle: {
        id: 'securityBundle',
        name: 'Security Bundle',
        price: 2,
        icon: 'ShieldCheck',
        features: ['Security Alerts', 'IT forensics (Activity Logs)'],
        relatedFeature: 'security',
    },
};

export const useBillingStore = create(
    persist(
        (set, get) => ({
            billingCycle: 'annual', // monthly | annual
            currentPlan: null,
            subscriptionStatus: 'trial', // trial | active | canceled
            trialDaysLeft: 5,
            addOns: {
                screenshotFrequency: true,
                onDemandScreenshots: true,
                securityBundle: true,
            },

            // Actions
            setBillingCycle: (cycle) => set({ billingCycle: cycle }),

            subscribeToPlan: (planId) => {
                if (planId === 'enterprise') return; // not directly subscribable
                set({
                    currentPlan: planId,
                    subscriptionStatus: 'active',
                    trialDaysLeft: 0,
                });
            },

            toggleAddOn: (addOnId) => {
                const state = get();
                // During trial, add-ons are auto-included, cannot toggle
                if (state.subscriptionStatus === 'trial') return;
                set((s) => ({
                    addOns: {
                        ...s.addOns,
                        [addOnId]: !s.addOns[addOnId],
                    },
                }));
            },

            cancelSubscription: () => set({ subscriptionStatus: 'canceled' }),

            // Getters
            getPlanPrice: (planId) => {
                const state = get();
                const plan = PLANS[planId];
                if (!plan) return null;
                return state.billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            },
        }),
        { name: 'billing-storage' }
    )
);
