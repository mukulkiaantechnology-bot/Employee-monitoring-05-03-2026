import React, { useState, useMemo } from 'react';
import { X, Search, Check, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export function UserFilterModal({ isOpen, onClose, selectedUsers, onApply }) {
    const [search, setSearch] = useState('');
    const [localSelected, setLocalSelected] = useState(selectedUsers);

    // Dummy users list for the filter
    const users = [
        { id: 'u1', name: 'Jane Smith', role: 'Owner' },
        { id: 'u2', name: 'Alex Rivera', role: 'Admin' },
        { id: 'u3', name: 'John Doe', role: 'Manager' },
        { id: 'u4', name: 'Sarah Wilson', role: 'HR' },
        { id: 'u5', name: 'Alice Smith', role: 'Employee' }
    ];

    const filteredUsers = useMemo(() => {
        return users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    if (!isOpen) return null;

    const toggleUser = (name) => {
        setLocalSelected(prev => 
            prev.includes(name) 
                ? prev.filter(u => u !== name) 
                : [...prev, name]
        );
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Filter by Users</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users..."
                            className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-4 font-bold text-sm text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {filteredUsers.map(user => (
                            <button
                                key={user.id}
                                onClick={() => toggleUser(user.name)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                    localSelected.includes(user.name)
                                        ? "border-primary-500 bg-primary-50/50 dark:bg-primary-500/10"
                                        : "border-slate-50 dark:border-slate-800 hover:border-slate-100 dark:hover:border-slate-700"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <User size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{user.name}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
                                    </div>
                                </div>
                                {localSelected.includes(user.name) && (
                                    <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white animate-in zoom-in duration-200">
                                        <Check size={14} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button 
                        onClick={() => setLocalSelected([])}
                        className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                        Clear All
                    </button>
                    <button 
                        onClick={() => onApply(localSelected)}
                        className="flex-1 h-12 rounded-xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
                    >
                        Apply Filter
                    </button>
                </div>
            </div>
        </div>
    );
}
