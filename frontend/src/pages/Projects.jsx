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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Projects</h1>
                </div>
                <div className="flex items-center gap-4">
                    {activeTab !== 'Integrated' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg shadow-primary-200 dark:shadow-primary-900/20 uppercase tracking-wider"
                        >
                            Add New Project
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-10 mb-8 border-b border-slate-100 dark:border-slate-800">
                {['Insightful', 'Integrated'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-black transition-all relative ${activeTab === tab ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-600 dark:bg-primary-500 rounded-full" />}
                    </button>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <GlobalCalendar />
                <FilterDropdown />

                <div className="ml-auto flex items-center gap-3">
                    <div className="relative group w-full md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-medium dark:text-slate-200 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    {activeTab !== 'Integrated' && (
                        <>
                            <button
                                onClick={handleDownload}
                                title="Download CSV"
                                className="p-2 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 rounded-lg hover:bg-primary-50 dark:hover:bg-slate-800/50 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                            >
                                <Download size={18} strokeWidth={2.5} />
                            </button>
                            {/* <button
                                onClick={() => setIsGridView(!isGridView)}
                                title={isGridView ? "List View" : "Grid View"}
                                className={`p-2 border rounded-lg transition-colors ${
                                    isGridView
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600'
                                        : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary-600'
                                }`}
                            >
                                <LayoutGrid size={18} strokeWidth={2.5} />
                            </button> */}
                        </>
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
                        <div className="bg-[#eef8ff] dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/50 text-[#00609b] dark:text-primary-300 px-5 py-3.5 rounded-lg flex items-center gap-3 text-xs font-bold w-full shadow-sm">
                            <Info size={18} className="text-[#0092e0] dark:text-primary-400" />
                            <span>Choose task statuses visible to employees. <button className="hover:underline font-black text-primary-600 dark:text-primary-400">Learn More.</button></span>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-9 px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center border-b border-slate-100 dark:border-slate-800">
                            {tableHeaders.map((header, idx) => (
                                <div key={idx} className={idx === 0 ? "text-left col-span-2" : idx === 1 ? "ml-12" : "col-span-1"}>{header}</div>
                            ))}
                        </div>

                        {/* Product Rows */}
                        <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
                            {(() => {
                                if (loading) return <div className="text-center py-10 font-bold text-slate-400">Loading projects...</div>;

                                const filtered = projects.filter(p => (p.projectName || p.name || '').toLowerCase().includes(projectSearch.toLowerCase()));
                                if (filtered.length === 0) {
                                    return (
                                        <div className="flex flex-col items-center justify-center py-32 text-center col-span-full">
                                            <h3 className="text-3xl font-black text-slate-200 dark:text-slate-800 select-none">No Projects</h3>
                                        </div>
                                    );
                                }
                                return filtered.map((project, idx) => (
                                    <div key={idx} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-md transition-all group ${isGridView ? 'flex flex-col gap-4' : 'grid grid-cols-9 items-center'
                                        }`}>
                                        <div className={`${isGridView ? 'w-full' : 'col-span-2'} flex items-center gap-3`}>
                                            <div className={`h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center text-[10px] font-black text-white`}>
                                                {(project.projectName || project.name || 'PR').substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{project.projectName || project.name}</span>
                                        </div>
                                        <div className="col-span-1 text-center text-xs font-bold text-slate-500">{project.assignees}</div>
                                        <div className="col-span-1 text-center text-xs font-bold text-slate-500">{project.tasks}</div>
                                        <div className="col-span-1 text-center text-xs font-bold text-slate-500">{project.totalTime}</div>
                                        <div className="col-span-1 text-center text-xs font-bold text-slate-500">{project.clockedTime}</div>
                                        <div className="col-span-1 text-center text-xs font-bold text-slate-500">{project.manualTime}</div>
                                        <div className="col-span-1 text-center text-xs font-bold text-slate-500">${project.billRate}</div>
                                        <div className="col-span-1 text-center text-xs font-bold text-slate-900 dark:text-white">${project.totalCosts}</div>
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
