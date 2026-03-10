import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useIntegrationStore, INTEGRATION_META } from '../../../store/integrationStore';
import { IntegrationCardFull } from '../../../components/integrations/IntegrationCard';
import { IntegrationConfigModal } from '../../../components/modals/IntegrationConfigModal';
import { DisconnectConfirmModal } from '../../../components/modals/DisconnectConfirmModal';
import { cn } from '../../../utils/cn';

// Mini toast
function Toast({ show, message, type = 'success' }) {
    if (!show) return null;
    return (
        <div className={cn(
            'fixed bottom-8 right-8 z-[300] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-3',
            type === 'success' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-rose-600 text-white'
        )}>
            <span className={type === 'success' ? 'text-emerald-400 dark:text-emerald-600' : ''}>{type === 'success' ? '✓' : '!'}</span>
            {message}
        </div>
    );
}

/**
 * Shared tab page component used by all 4 integration tabs.
 *
 * Props:
 *   keys          – array of integrationIds for this tab
 *   searchQuery   – from parent IntegrationsLayout
 *   disabled      – feature-gated
 */
export function IntegrationTabPage({ integrationKeys, searchQuery, disabled = false }) {
    const { integrations, connectIntegration, disconnectIntegration } = useIntegrationStore();
    const [configuringId, setConfiguringId] = useState(null);
    const [disconnectingId, setDisconnectingId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const filtered = integrationKeys.filter((id) => {
        const meta = INTEGRATION_META[id];
        return meta?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const regular = filtered.filter((id) => !INTEGRATION_META[id]?.beta);
    const beta = filtered.filter((id) => INTEGRATION_META[id]?.beta);

    return (
        <>
            {/* Main integrations */}
            {regular.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                        <Sparkles size={16} className="text-slate-400" />
                        <h2 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Integrations</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {regular.map((id) => (
                            <IntegrationCardFull
                                key={id}
                                integrationId={id}
                                connected={integrations[id]?.connected ?? false}
                                onConfigure={setConfiguringId}
                                onDisconnect={setDisconnectingId}
                                disabled={disabled}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Beta section */}
            {beta.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <Sparkles size={16} className="text-amber-400" />
                        <h2 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Beta</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {beta.map((id) => (
                            <IntegrationCardFull
                                key={id}
                                integrationId={id}
                                connected={integrations[id]?.connected ?? false}
                                onConfigure={setConfiguringId}
                                onDisconnect={setDisconnectingId}
                                disabled={disabled}
                            />
                        ))}
                    </div>
                </div>
            )}

            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24">
                    <p className="text-slate-400 font-bold">No integrations match your search.</p>
                </div>
            )}

            {disabled && (
                <div className="mt-6 px-5 py-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 text-center">
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-400">
                        This feature requires an <strong>Enterprise</strong> plan. Upgrade to unlock Data Warehouse integrations.
                    </p>
                </div>
            )}

            {/* Config Modal */}
            <IntegrationConfigModal
                isOpen={!!configuringId}
                integrationId={configuringId}
                existingConfig={configuringId ? integrations[configuringId]?.config : {}}
                onClose={() => setConfiguringId(null)}
                onSave={async (id, config) => {
                    try {
                        await connectIntegration(id, config);
                        showToast(`${INTEGRATION_META[id]?.name} connected successfully!`);
                    } catch (err) {
                        showToast(`Failed to connect ${INTEGRATION_META[id]?.name}`, 'error');
                    }
                }}
            />

            {/* Disconnect Modal */}
            <DisconnectConfirmModal
                isOpen={!!disconnectingId}
                integrationId={disconnectingId}
                onClose={() => setDisconnectingId(null)}
                onConfirm={async (id) => {
                    try {
                        await disconnectIntegration(id);
                        showToast(`${INTEGRATION_META[id]?.name} disconnected.`, 'error');
                    } catch (err) {
                        showToast(`Failed to disconnect ${INTEGRATION_META[id]?.name}`, 'error');
                    }
                }}
            />

            <Toast show={toast.show} message={toast.message} type={toast.type} />
        </>
    );
}
