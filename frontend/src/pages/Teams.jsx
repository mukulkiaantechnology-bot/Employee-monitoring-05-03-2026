import React, { useState, useMemo, useEffect } from 'react';
import { Users, Search, Download, LayoutGrid, MoreVertical, TrendingUp, Plus, X } from 'lucide-react';
import { CreateTeamModal } from '../components/CreateTeamModal';
import { useTeamStore } from '../store/teamStore';
import { useEmployeeStore } from '../store/employeeStore';
import { useAuthStore } from '../store/authStore';
import { useOrganizationStore } from '../store/organizationStore';
import { useToast } from '../context/ToastContext';
import activityService from '../services/activityService';
import { cn } from '../utils/cn';

const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export function Teams() {
    const { teams: contextTeams, fetchTeams, addTeam, updateTeam, deleteTeam, isLoading } = useTeamStore();
    const { employees, fetchEmployees } = useEmployeeStore();
    const { user } = useAuthStore();
    const { organization, fetchOrganization } = useOrganizationStore();
    const [teamSummaries, setTeamSummaries] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [search, setSearch] = useState('');
    const { toast } = useToast();
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        const fetchSummaries = async () => {
            const summaries = {};
            for (const team of contextTeams) {
                try {
                    const res = await activityService.getTeamSummary(team.id);
                    if (res.success) {
                        summaries[team.id] = res.data;
                    }
                } catch (error) {
                    console.error(`Failed to fetch summary for team ${team.id}:`, error);
                }
            }
            setTeamSummaries(summaries);
        };

        if (contextTeams.length > 0) {
            fetchSummaries();
        }
    }, [contextTeams]);

    const findOnlineCount = (team) => {
        if (!team.employees) return 0;
        return team.employees.filter(e => e.status === 'ACTIVE').length;
    };

    const teamsData = useMemo(() => contextTeams.map(team => {
        const initials = team.name.substring(0, 2).toUpperCase();
        const summary = teamSummaries[team.id] || {
            activeHours: 0,
            idleHours: 0,
            manualHours: 0,
            productiveHours: 0,
            unproductiveHours: 0,
            neutralHours: 0,
            productivityPct: 0
        };

        return {
            ...team,
            initials,
            onlineCount: findOnlineCount(team),
            productivity: summary.productivityPct,
            stats: {
                work: formatHours(summary.activeHours + summary.idleHours + summary.manualHours),
                comp: formatHours(summary.activeHours + summary.idleHours),
                manual: formatHours(summary.manualHours),
                prod: formatHours(summary.productiveHours),
                unprod: formatHours(summary.unproductiveHours),
                neutral: formatHours(summary.neutralHours),
                idle: formatHours(summary.idleHours),
            },
        };
    }).filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase())), [contextTeams, search, teamSummaries]);

    const handleCreateTeam = async (teamData) => {
        if (editingTeam) {
            try {
                await updateTeam(editingTeam.id, teamData);
                setIsModalOpen(false);
                setEditingTeam(null);
            } catch (error) {
                // Error handled by apiClient
            }
            return;
        }

        // Priority: store, then user, then employees fallback
        const orgId = organization?.id ||
            user?.organizationId ||
            employees?.[0]?.organizationId;

        if (!orgId) {
            toast.error("No organization found. Please contact support.");
            return;
        }

        try {
            await addTeam({
                ...teamData,
                organizationId: orgId
            });
            setIsModalOpen(false);
        } catch (error) {
            // Error handled by apiClient
        }
    };

    const handleEditClick = (team) => {
        setEditingTeam(team);
        setIsModalOpen(true);
        setOpenMenu(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTeam(null);
    };

    if (isLoading && contextTeams.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">Loading teams...</div>;
    }

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Teams</h1>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Users size={13} />
                        {employees.length} employees · {contextTeams.length} teams
                    </div>
                </div>
                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                    <button onClick={() => { setEditingTeam(null); setIsModalOpen(true); }}
                        className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-xs font-black transition-all shadow-xl uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95">
                        <Plus size={16} strokeWidth={3} /> Create New Team
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {contextTeams.slice(0, 4).map(team => {
                    return (
                        <div key={team.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-2xl ${team.color || 'bg-blue-500'} flex items-center justify-center text-[10px] font-black text-white shadow-lg`}>
                                        {team.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-black text-slate-700 dark:text-white truncate max-w-[100px]">{team.name}</span>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{team.memberCount || 0} Members</p>
                                    <p className="text-xs font-black text-slate-700 dark:text-slate-300 mt-1">{team.onlineCount || 0} Online</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Productivity</p>
                                    <p className="text-xs font-black text-violet-600 mt-1">{team.productivity || 0}%</p>
                                </div>
                            </div>
                            <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-violet-500 rounded-full transition-all duration-1000" style={{ width: `${team.productivity || 0}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
                <div className="relative group flex-1 max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search teams by name..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold outline-none focus:border-primary-500 focus:bg-white transition-all dark:text-white shadow-sm" 
                    />
                </div>
                <div className="flex items-center gap-2 justify-end sm:justify-start">
                    <button className="h-12 w-12 flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-100 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <Download size={18} />
                    </button>
                    <button className="h-12 w-12 flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-100 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <LayoutGrid size={18} />
                    </button>
                </div>
            </div>

            {/* Team List Header (Desktop Only) */}
            <div className="hidden lg:grid lg:grid-cols-12 px-8 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                <div className="col-span-3 text-left">Team Architecture</div>
                <div className="col-span-1">Work</div>
                <div className="col-span-1">Comp.</div>
                <div className="col-span-1">Manual</div>
                <div className="col-span-1">Prod.</div>
                <div className="col-span-1">Unprod.</div>
                <div className="col-span-1">Neutral</div>
                <div className="col-span-1">Idle</div>
                <div className="col-span-2">Health</div>
            </div>

            {/* Team Rows / Cards */}
            <div className="grid grid-cols-1 gap-4">
                {teamsData.map((team, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800/50 rounded-[2.5rem] p-4 lg:p-6 shadow-sm hover:shadow-xl hover:border-primary-100 dark:hover:border-primary-900/30 transition-all group relative">
                        {/* Mobile & Desktop Flexible Layout */}
                        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-6 lg:gap-0">
                            
                            {/* Team Identity */}
                            <div className="col-span-3 flex items-center gap-5">
                                <div className={`h-14 w-14 rounded-[1.5rem] flex items-center justify-center text-sm font-black text-white ${team.color || 'bg-blue-500'} shadow-xl shadow-${team.color?.split('-')[1] || 'blue'}-200 dark:shadow-none transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    {team.initials}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-slate-900 dark:text-white leading-tight text-lg truncate">{team.name}</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">{team.memberCount} Members  </p>
                                </div>
                            </div>

                            {/* Stats Section (Desktop Grid / Mobile Flex Wrap) */}
                            <div className="col-span-7 grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-7 gap-3 lg:gap-0">
                                {[
                                    { label: 'Work', val: team.stats.work, color: 'text-slate-700 dark:text-slate-300' },
                                    { label: 'Comp', val: team.stats.comp, color: 'text-slate-700 dark:text-slate-300' },
                                    { label: 'Manual', val: team.stats.manual, color: 'text-slate-700 dark:text-slate-300' },
                                    { label: 'Prod', val: team.stats.prod, color: 'text-emerald-500' },
                                    { label: 'Unpr', val: team.stats.unprod, color: 'text-rose-500' },
                                    { label: 'Neut', val: team.stats.neutral, color: 'text-slate-500' },
                                    { label: 'Idle', val: team.stats.idle, color: 'text-amber-500' }
                                ].map((s, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center lg:border-l border-slate-100 dark:border-slate-800 py-1">
                                        <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">{s.label}</span>
                                        <span className={`font-black ${s.color} text-xs tracking-tight`}>{s.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Productivity & Actions */}
                            <div className="col-span-2 flex items-center justify-between lg:justify-end gap-6 px-2">
                                <div className="flex-1 lg:max-w-[120px]">
                                    <div className="flex items-center justify-between mb-1.5 lg:hidden">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Health</span>
                                        <span className="text-xs font-black text-violet-600">{team.productivity || 0}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-violet-500 to-primary-500 rounded-full transition-all duration-1000" style={{ width: `${team.productivity || 0}%` }} />
                                    </div>
                                </div>
                                <div className="hidden lg:block min-w-[36px] text-right font-black text-slate-600 dark:text-slate-300 text-sm">
                                    {team.productivity || 0}%
                                </div>
                                
                                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                                    <div className="relative">
                                        <button onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                            <MoreVertical size={20} />
                                        </button>
                                        {openMenu === idx && (
                                            <div className="absolute right-0 top-12 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[1.5rem] shadow-2xl z-50 py-2 min-w-[160px] animate-in fade-in slide-in-from-top-2">
                                                <button onClick={() => handleEditClick(team)}
                                                    className="w-full text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3">
                                                    <LayoutGrid size={14} className="text-primary-500" />
                                                    Edit Team
                                                </button>
                                                <div className="h-px bg-slate-50 dark:bg-slate-800 mx-3 my-1" />
                                                <button onClick={() => { deleteTeam(team.id); setOpenMenu(null); }}
                                                    className="w-full text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-3">
                                                    <X size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {contextTeams.length === 0 && (
                <div className="py-16 text-center text-slate-400 font-bold text-sm">No teams found.</div>
            )}

            <CreateTeamModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onCreateTeam={handleCreateTeam}
                initialData={editingTeam}
            />
        </div>
    );
}
