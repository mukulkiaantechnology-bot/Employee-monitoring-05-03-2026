import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, MoreVertical, Plus } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { AddOrgGroupModal } from '../../components/users/AddOrgGroupModal';
import { cn } from '../../utils/cn';

function OrgGroupCard({ group, users, onDelete }) {
    const [menu, setMenu] = useState(false);
    const manager = users.find((u) => u.id === group.managerId);
    const createdDate = group.createdAt ? new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-lg p-6 relative hover:shadow-xl transition-all group">
            <div className="absolute top-5 right-5">
                <div className="relative">
                    <button onClick={() => setMenu(!menu)} className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <MoreVertical size={16} />
                    </button>
                    {menu && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <button onClick={() => { setMenu(false); }} className="w-full px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">Edit</button>
                            <button onClick={() => { onDelete(group.id); setMenu(false); }} className="w-full px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-left transition-all">Delete</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-violet-200 dark:shadow-none">
                <Users size={22} />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">{group.name}</h3>
            {group.description && <p className="text-xs font-medium text-slate-400 mb-4 line-clamp-2">{group.description}</p>}
            <div className="flex flex-col gap-1.5 mt-3">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400">Employees</span>
                    <span className="font-black text-slate-700 dark:text-slate-300">{group.employees?.length ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400">Manager</span>
                    <span className="font-black text-slate-700 dark:text-slate-300">{manager?.name ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400">Created</span>
                    <span className="font-semibold text-slate-400">{createdDate}</span>
                </div>
            </div>
        </div>
    );
}

export function ManageOrgGroups() {
    const navigate = useNavigate();
    const { orgGroups, users, removeOrgGroup } = useUserStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between pt-8 pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/settings')} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={() => navigate('/settings')}>Settings</span>
                            <span>/</span><span className="cursor-pointer hover:text-violet-600 transition-colors" onClick={() => navigate('/settings/user-management/users')}>Manage Users</span>
                            <span>/</span><span className="text-violet-600">Org Groups</span>
                        </nav>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Manage Users</h1>
                    </div>
                </div>
                <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black shadow-lg shadow-violet-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all">
                    <Plus size={14} strokeWidth={3} /> Add New
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 mb-8">
                {[
                    { id: 'users', label: 'Manage Users', path: '/settings/user-management/users' },
                    { id: 'orgGroups', label: 'Manage Org Groups', path: '/settings/user-management/org-groups' },
                ].map((tab) => (
                    <button key={tab.id} onClick={() => navigate(tab.path)}
                        className={cn('px-4 py-3 text-sm font-black border-b-2 transition-all', tab.id === 'orgGroups' ? 'border-violet-600 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Grid or Empty state */}
            {orgGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="h-20 w-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Users size={36} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-lg font-black text-slate-400 mb-2">No Org Groups Yet</h3>
                    <p className="text-sm font-medium text-slate-400 mb-6">Create your first org group to organize employees into teams.</p>
                    <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 h-10 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black shadow-lg shadow-violet-200 dark:shadow-none hover:scale-[1.02] transition-all">
                        <Plus size={14} strokeWidth={3} /> Create Org Group
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {orgGroups.map((group) => (
                        <OrgGroupCard key={group.id} group={group} users={users} onDelete={setConfirmDelete} />
                    ))}
                </div>
            )}

            {/* Confirm delete */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">Delete Org Group</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-5">This org group will be permanently deleted and removed from all users.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                            <button onClick={() => { removeOrgGroup(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <AddOrgGroupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
