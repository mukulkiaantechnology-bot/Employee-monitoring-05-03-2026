import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { usePrivacyStore } from '../../store/privacyStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

const TABS = [
    { id: 'overview', label: 'Overview', route: 'overview' },
    { id: 'compliance', label: 'Compliance', route: 'compliance' },
];


export function Privacy() {
    const navigate = useNavigate();
    const location = useLocation();
    const { privacy, fetchPrivacySettings, savePrivacySettings, resetChanges, hasChanges, loading } = usePrivacyStore();
    const { role } = useAuthStore();
    const [errors, setErrors] = useState({});

    const rolePath = role?.toLowerCase() === 'admin' ? '/admin' : '/manager';

    React.useEffect(() => {
        fetchPrivacySettings();
    }, [fetchPrivacySettings]);

    const isDirty = hasChanges();
    const isComplianceTab = location.pathname.includes('compliance');


    const validate = () => {
        const errs = {};
        if (isComplianceTab && privacy.collectPHI === null) {
            errs.collectPHI = 'Please select whether you collect PHI data.';
        }
        return errs;
    };

    const handleSave = async () => {
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        try {
            await savePrivacySettings();
            setErrors({});
        } catch (err) {
            // Error is handled by apiClient global toast
        }
    };

    return (
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 pt-8 pb-4">
                <button
                    onClick={() => navigate(`${rolePath}/settings`)}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors" onClick={() => navigate(`${rolePath}/settings`)}>
                            Settings
                        </span>
                        <span>/</span>
                        <span className="text-violet-600">Privacy</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                            <ShieldCheck size={18} />
                        </div> */}
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Privacy</h1>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 mb-10">
                {TABS.map((tab) => (
                    <NavLink
                        key={tab.id}
                        to={tab.route}
                        className={({ isActive }) =>
                            cn(
                                'relative px-5 py-4 text-sm font-bold whitespace-nowrap transition-all',
                                isActive
                                    ? 'text-violet-600 dark:text-violet-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {tab.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full animate-in fade-in duration-200" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Tab content */}
            <Outlet context={{ errors }} />

            {/* Sticky Save Bar */}
            <div className={cn(
                'fixed bottom-0 left-0 right-0 z-40 flex items-center justify-end gap-3 px-8 py-4 border-t border-slate-200 dark:border-slate-800 transition-all duration-300',
                'bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm',
                isDirty ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            )}>
                <button
                    onClick={resetChanges}
                    className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                    Discard
                </button>
                <button
                    onClick={handleSave}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Save Changes
                </button>
            </div>

        </div>
    );
}
