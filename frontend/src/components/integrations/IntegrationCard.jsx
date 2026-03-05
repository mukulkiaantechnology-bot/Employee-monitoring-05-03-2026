import React from 'react';
import { CheckCircle2, Settings2, Minus } from 'lucide-react';
import { INTEGRATION_META } from '../../store/integrationStore';
import { cn } from '../../utils/cn';

export function IntegrationCard({ integrationId, onConfigure, onDisconnect }) {
    const meta = INTEGRATION_META[integrationId];
    if (!meta) return null;

    // isConnected comes via prop for purity
    return null; // see below
}

// ── Full stateful card (receives connected flag via props) ────────────────
export function IntegrationCardFull({ integrationId, connected, onConfigure, onDisconnect, disabled = false }) {
    const meta = INTEGRATION_META[integrationId];
    if (!meta) return null;

    return (
        <div
            className={cn(
                'relative flex flex-col rounded-2xl border-2 bg-white dark:bg-slate-900 p-6 transition-all duration-300 group',
                connected
                    ? 'border-emerald-300 dark:border-emerald-700 shadow-md shadow-emerald-50 dark:shadow-none'
                    : disabled
                    ? 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                    : 'border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800/50 hover:shadow-lg hover:-translate-y-0.5'
            )}
        >
            {/* Beta badge */}
            {meta.beta && (
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 dark:border-amber-700">
                    BETA
                </span>
            )}

            {/* Connected badge */}
            {connected && (
                <span className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200 dark:border-emerald-700">
                    <CheckCircle2 size={11} />
                    Connected
                </span>
            )}

            {/* Logo + Name */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0"
                    style={{ backgroundColor: meta.logoColor + '22', color: meta.logoColor, border: `1.5px solid ${meta.logoColor}33` }}
                >
                    <span className="text-base leading-none">{meta.logo}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{meta.name}</h3>
            </div>

            {/* Description */}
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                {meta.description}
            </p>

            {/* Action */}
            {connected ? (
                <div className="flex gap-2">
                    <button
                        onClick={() => !disabled && onConfigure?.(integrationId)}
                        disabled={disabled}
                        className="flex-1 py-2.5 rounded-xl border-2 border-violet-200 dark:border-violet-800 text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
                    >
                        <Settings2 size={13} /> Edit
                    </button>
                    <button
                        onClick={() => !disabled && onDisconnect?.(integrationId)}
                        disabled={disabled}
                        className="flex-1 py-2.5 rounded-xl border-2 border-rose-200 dark:border-rose-800/40 text-xs font-black text-rose-500 dark:text-rose-400 uppercase tracking-wider hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
                    >
                        <Minus size={13} /> Disconnect
                    </button>
                </div>
            ) : meta.requestAccess ? (
                <button
                    disabled={disabled}
                    className="w-full py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Request Access
                </button>
            ) : (
                <button
                    onClick={() => !disabled && onConfigure?.(integrationId)}
                    disabled={disabled}
                    className="w-full py-2.5 rounded-xl border-2 border-violet-300 dark:border-violet-700 text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-400 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Configure
                </button>
            )}
        </div>
    );
}
