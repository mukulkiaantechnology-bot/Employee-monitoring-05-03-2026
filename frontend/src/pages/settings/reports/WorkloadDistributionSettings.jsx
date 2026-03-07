import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Save,
    RotateCcw,
    Info,
    CheckCircle2,
    LayoutDashboard,
    Building,
    PieChart
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReportsStore } from '../../../store/reportsStore';
import { useAuthStore } from '../../../store/authStore';
import { cn } from '../../../utils/cn';

export function WorkloadDistributionSettings() {
    const navigate = useNavigate();
    const { role } = useAuthStore();
    const { reportsSettings, updateWorkloadSettings, resetWorkloadSettings } = useReportsStore();

    const rolePath = role ? `/${role.toLowerCase()}` : '';

    const [fromVal, setFromVal] = useState(reportsSettings.workloadDistribution.optimalFrom);
    const [toVal, setToVal] = useState(reportsSettings.workloadDistribution.optimalTo);
    const [showToast, setShowToast] = useState(false);

    // Sync local state with store when it changes (e.g., on reset)
    useEffect(() => {
        setFromVal(reportsSettings.workloadDistribution.optimalFrom);
        setToVal(reportsSettings.workloadDistribution.optimalTo);
    }, [reportsSettings.workloadDistribution.optimalFrom, reportsSettings.workloadDistribution.optimalTo]);

    const handleSave = () => {
        updateWorkloadSettings({
            optimalFrom: parseInt(fromVal),
            optimalTo: parseInt(toVal)
        });
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            navigate(`${rolePath}/reports/workload-distribution`);
        }, 2000);
    };

    const handleReset = () => {
        resetWorkloadSettings();
    };

    const handleFromChange = (e) => {
        const val = Math.min(parseInt(e.target.value) || 0, toVal - 1);
        setFromVal(Math.max(0, val));
    };

    const handleToChange = (e) => {
        const val = Math.max(parseInt(e.target.value) || 0, fromVal + 1);
        setToVal(Math.min(100, val));
    };

    const tabs = [
        { id: 'location-insights', label: 'Location Insights', icon: Building, path: `${rolePath}/settings/reports/location-insights` },
        { id: 'workload-distribution', label: 'Workload Distribution', icon: PieChart, path: `${rolePath}/settings/reports/workload-distribution` }
    ];

    const currentTab = 'workload-distribution';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`${rolePath}/settings`)}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate(`${rolePath}/settings`)}>Settings</span>
                            <span>/</span>
                            <span className="text-primary-600">Reports</span>
                        </nav>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Configuration</h1>
                    </div>
                </div>
            </div>

            {/* Enterprise Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                            currentTab === tab.id
                                ? "bg-white dark:bg-slate-800 text-primary-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />

                <div className="p-8 md:p-12 relative z-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-inner">
                                <LayoutDashboard size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Optimal Range</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Define employee productivity thresholds</p>
                            </div>
                        </div>
                        <div className="group relative">
                            <Info size={20} className="text-slate-300 hover:text-primary-500 transition-colors cursor-help" />
                            <div className="absolute right-0 bottom-full mb-3 w-64 p-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest leading-relaxed rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl border border-slate-800 z-50">
                                Employees within this range follow an "Optimal" workload. Below is "Underloaded", above is "Overloaded".
                            </div>
                        </div>
                    </div>

                    {/* Dual Slider Logic (Simulation with dual range inputs) */}
                    <div className="mb-12">
                        <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-8">
                            {/* Active range indicator */}
                            <div
                                className="absolute h-full bg-primary-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                                style={{
                                    left: `${fromVal}%`,
                                    right: `${100 - toVal}%`
                                }}
                            />

                            {/* Range Inputs Wrapper */}
                            <div className="absolute inset-0 pointer-events-none">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={fromVal}
                                    onChange={handleFromChange}
                                    className="absolute inset-0 w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer custom-range-thumb z-20"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={toVal}
                                    onChange={handleToChange}
                                    className="absolute inset-0 w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer custom-range-thumb z-20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">From %</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        min="0"
                                        max={toVal - 1}
                                        value={fromVal}
                                        onChange={handleFromChange}
                                        className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-black text-xl text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">To %</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        min={fromVal + 1}
                                        max="100"
                                        value={toVal}
                                        onChange={handleToChange}
                                        className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-black text-xl text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-primary-700 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full sm:w-auto px-8 h-14 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            <RotateCcw size={18} />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Learn More Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Reporting v2.4</p>
                    <button className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest transition-colors">Learn about capacity planning →</button>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-emerald-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest">
                        <CheckCircle2 size={20} />
                        Settings Updated Successfully
                    </div>
                </div>
            )}

            {/* Injected Styles for Slider */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-range-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 4px solid #3b82f6;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(59,130,246,0.3);
                    transition: all 0.2s;
                }
                .custom-range-thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 15px rgba(59,130,246,0.4);
                }
            `}} />
        </div>
    );
}
