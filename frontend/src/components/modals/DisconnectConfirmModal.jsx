import React from 'react';
import { X, Unplug } from 'lucide-react';
import { INTEGRATION_META } from '../../store/integrationStore';

export function DisconnectConfirmModal({ isOpen, integrationId, onClose, onConfirm }) {
    if (!isOpen || !integrationId) return null;
    const meta = INTEGRATION_META[integrationId];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div
                className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <Unplug size={22} />
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                        Disconnect {meta?.name}?
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
                        Disconnecting will stop syncing data from {meta?.name}. You can reconnect at any time.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onConfirm(integrationId); onClose(); }}
                            className="flex-1 py-3.5 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Disconnect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
