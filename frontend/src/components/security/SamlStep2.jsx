import React from 'react';
import { CopyField } from '../ui/CopyField';

const SP_URLS = {
    spEntityId: 'https://yourapp.com/saml/entity-id',
    acsUrl: 'https://yourapp.com/saml/acs',
    metadataUrl: 'https://yourapp.com/saml/metadata.xml',
};

export function SamlStep2() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Copy Certificate</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Copy the values below and configure them in your Identity Provider.
                </p>
            </div>

            <div className="space-y-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <CopyField label="SP Entity ID" value={SP_URLS.spEntityId} />
                <CopyField label="ACS URL" value={SP_URLS.acsUrl} />
                <CopyField label="Metadata URL" value={SP_URLS.metadataUrl} />
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 leading-relaxed">
                    💡 Add these URLs to your SAML Identity Provider's Trusted URLs list. Both SP Entity ID and ACS URL are required for the SSO flow to work correctly.
                </p>
            </div>
        </div>
    );
}
