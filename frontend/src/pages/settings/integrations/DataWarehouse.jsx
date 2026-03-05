import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { IntegrationTabPage } from './IntegrationTabPage';
import { useHasFeature } from '../../../utils/hasFeature';

export function DataWarehouse() {
    const { searchQuery } = useOutletContext();
    const KEYS = ['bigQuery', 'snowflake'];
    const hasAccess = useHasFeature('dataWarehouse');
    return (
        <>
            {!hasAccess && (
                <div className="flex items-center gap-3 mb-6 px-5 py-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                    <Lock size={16} className="text-amber-500 shrink-0" />
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-400">
                        Data Warehouse integrations require an <strong>Enterprise</strong> plan. Cards are shown for preview only.
                    </p>
                </div>
            )}
            <IntegrationTabPage integrationKeys={KEYS} searchQuery={searchQuery} disabled={!hasAccess} />
        </>
    );
}
