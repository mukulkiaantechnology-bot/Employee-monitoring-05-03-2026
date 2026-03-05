import React, { useRef, useState } from 'react';
import { MoreVertical, User } from 'lucide-react';
import { cn } from '../../utils/cn';

function Avatar({ name, role }) {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
            {initials || <User size={14} />}
        </div>
    );
}

const ROLE_COLORS = {
    admin: 'text-violet-700 dark:text-violet-400',
    manager: 'text-blue-600 dark:text-blue-400',
    client: 'text-emerald-600 dark:text-emerald-400',
};

function ActionMenu({ user, onEdit, onRemove }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    React.useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <MoreVertical size={18} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-50 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <button onClick={() => { onEdit(user); setOpen(false); }} className="w-full px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
                        Edit
                    </button>
                    <button onClick={() => { onRemove(user.id); setOpen(false); }} className="w-full px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-left transition-all">
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}

function ScopeCell({ value, label }) {
    if (value === 'all') return (
        <span className="text-sm text-slate-700 dark:text-slate-300">
            <strong className="font-black">All</strong> {label}
        </span>
    );
    return <span className="text-sm font-semibold text-slate-500">{value}</span>;
}

export function UserTable({ users, search, onEdit, onRemove }) {
    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const columns = ['User', 'Email', 'Login Type', 'Features', 'Managing Employees', 'Managing Teams', 'Managing Projects', ''];

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                        {columns.map((h, i) => (
                            <th key={i} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap bg-slate-50/50 dark:bg-slate-900/50">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {filtered.map((user) => (
                        <tr key={user.id} className="hover:bg-violet-50/20 dark:hover:bg-violet-900/5 transition-all group">
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar name={user.name} role={user.role} />
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{user.name}</p>
                                        <p className={cn('text-[10px] font-black capitalize', ROLE_COLORS[user.role])}>{user.role}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{user.email}</td>
                            <td className="px-5 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize">{user.loginType}</td>
                            <td className="px-5 py-4">
                                {user.features === 'all' ? (
                                    <span className="text-sm text-slate-700 dark:text-slate-300"><strong className="font-black">All</strong> Features</span>
                                ) : (
                                    <span className="text-sm font-semibold text-slate-500">{Array.isArray(user.features) ? user.features.length + ' features' : user.features}</span>
                                )}
                            </td>
                            <td className="px-5 py-4"><ScopeCell value={user.scope?.employees} label="Employees" /></td>
                            <td className="px-5 py-4"><ScopeCell value={user.scope?.teams} label="Teams" /></td>
                            <td className="px-5 py-4"><ScopeCell value={user.scope?.projects} label="Projects" /></td>
                            <td className="px-5 py-4 text-right">
                                <ActionMenu user={user} onEdit={onEdit} onRemove={onRemove} />
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={8} className="px-5 py-16 text-center text-sm font-bold text-slate-400">No users match your search.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
