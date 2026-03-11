import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrackingStore } from '../../store/trackingStore';
import { useAuthStore } from '../../store/authStore';
import { AdvancedForm } from '../../components/tracking/AdvancedForm';

function Toast({ show, message }) {
    if (!show) return null;
    return (
        <div className="fixed bottom-8 right-8 z-[300] px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-3">
            <span className="text-emerald-400 dark:text-emerald-600">✓</span>Advanced settings saved!
        </div>
    );
}

export function AdvancedTrackingSettings() {
    const navigate = useNavigate();
    const { advancedSettings, fetchTrackingData, updateAdvancedSettings, isLoading } = useTrackingStore();
    const { role } = useAuthStore();
    const [localSettings, setLocalSettings] = useState(null);
    const [toast, setToast] = useState(false);

    const rolePath = role?.toLowerCase() === 'admin' ? '/admin' : '/manager';

    React.useEffect(() => {
        fetchTrackingData();
    }, [fetchTrackingData]);

    React.useEffect(() => {
        if (advancedSettings && !localSettings) {
            setLocalSettings({ ...advancedSettings });
        }
    }, [advancedSettings, localSettings]);

    const isDirty = localSettings && JSON.stringify(localSettings) !== JSON.stringify(advancedSettings);

    const handleChange = (updates) => {
        setLocalSettings((s) => ({ ...s, ...updates }));
    };

    const handleSave = async () => {
        if (!localSettings) return;
        try {
            await updateAdvancedSettings(localSettings);
            setToast(true);
            setTimeout(() => setToast(false), 3000);
        } catch (error) {
            // Handle error
        }
    };

    const handleCancel = () => {
        navigate(`${rolePath}/settings/tracking`);
    };

    return (
        <>
            {/* Overlay panel */}
            <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm" onClick={handleCancel} />
            <div className="fixed right-0 top-0 bottom-0 z-[110] w-full max-w-2xl bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <nav className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                            <span className="text-violet-600 cursor-pointer hover:underline" onClick={handleCancel}>Tracking Settings</span>
                            {' › '} Advanced Settings
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleCancel} className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                        <button onClick={handleSave} disabled={!isDirty} className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none">Save</button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {localSettings ? (
                        <AdvancedForm settings={localSettings} onChange={handleChange} />
                    ) : (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                        </div>
                    )}
                </div>
            </div>

            <Toast show={toast} />
        </>
    );
}
