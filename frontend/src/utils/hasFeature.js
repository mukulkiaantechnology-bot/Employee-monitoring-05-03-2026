import { useBillingStore } from '../store/billingStore';

/**
 * Feature gating utility.
 * Returns true if the current plan/add-ons grant access to the given feature.
 *
 * Usage:
 *   const can = hasFeature('auditLogs');
 *
 * Feature keys:
 *   'apiTokens'         – Enterprise plan (or processImprovement+)
 *   'auditLogs'         – Enterprise plan
 *   'securityAlerts'    – securityBundle add-on
 *   'screenshotFreq'    – screenshotFrequency add-on
 *   'onDemandScreenshots' – onDemandScreenshots add-on
 */
export function hasFeature(featureName) {
    const { currentPlan, subscriptionStatus, addOns } = useBillingStore.getState();

    // During trial, all features are accessible
    if (subscriptionStatus === 'trial') return true;

    // No active plan
    if (!currentPlan || subscriptionStatus !== 'active') return false;

    const planOrder = ['productivity', 'timeTracking', 'processImprovement', 'enterprise'];
    const currentPlanIndex = planOrder.indexOf(currentPlan);

    const atLeastPlan = (minPlan) => currentPlanIndex >= planOrder.indexOf(minPlan);

    switch (featureName) {
        case 'auditLogs':
            return atLeastPlan('enterprise');
        case 'apiTokens':
            return atLeastPlan('processImprovement');
        case 'securityAlerts':
            return addOns.securityBundle === true;
        case 'screenshotFreq':
            return addOns.screenshotFrequency === true;
        case 'onDemandScreenshots':
            return addOns.onDemandScreenshots === true;
        default:
            return true;
    }
}

/**
 * React hook version — re-renders on store changes.
 */
export function useHasFeature(featureName) {
    const { currentPlan, subscriptionStatus, addOns } = useBillingStore();

    if (subscriptionStatus === 'trial') return true;
    if (!currentPlan || subscriptionStatus !== 'active') return false;

    const planOrder = ['productivity', 'timeTracking', 'processImprovement', 'enterprise'];
    const currentPlanIndex = planOrder.indexOf(currentPlan);
    const atLeastPlan = (minPlan) => currentPlanIndex >= planOrder.indexOf(minPlan);

    switch (featureName) {
        case 'auditLogs':
            return atLeastPlan('enterprise');
        case 'apiTokens':
            return atLeastPlan('processImprovement');
        case 'securityAlerts':
            return addOns.securityBundle === true;
        case 'screenshotFreq':
            return addOns.screenshotFrequency === true;
        case 'onDemandScreenshots':
            return addOns.onDemandScreenshots === true;
        default:
            return true;
    }
}
