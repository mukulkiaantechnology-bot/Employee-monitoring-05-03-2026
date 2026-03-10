import React, { useState, useEffect } from 'react';
import {
    Bell,
    Calendar,
    Search,
    Info,
    Plus,
    LayoutGrid,
    Download
} from 'lucide-react';
import { NewProjectModal } from '../components/NewProjectModal';
import { FilterDropdown } from '../components/FilterDropdown';
import { GlobalCalendar } from '../components/GlobalCalendar';
import { useRealTime } from '../hooks/RealTimeContext';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';

export function Projects() {
    const { employees, teams } = useRealTime();
    const { projects, fetchProjects, loading } = useProjectStore();
    const { role } = useAuthStore();
    const rolePath = role ? `/${role.toLowerCase()}` : '';
    const [activeTab, setActiveTab] = useState('Insightful');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectSearch, setProjectSearch] = useState('');
    const [isGridView, setIsGridView] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDownload = () => {
        const rows = [
            ['Project Name', 'Assignees', 'Tasks', 'Total time [h]', 'Clocked time [h]', 'Manual time [h]', 'Total Costs'],
            ...projects.map(p => [
                p.projectName, p.assignees, p.tasks, p.totalTime, p.clockedTime, p.manualTime, `$${p.totalCosts}`
            ])
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'projects.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const integrationCards = [
        { name: 'Trello', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111656.png', employees: 217, tickets: 231 },
        { name: 'Jira', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968875.png', employees: 153, tickets: 245 },
        { name: 'Asana', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968793.png', employees: 197, tickets: 233 }
    ];

    const tableHeaders = [
        'Project Name', 'Assignees', 'Tasks', 'Total time [h]',
        'Clocked time [h]', 'Manual time [h]', 'Bill Rate', 'Total Costs'
    ];

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8 transition-colors duration-200">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 md:py-8 mb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Projects</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {activeTab !== 'Integrated' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-xs font-black transition-all shadow-xl shadow-primary-200 dark:shadow-none uppercase tracking-wider hover:scale-[1.02] active:scale-95"
                        >
                            <Plus size={16} strokeWidth={3} />
                            <span>Add New Project</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="px-0 pt-2 overflow-x-auto no-scrollbar mb-8">
                <div className="flex items-center gap-8 border-b border-slate-100 dark:border-slate-800 min-w-max">
                    {['Insightful', 'Integrated'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[11px] uppercase tracking-[0.15em] font-black transition-all relative ${activeTab === tab ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 animate-in fade-in duration-300" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    <div className="shrink-0 flex items-center gap-3">
                        <GlobalCalendar />
                        <FilterDropdown />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
                    <div className="relative group flex-1 md:w-72">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects by name..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                    {activeTab !== 'Integrated' && (
                        <button
                            onClick={handleDownload}
                            title="Download CSV report"
                            className="h-11 w-11 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-primary-600 hover:border-primary-200 transition-all rounded-xl shadow-sm"
                        >
                            <Download size={18} strokeWidth={2.5} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {activeTab === 'Integrated' ? (
                <div className="space-y-12 py-8">
                    {/* Integration Cards */}
                    <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
                        {integrationCards.map((card, idx) => (
                            <div key={idx} className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 flex items-center shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="h-10 w-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg p-2 border border-slate-100 dark:border-slate-700 transition-transform group-hover:scale-110">
                                        <img src={card.icon} alt={card.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{card.name}</span>
                                </div>
                                <div className="flex items-center gap-12 text-slate-400 dark:text-slate-500 text-xs font-bold border-l border-slate-100 dark:border-slate-800 pl-12 h-8">
                                    <span><span className="text-slate-900 dark:text-slate-300">{card.employees}</span> Employees</span>
                                    <span><span className="text-slate-900 dark:text-slate-300">{card.tickets}</span> Tickets</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Start Integrating Call to Action */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Start integrating projects to Insightful</h2>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 max-w-sm">
                            Start by integrating with a project management tool. Afterward, you can view all the projects here.
                        </p>
                        <button
                            onClick={() => window.location.href = `${rolePath}/settings/integrations/overview/project-management`}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-xs font-black transition-all shadow-xl shadow-primary-100 dark:shadow-primary-900/20 uppercase tracking-widest mt-4"
                        >
                            Go To Project Management Integrations
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="space-y-6">
                        {/* Info Bar */}
                        {/* Info Bar */}
                        <div className="bg-[#eef8ff] dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/50 text-[#00609b] dark:text-primary-300 px-5 py-4 rounded-[1.25rem] flex items-start md:items-center gap-4 text-xs font-bold w-full shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <Info size={18} className="text-[#0092e0] dark:text-primary-400 shrink-0" />
                            <p className="leading-relaxed">
                                Choose task statuses visible to employees. <button className="underline font-black hover:text-primary-700 transition-colors">Learn More.</button>
                            </p>
                        </div>

                        {/* Table Layout (Hidden on Mobile) */}
                        <div className="hidden lg:block">
                            <div className="grid grid-cols-9 px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center border-b border-slate-100 dark:border-slate-800">
                                {tableHeaders.map((header, idx) => (
                                    <div key={idx} className={idx === 0 ? "text-left col-span-2" : idx === 1 ? "ml-12" : "col-span-1"}>{header}</div>
                                ))}
                            </div>
                        </div>

                        {/* Product Rows / Mobile Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-0 lg:space-y-3">
                            {(() => {
                                if (loading) return <div className="text-center py-20 font-bold text-slate-400 animate-pulse">Fetching project data...</div>;

                                const filtered = projects.filter(p => (p.projectName || p.name || '').toLowerCase().includes(projectSearch.toLowerCase()));
                                if (filtered.length === 0) {
                                    return (
                                        <div className="flex flex-col items-center justify-center py-20 text-center col-span-full">
                                            <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4">
                                                <Search size={32} className="text-slate-200 dark:text-slate-800" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-300 dark:text-slate-800 select-none">No Projects Found</h3>
                                            <p className="text-xs font-bold text-slate-400 mt-2">Try adjusting your search or filters</p>
                                        </div>
                                    );
                                }
                                return filtered.map((project, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] lg:rounded-2xl p-5 md:p-6 lg:p-4 hover:shadow-xl hover:border-primary-100 dark:hover:border-primary-900/30 transition-all group lg:grid lg:grid-cols-9 lg:items-center">
                                        {/* Desktop-only hidden / Mobile visible labels */}
                                        <div className="lg:col-span-2 flex items-center gap-4 mb-4 lg:mb-0">
                                            <div className="h-12 w-12 lg:h-9 lg:lg:w-9 rounded-2xl lg:rounded-xl bg-primary-600 flex items-center justify-center text-xs lg:text-[10px] font-black text-white shadow-lg shadow-primary-200 dark:shadow-none transition-transform group-hover:scale-105">
                                                {(project.projectName || project.name || 'PR').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-0">
                                                <span className="text-sm lg:text-xs font-black text-slate-900 dark:text-slate-100">{project.projectName || project.name}</span>
                                                <span className="lg:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">{project.tasks} Tasks active</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 lg:gap-0 lg:col-span-7 items-center">
                                            {/* Assignees */}
                                            <div className="flex flex-col lg:items-center gap-1 lg:col-span-1">
                                                <span className="lg:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest">Assignees</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{project.assignees}</span>
                                            </div>
                                            {/* Tasks (Desktop only here, mobile has it in header) */}
                                            <div className="hidden lg:flex flex-col lg:items-center gap-1 lg:col-span-1">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{project.tasks}</span>
                                            </div>
                                            {/* Total Time */}
                                            <div className="flex flex-col lg:items-center gap-1 lg:col-span-1">
                                                <span className="lg:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Time</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{project.totalTime}</span>
                                            </div>
                                            {/* Clocked Time */}
                                            <div className="flex flex-col lg:items-center gap-1 lg:col-span-1">
                                                <span className="lg:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest">Clocked</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{project.clockedTime}</span>
                                            </div>
                                            {/* Manual Time */}
                                            <div className="hidden md:flex flex-col lg:items-center gap-1 lg:col-span-1">
                                                <span className="lg:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest">Manual</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{project.manualTime}</span>
                                            </div>
                                            {/* Bill Rate */}
                                            <div className="flex flex-col lg:items-center gap-1 lg:col-span-1">
                                                <span className="lg:hidden text-[9px] font-black text-emerald-500/70 uppercase tracking-widest">Bill Rate</span>
                                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">${project.billRate}</span>
                                            </div>
                                            {/* Total Costs */}
                                            <div className="flex flex-col lg:items-center gap-1 lg:col-span-1">
                                                <span className="lg:hidden text-[9px] font-black text-primary-500/70 uppercase tracking-widest">Costs</span>
                                                <span className="text-sm lg:text-xs font-black text-primary-600 dark:text-primary-400">${project.totalCosts}</span>
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            )}

            <NewProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                employees={employees}
                teams={teams}
            />
        </div>
    );
}
