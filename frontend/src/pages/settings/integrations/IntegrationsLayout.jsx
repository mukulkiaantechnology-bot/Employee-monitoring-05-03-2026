import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ChevronLeft, Search, Puzzle } from 'lucide-react';
import { INTEGRATION_TABS } from '../../../store/integrationStore';
import { cn } from '../../../utils/cn';

const TAB_SUBTITLES = {
    'org-chart': 'Synchronize your organizational hierarchy by integrating your app with Insightful.',
    'data-warehouse': "Import Insightful's data into your data warehouse solution",
    'project-management': 'Integrate your project management applications with Insightful',
    'calendar': "Use calendar integration as an additional data source for better visibility into employee's work activities.",
};

export function IntegrationsLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const activeTab = INTEGRATION_TABS.find((t) => location.pathname.includes(t.id));
    const activeTabId = activeTab?.id ?? 'org-chart';
    const subtitle = TAB_SUBTITLES[activeTabId] ?? '';

    return (
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 pt-8 pb-6">
                <button
                    onClick={() => navigate('/settings')}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        <span
                            className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
                            onClick={() => navigate('/settings')}
                        >
                            Settings
                        </span>
                        <span>/</span>
                        <span className="text-violet-600">Integrations</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                            <Puzzle size={18} />
                        </div> */}
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Integrations
                        </h1>
                    </div>
                </div>
            </div>

            {/* Tabs + Search */}
            <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 mb-8 gap-4">
                <div className="flex items-center gap-1 overflow-x-auto">
                    {INTEGRATION_TABS.map((tab) => (
                        <NavLink
                            key={tab.id}
                            to={tab.route}
                            className={({ isActive }) =>
                                cn(
                                    'relative px-4 py-4 text-sm font-bold whitespace-nowrap transition-all',
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

                {/* Search */}
                <div className="relative shrink-0 pb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Subtitle */}
            {subtitle && (
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-8">{subtitle}</p>
            )}

            {/* Tab content via Outlet — searchQuery passed via context */}
            <Outlet context={{ searchQuery }} />
        </div>
    );
}
