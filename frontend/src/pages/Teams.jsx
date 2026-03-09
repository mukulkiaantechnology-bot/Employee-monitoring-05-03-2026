import React, { useState, useMemo, useEffect } from 'react';
import { Users, Search, Download, LayoutGrid, MoreVertical, TrendingUp, Plus, X } from 'lucide-react';
import { CreateTeamModal } from '../components/CreateTeamModal';
import { useTeamStore } from '../store/teamStore';
import { useEmployeeStore } from '../store/employeeStore';
import { useAuthStore } from '../store/authStore';
import { useOrganizationStore } from '../store/organizationStore';

export function Teams() {
    const { teams: contextTeams, fetchTeams, addTeam, updateTeam, deleteTeam, isLoading } = useTeamStore();
    const { employees, fetchEmployees } = useEmployeeStore();
    const { user } = useAuthStore();
    const { organization, fetchOrganization } = useOrganizationStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [search, setSearch] = useState('');
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        fetchTeams();
        fetchEmployees();
        if (!organization) fetchOrganization();
    }, [fetchTeams, fetchEmployees, fetchOrganization, organization]);

    const teamsData = useMemo(() => contextTeams.map(team => {
        const initials = team.name.substring(0, 2).toUpperCase();
        return {
            ...team,
            initials,
            stats: {
                work: '00:00',
                comp: '00:00',
                manual: '00:00',
                prod: '00:00',
                unprod: '00:00',
                neutral: '00:00',
                idle: '00:00',
            },
        };
    }).filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase())), [contextTeams, search]);

    const handleCreateTeam = async (teamData) => {
        if (editingTeam) {
            try {
                await updateTeam(editingTeam.id, teamData);
                setIsModalOpen(false);
                setEditingTeam(null);
            } catch (error) {
                console.error("Failed to update team:", error);
            }
            return;
        }

        // Priority: store, then user, then employees fallback
        const orgId = organization?.id ||
            user?.organizationId ||
            employees?.[0]?.organizationId;

        if (!orgId) {
            console.error("No organization ID found. Cannot create team.");
            alert("No organization found. Please contact support.");
            return;
        }

        try {
            await addTeam({
                ...teamData,
                organizationId: orgId
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to create team:", error);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Teams</h1>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Users size={13} />
                        {employees.length} employees · {contextTeams.length} teams
                    </div>
                </div>
                {user?.role === 'ADMIN' && (
                    <button onClick={() => { setEditingTeam(null); setIsModalOpen(true); }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg uppercase tracking-wider flex items-center gap-2">
                        <Plus size={14} /> Create New Team
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {contextTeams.map(team => {
                    return (
                        <div key={team.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`h-8 w-8 rounded-lg ${team.color || 'bg-blue-500'} flex items-center justify-center text-[10px] font-black text-white`}>
                                    {team.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-xs font-black text-slate-700 dark:text-white">{team.name}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400">{team.memberCount || 0} members · <span className="text-emerald-500">{team.onlineCount || 0} online</span></p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${team.productivity || 0}%` }} />
                                </div>
                                <span className="text-[10px] font-black text-slate-500">{team.productivity || 0}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative group w-full md:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search teams" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-medium outline-none dark:text-white" />
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><Download size={16} /></button>
                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><LayoutGrid size={16} /></button>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                <div className="col-span-3 text-left">Team Name</div>
                <div className="col-span-1">Work [h]</div>
                <div className="col-span-1">Computer [h]</div>
                <div className="col-span-1">Manual [h]</div>
                <div className="col-span-1">Productive</div>
                <div className="col-span-1">Unproductive</div>
                <div className="col-span-1">Neutral</div>
                <div className="col-span-1">Idle</div>
                <div className="col-span-2 text-center">Productivity</div>
            </div>

            {/* Team Rows */}
            <div className="space-y-3">
                {teamsData.map((team, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 grid grid-cols-12 items-center hover:shadow-md transition-all group relative">
                        <div className="col-span-3 flex items-center gap-4">
                            <div className={`h-11 w-11 rounded-full flex items-center justify-center text-xs font-black text-white ${team.color || 'bg-blue-500'} transition-transform group-hover:scale-105`}>
                                {team.initials}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white leading-tight text-sm">{team.name}</h3>
                                <p className="text-[10px] text-slate-400 font-medium">{team.memberCount} employee{team.memberCount !== 1 ? 's' : ''} · <span className="text-emerald-500">{team.onlineCount} online</span></p>
                            </div>
                        </div>

                        {[team.stats.work, team.stats.comp, team.stats.manual].map((v, i) => (
                            <div key={i} className="col-span-1 text-center font-bold text-slate-700 dark:text-slate-300 text-xs border-l border-slate-100 dark:border-slate-800 py-2">{v}</div>
                        ))}
                        <div className="col-span-1 text-center font-bold text-emerald-500 text-xs">{team.stats.prod}</div>
                        <div className="col-span-1 text-center font-bold text-rose-500 text-xs">{team.stats.unprod}</div>
                        <div className="col-span-1 text-center font-bold text-slate-500 text-xs">{team.stats.neutral}</div>
                        <div className="col-span-1 text-center font-bold text-amber-500 text-xs">{team.stats.idle}</div>

                        <div className="col-span-2 flex items-center gap-2 px-2">
                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${team.productivity || 0}%` }} />
                            </div>
                            <span className="text-xs font-black text-slate-600 dark:text-slate-300 min-w-[32px]">{team.productivity || 0}%</span>
                            {user?.role === 'ADMIN' && (
                                <div className="relative">
                                    <button onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                                        className="text-slate-300 hover:text-slate-600 transition-colors p-1">
                                        <MoreVertical size={16} />
                                    </button>
                                    {openMenu === idx && (
                                        <div className="absolute right-0 top-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1 min-w-[120px]">
                                            <button onClick={() => handleEditClick(team)}
                                                className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Edit Team</button>
                                            <button onClick={() => { deleteTeam(team.id); setOpenMenu(null); }}
                                                className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">Delete</button>
                                        </div>
                                    )}
                                </div>
                            )}
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
