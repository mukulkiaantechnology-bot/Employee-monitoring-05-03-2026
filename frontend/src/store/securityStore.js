import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_SAML = {
    name: '',
    issuerId: '',
    loginUrl: '',
    certificate: '',
    step: 1,
    verified: false,
    enforceSso: false,
};

export const useSecurityStore = create(
    persist(
        (set, get) => ({
            saml: { ...INITIAL_SAML },
            originalSaml: {},

            updateField: (field, value) =>
                set((s) => ({ saml: { ...s.saml, [field]: value } })),

            nextStep: () =>
                set((s) => ({ saml: { ...s.saml, step: Math.min(s.saml.step + 1, 3) } })),

            previousStep: () =>
                set((s) => ({ saml: { ...s.saml, step: Math.max(s.saml.step - 1, 1) } })),

            saveSaml: () =>
                set((s) => ({
                    originalSaml: { ...s.saml, step: 1 },
                    saml: { ...s.saml, step: 1 },
                })),

            verifySaml: () => {
                const { saml } = get();
                if (saml.name && saml.issuerId && saml.loginUrl && saml.certificate) {
                    set((s) => ({ saml: { ...s.saml, verified: true } }));
                    return { success: true };
                }
                return { success: false, error: 'Required fields are missing.' };
            },

            toggleEnforceSso: () =>
                set((s) => ({ saml: { ...s.saml, enforceSso: !s.saml.enforceSso } })),

            resetWizard: () =>
                set((s) => ({ saml: { ...INITIAL_SAML } })),

            hasChanges: () => {
                const { saml, originalSaml } = get();
                if (!originalSaml.name) return false;
                const { step: _s, ...curRest } = saml;
                const { step: _o, ...orgRest } = originalSaml;
                return JSON.stringify(curRest) !== JSON.stringify(orgRest);
            },

            isConfigured: () => {
                const { originalSaml } = get();
                return !!originalSaml.name;
            },
        }),
        { name: 'security-storage' }
    )
);
