import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Download, ChevronDown, Users, Plus } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserTable } from '../../components/users/UserTable';
import { AddAdminModal } from '../../components/users/AddAdminModal';
import { AddManagerWizard } from '../../components/users/AddManagerWizard';
import { AddClientWizard } from '../../components/users/AddClientWizard';
import { AddOrgGroupModal } from '../../components/users/AddOrgGroupModal';
import { cn } from '../../utils/cn';

function Toast({ show, message, type = 'success' }) {
    if (!show) return null;
    return (
        <div className={`fixed bottom-8 right-8 z-[300] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-3 ${type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'}`}>
            <span>{type === 'error' ? '✗' : '✓'}</span> {message}
        </div>
    );
}

function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-5">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 transition-all">Remove</button>
                </div>
            </div>
        </div>
    );
}

function AddNewDropdown({ onSelect }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    React.useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    const items = ['Admin', 'Manager', 'Client', 'Org Group'];
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black shadow-lg shadow-violet-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all">
                Add New <ChevronDown size={14} className={cn('transition-transform duration-200', open && 'rotate-180')} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 z-50 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {items.map((item) => (
                        <button key={item} onClick={() => { onSelect(item); setOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left">
                            <Plus size={13} className="text-violet-500" /> {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ManageUsers() {
    const navigate = useNavigate();
    const { users, removeUser } = useUserStore();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('users');
    const [modal, setModal] = useState(null); // null | 'admin' | 'manager' | 'client' | 'orgGroup'
    const [confirmRemove, setConfirmRemove] = useState(null); // userId
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleSelect = (type) => {
        const map = { Admin: 'admin', Manager: 'manager', Client: 'client', 'Org Group': 'orgGroup' };
        setModal(map[type]);
    };

    const handleRemove = (id) => setConfirmRemove(id);
    const confirmDoRemove = () => {
        const result = removeUser(confirmRemove);
        if (result?.error) showToast(result.error, 'error');
        else showToast('User removed successfully.');
        setConfirmRemove(null);
    };

    const handleDownload = () => {
        const csv = ['Name,Email,Role,LoginType,Features', ...users.map((u) => `${u.name},${u.email},${u.role},${u.loginType},${u.features}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click();
        URL.revokeObjectURL(url);
    };

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
                            <span>/</span><span className="text-violet-600">Manage Users</span>
                        </nav>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Manage Users</h1>
                    </div>
                </div>
                <AddNewDropdown onSelect={handleSelect} />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 mb-6">
                {[{ id: 'users', label: 'Manage Users', path: '/settings/user-management/users' }, { id: 'orgGroups', label: 'Manage Org Groups', path: '/settings/user-management/org-groups' }].map((tab) => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); navigate(tab.path); }}
                        className={cn('px-4 py-3 text-sm font-black border-b-2 transition-all', activeTab === tab.id ? 'border-violet-600 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-violet-400 transition-all shadow-sm">
                        <Users size={13} /> Organization <ChevronDown size={13} className="text-slate-400" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
                            className="h-9 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none shadow-sm" />
                    </div>
                    <button onClick={handleDownload} className="flex items-center gap-2 h-9 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-violet-400 transition-all shadow-sm">
                        <Download size={13} /> Download
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <UserTable users={users} search={search} onEdit={() => { }} onRemove={handleRemove} />
            </div>

            {/* Modals */}
            <AddAdminModal isOpen={modal === 'admin'} onClose={() => setModal(null)} />
            <AddManagerWizard isOpen={modal === 'manager'} onClose={() => setModal(null)} />
            <AddClientWizard isOpen={modal === 'client'} onClose={() => setModal(null)} />
            <AddOrgGroupModal isOpen={modal === 'orgGroup'} onClose={() => setModal(null)} />
            <ConfirmModal show={!!confirmRemove} title="Remove User" message="Are you sure you want to remove this user? This action cannot be undone." onConfirm={confirmDoRemove} onCancel={() => setConfirmRemove(null)} />
            <Toast {...toast} />
        </div>
    );
}
