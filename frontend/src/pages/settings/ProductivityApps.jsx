import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings2, Search, Plus, Zap, Lightbulb, X, Loader2 } from 'lucide-react';
import { useProductivityStore } from '../../store/productivityStore';
import { AppsTable } from '../../components/productivity/AppsTable';
import { TagsDrawer } from '../../components/productivity/TagsDrawer';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

const ORGS = ['Organization', 'Team A', 'Team B'];
const VIEW_OPTIONS = ['All apps & websites', 'Productive only', 'Unproductive only', 'Unassigned'];

// ── Mini Toast ────────────────────────────────────────────────────────────────
function Toast({ show, message, type = 'success' }) {
    if (!show) return null;
    return (
        <div className={cn(
            "fixed bottom-8 right-8 z-[300] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-3",
            type === 'success' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-rose-600 text-white"
        )}>
            <span className={type === 'success' ? "text-emerald-400 dark:text-emerald-600" : "text-white"}>
                {type === 'success' ? '✓' : '✕'}
            </span>
            {message}
        </div>
    );
}

// ── Recommendations Modal ─────────────────────────────────────────────────────
function RecommendationsModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500"><Lightbulb size={20} /></div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Recommendations</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"><X size={18} /></button>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-5">Recommended productivity adjustments based on your team's usage patterns:</p>
                <div className="space-y-3">
                    {[
                        { app: 'YouTube', rec: 'Mark as Distraction — high usage detected across team.', color: '#FF4D4F' },
                        { app: 'GitHub', rec: 'Mark as Focus — core development tool.', color: '#9254DE' },
                        { app: 'Reddit', rec: 'Consider blocking during work hours.', color: '#FF6B6B' },
                        { app: 'Spotify', rec: 'Tag as Neutral — background listening tool.', color: '#69C0FF' },
                    ].map((r, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-black px-2 py-1 rounded-lg text-white shrink-0" style={{ backgroundColor: r.color }}>{r.app}</span>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{r.rec}</p>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="mt-7 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none">
                    Got it
                </button>
            </div>
        </div>
    );
}

// ── Tag Change Popover ────────────────────────────────────────────────────────
function TagChangePopover({ app, tags, onSelect, onClose }) {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 w-64 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Assign Label to <strong className="text-slate-700 dark:text-slate-200">{app?.appName || app?.name}</strong></p>
                <div className="space-y-1.5">
                    <button onClick={() => { onSelect(app.id || app.appName, null); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-500 dark:text-slate-400 transition-all">
                        <span className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" /> Unassigned
                    </button>
                    {tags.map((t) => (
                        <button key={t.id} onClick={() => { onSelect(app.id || app.appName, t.id); onClose(); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-all"
                            style={{ color: t.color }}
                        >
                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                            {t.name}
                            {app?.tagId === t.id && <span className="ml-auto text-violet-500 text-xs">✓</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function ProductivityApps() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const rolePath = user?.role === 'ADMIN' ? '/admin' : '/manager';

    const {
        apps, filters, tags, loading, error,
        fetchProductivityData, updateFilter, toggleThreshold, toggleSelectApp, toggleSelectAll, setAppTag, autoLabel,
    } = useProductivityStore();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [recommendOpen, setRecommendOpen] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState('apps');
    const [tagChangeFor, setTagChangeFor] = useState(null); // id or appName
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchProductivityData();
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleAutoLabel = async () => {
        await autoLabel();
        showToast('Auto-labeling applied based on app keywords!');
    };

    // ── FILTER LOGIC ────────────────────────────────────────────────────────
    const filteredApps = useMemo(() => {
        let result = [...apps];
        // Search
        if (filters.search.trim()) {
            result = result.filter((a) => (a.appName || a.name || '').toLowerCase().includes(filters.search.toLowerCase()));
        }
        // View
        if (filters.view === 'Productive only') result = result.filter((a) => a.tagId !== null);
        if (filters.view === 'Unproductive only') result = result.filter((a) => {
            const tag = tags.find((t) => t.id === a.tagId);
            return tag?.name === 'Distraction';
        });
        if (filters.view === 'Unassigned') result = result.filter((a) => a.tagId === null);
        return result;
    }, [apps, filters, tags]);

    const tagChangeApp = tagChangeFor ? apps.find((a) => (a.id || a.appName) === tagChangeFor) : null;

    if (loading && apps.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between pt-8 pb-5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(`${rolePath}/settings`)} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span className="hover:text-slate-600 cursor-pointer transition-colors dark:hover:text-slate-300" onClick={() => navigate(`${rolePath}/settings`)}>Settings</span>
                            <span>/</span>
                            <span className="text-violet-600">Productivity</span>
                        </nav>
                        <div className="flex items-center gap-3">
                            {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                                <SlidersHorizontal size={18} />
                            </div> */}
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Productivity</h1>
                            {filters.thresholdEnabled && (
                                <span className="px-2.5 py-1 rounded-xl bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest">Threshold Active</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top right ghost buttons */}
                <div className="flex items-center gap-2">
                    <button onClick={handleAutoLabel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 transition-all shadow-sm active:scale-95">
                        <Zap size={14} /> Auto-Labeling
                    </button>
                    <button onClick={() => setRecommendOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 transition-all shadow-sm active:scale-95">
                        <Lightbulb size={14} /> Recommendations
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 mb-6">
                {[
                    { id: 'apps', name: 'Apps & Websites' },
                    { id: 'labels', name: 'Productivity Labels' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={cn(
                            "relative py-4 text-sm font-bold transition-all",
                            activeSubTab === tab.id ? "text-violet-600 dark:text-violet-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                    >
                        {tab.name}
                        {activeSubTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full animate-in fade-in slide-in-from-left-2 duration-300" />
                        )}
                    </button>
                ))}
            </div>

            {/* Dynamic Content */}
            {activeSubTab === 'apps' ? (
                <>
                    {/* Controls row 1 */}
                    <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 underline cursor-pointer hover:opacity-80 transition-opacity">
                            Edit privacy settings on team level
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="flex items-center gap-2 h-9 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 transition-all whitespace-nowrap shadow-sm"
                            >
                                <Settings2 size={14} /> Tags Settings
                            </button>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search apps and websites"
                                    value={filters.search}
                                    onChange={(e) => updateFilter('search', e.target.value)}
                                    className="h-9 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Controls row 2 */}
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        {/* Organization dropdown */}
                        <div className="relative">
                            <select
                                value={filters.organization}
                                onChange={(e) => updateFilter('organization', e.target.value)}
                                className="h-9 pl-4 pr-8 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/10 text-xs font-black text-violet-700 dark:text-violet-400 outline-none appearance-none cursor-pointer transition-all hover:bg-violet-100/50"
                            >
                                {ORGS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>

                        {/* View dropdown */}
                        <div className="relative">
                            <select
                                value={filters.view}
                                onChange={(e) => updateFilter('view', e.target.value)}
                                className="h-9 pl-4 pr-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none appearance-none cursor-pointer transition-all hover:border-violet-300"
                            >
                                {VIEW_OPTIONS.map((o) => (
                                    <option key={o}>
                                        {o} ({o === 'All apps & websites' ? apps.length : filteredApps.length})
                                    </option>
                                ))}
                            </select>
                            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>

                        {/* Threshold toggle */}
                        <div className="flex items-center gap-2 px-3 h-9 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                            <ToggleSwitch
                                checked={filters.thresholdEnabled}
                                onChange={toggleThreshold}
                                size="sm"
                            />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Threshold</span>
                        </div>

                        {/* Threshold slider (visible when enabled) */}
                        {filters.thresholdEnabled && (
                            <div className="flex items-center gap-3 px-4 h-9 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/10 animate-in fade-in slide-in-from-left-2 duration-200">
                                <span className="text-[10px] font-black text-violet-700 dark:text-violet-400 whitespace-nowrap">{filters.thresholdHours}h</span>
                                <input
                                    type="range" min={0} max={8} step={0.5}
                                    value={filters.thresholdHours}
                                    onChange={(e) => updateFilter('thresholdHours', Number(e.target.value))}
                                    className="w-24 accent-violet-600"
                                />
                                <span className="text-[10px] font-black text-violet-700 dark:text-violet-400">8h</span>
                            </div>
                        )}

                        {/* Add Filter */}
                        <button className="flex items-center gap-2 h-9 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-xs font-black text-slate-500 dark:text-slate-400 hover:border-violet-400 hover:text-violet-600 transition-all">
                            <Plus size={13} strokeWidth={3} /> Add Filter
                        </button>
                    </div>

                    {/* Table card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                        {apps.length === 0 ? (
                            <div className="p-20 text-center">
                                <p className="text-slate-400 font-bold">No app usage data found for this period.</p>
                            </div>
                        ) : (
                            <AppsTable
                                apps={filteredApps}
                                tags={tags}
                                onSelectAll={toggleSelectAll}
                                onSelectApp={toggleSelectApp}
                                onChangeTag={(id) => setTagChangeFor(id)}
                                thresholdEnabled={filters.thresholdEnabled}
                                thresholdHours={filters.thresholdHours}
                            />
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="max-w-xl">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Productivity Labeling System</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                            Define how apps and websites are categorized across your organization. These labels directly affect the Productivity Score and efficiency metrics for all employees.
                        </p>

                        <div className="grid gap-4">
                            {[
                                { name: 'Productive', desc: 'Core business tools and work-related sites.', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
                                { name: 'Neutral', desc: 'Tools that are neither strictly work nor distraction.', color: 'text-slate-600 bg-slate-50 dark:bg-slate-800/50' },
                                { name: 'Unproductive', desc: 'Social media, entertainment, and non-work sites.', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' }
                            ].map(label => (
                                <div key={label.name} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800 transition-all group shadow-sm active:scale-[0.99]">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs", label.color)}>
                                            {label.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{label.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label.desc}</p>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit Config</button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 rounded-3xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/50">
                            <h5 className="text-xs font-black text-violet-900 dark:text-violet-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Zap size={14} /> Efficiency Impact
                            </h5>
                            <p className="text-xs font-medium text-violet-700 dark:text-violet-400 leading-relaxed">
                                Unproductive activities detected for more than 15 minutes trigger an "Inefficiency Alert" in the real-time stream.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tags Drawer */}
            <TagsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* Recommendations */}
            <RecommendationsModal isOpen={recommendOpen} onClose={() => setRecommendOpen(false)} />

            {/* Tag Change Popover */}
            {tagChangeFor && (
                <TagChangePopover
                    app={tagChangeApp}
                    tags={tags}
                    onSelect={setAppTag}
                    onClose={() => setTagChangeFor(null)}
                />
            )}

            <Toast show={toast.show} message={toast.message} type={toast.type} />
        </div>
    );
}
