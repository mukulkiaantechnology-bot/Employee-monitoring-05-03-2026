import React, { useState } from 'react';
import {
    ChevronLeft,
    Bell,
    ShieldCheck,
    CalendarRange,
    MoreHorizontal,
    Plus,
    Search
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { NewAlertModal } from '../../../components/modals/NewAlertModal';
import { cn } from '../../../utils/cn';

export function AlertsLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tabs = [
        { id: 'attendance', label: 'Attendance', path: '/settings/alerts/attendance', icon: Bell },
        { id: 'security', label: 'Security', path: '/settings/alerts/security', icon: ShieldCheck },
        { id: 'shift-scheduling', label: 'Shift Scheduling', path: '/settings/alerts/shift-scheduling', icon: CalendarRange },
        { id: 'other', label: 'Other', path: '/settings/alerts/other', icon: MoreHorizontal },
    ];

    const currentTab = tabs.find(tab => location.pathname === tab.path) || tabs[0];
    const alertType = location.pathname.includes('security') ? 'security' : 'attendance';

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate('/settings')}>Settings</span>
                            <span>/</span>
                            <span className="text-primary-600">Alerts</span>
                        </nav>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Alerts</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-full md:w-64 order-2 md:order-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    {(location.pathname.includes('attendance') || location.pathname.includes('security')) && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-primary-700 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                        >
                            <Plus size={16} />
                            New Alert
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className={cn(
                            "pb-4 px-1 text-xs font-black uppercase tracking-widest transition-all relative",
                            location.pathname === tab.path
                                ? "text-primary-600"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <tab.icon size={16} />
                            {tab.label}
                        </div>
                        {location.pathname === tab.path && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full animate-in zoom-in-x-50 duration-300" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="mt-8">
                <Outlet />
            </div>

            <NewAlertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={alertType}
            />
        </div>
    );
}
