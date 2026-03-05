import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Link, Key, RefreshCw, TestTube } from 'lucide-react';
import { INTEGRATION_META } from '../../store/integrationStore';
import { cn } from '../../utils/cn';

const SYNC_OPTIONS = ['Every hour', 'Every 6 hours', 'Every 12 hours', 'Daily'];
const EMPTY_HR = { apiKey: '', syncFrequency: 'Daily', importExisting: true };
const EMPTY_PROJECT = { oauthDone: false, projects: '' };
const EMPTY_WAREHOUSE = { connectionString: '', tested: false };
const EMPTY_CALENDAR = { accountConnected: false };

function getDefaultConfig(configType) {
    switch (configType) {
        case 'hr': return { ...EMPTY_HR };
        case 'oauth': return { ...EMPTY_HR }; // google workspace uses oauth + sync options
        case 'project': return { ...EMPTY_PROJECT };
        case 'warehouse': return { ...EMPTY_WAREHOUSE };
        case 'calendar': return { ...EMPTY_CALENDAR };
        default: return {};
    }
}

export function IntegrationConfigModal({ isOpen, integrationId, existingConfig, onClose, onSave }) {
    const meta = INTEGRATION_META[integrationId];
    const [config, setConfig] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [testOk, setTestOk] = useState(false);

    useEffect(() => {
        if (!meta) return;
        setConfig(existingConfig && Object.keys(existingConfig).length > 0
            ? { ...existingConfig }
            : getDefaultConfig(meta.configType));
        setErrors({});
        setTestOk(false);
    }, [integrationId, isOpen]);

    if (!isOpen || !meta) return null;

    const update = (key, value) => {
        setConfig((c) => ({ ...c, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const validate = () => {
        const errs = {};
        if (meta.configType === 'hr' || meta.configType === 'oauth') {
            if (!config.apiKey?.trim()) errs.apiKey = 'API Key is required.';
        }
        if (meta.configType === 'warehouse') {
            if (!config.connectionString?.trim()) errs.connectionString = 'Connection string is required.';
        }
        return errs;
    };

    const handleSave = () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onSave(integrationId, config);
            onClose();
        }, 1000);
    };

    const handleTestConnection = () => {
        setTestLoading(true);
        setTimeout(() => {
            setTestLoading(false);
            setTestOk(true);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-7 pb-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-black shadow-sm"
                            style={{ backgroundColor: meta.logoColor + '22', color: meta.logoColor }}>
                            {meta.logo}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Configure</p>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">{meta.name}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-8 py-6 space-y-5 flex-1">
                    {/* HR / OAuth */}
                    {(meta.configType === 'hr' || meta.configType === 'oauth') && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                    <Key size={13} /> API Key
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your API key"
                                    value={config.apiKey || ''}
                                    onChange={(e) => update('apiKey', e.target.value)}
                                    className={cn(
                                        'w-full h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
                                        errors.apiKey ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                                    )}
                                />
                                {errors.apiKey && <p className="text-xs font-bold text-rose-500">{errors.apiKey}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                    <RefreshCw size={13} /> Sync Frequency
                                </label>
                                <select
                                    value={config.syncFrequency || 'Daily'}
                                    onChange={(e) => update('syncFrequency', e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all appearance-none"
                                >
                                    {SYNC_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className={cn('h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0',
                                    config.importExisting ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600')}
                                    onClick={() => update('importExisting', !config.importExisting)}>
                                    {config.importExisting && <Check size={12} color="white" strokeWidth={3} />}
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Import existing employees</span>
                            </label>
                        </>
                    )}

                    {/* Project Management */}
                    {meta.configType === 'project' && (
                        <>
                            <div className="p-5 rounded-2xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30 text-center">
                                <Link size={20} className="mx-auto text-violet-500 mb-3" />
                                <p className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-4">
                                    Connect your {meta.name} account via OAuth
                                </p>
                                <button
                                    onClick={() => update('oauthDone', true)}
                                    className={cn(
                                        'px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                                        config.oauthDone
                                            ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-700 cursor-default'
                                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-95'
                                    )}
                                >
                                    {config.oauthDone ? '✓ Connected' : `Connect ${meta.name}`}
                                </button>
                            </div>
                            {config.oauthDone && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Select Projects</label>
                                    <input
                                        type="text"
                                        placeholder="All projects (type to filter)"
                                        value={config.projects || ''}
                                        onChange={(e) => update('projects', e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Data Warehouse */}
                    {meta.configType === 'warehouse' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Connection String</label>
                                <textarea
                                    rows={3}
                                    placeholder="jdbc:bigquery://... or similar"
                                    value={config.connectionString || ''}
                                    onChange={(e) => update('connectionString', e.target.value)}
                                    className={cn(
                                        'w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-mono font-medium text-slate-900 dark:text-white outline-none transition-all resize-none',
                                        errors.connectionString ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                                    )}
                                />
                                {errors.connectionString && <p className="text-xs font-bold text-rose-500">{errors.connectionString}</p>}
                            </div>
                            <button
                                onClick={handleTestConnection}
                                disabled={testLoading || !config.connectionString}
                                className={cn(
                                    'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                                    testOk
                                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
                                        : 'border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed'
                                )}
                            >
                                {testLoading ? <Loader2 size={13} className="animate-spin" /> : testOk ? <Check size={13} /> : <TestTube size={13} />}
                                {testOk ? 'Connection OK' : 'Test Connection'}
                            </button>
                        </>
                    )}

                    {/* Calendar */}
                    {meta.configType === 'calendar' && (
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                            <div className="h-14 w-14 mx-auto rounded-2xl flex items-center justify-center text-xl font-black mb-4"
                                style={{ backgroundColor: meta.logoColor + '22', color: meta.logoColor }}>
                                {meta.logo}
                            </div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-5">
                                Connect your {meta.name} account to import meetings
                            </p>
                            <button
                                onClick={() => update('accountConnected', true)}
                                className={cn(
                                    'px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                                    config.accountConnected
                                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200 cursor-default dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
                                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-200 dark:shadow-none'
                                )}
                            >
                                {config.accountConnected ? '✓ Account Connected' : 'Connect Account'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                    >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : 'Save & Connect'}
                    </button>
                </div>
            </div>
        </div>
    );
}
