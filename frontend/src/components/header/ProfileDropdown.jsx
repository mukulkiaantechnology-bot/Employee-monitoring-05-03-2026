import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Settings, Building, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const currentUser = user; // Map for compatibility with existing JSX

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const getRoleBrandColor = (role) => {
        const r = role?.toUpperCase();
        if (r === 'ADMIN') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
        if (r === 'MANAGER') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        <span className="text-sm font-black">{currentUser?.name?.substring(0, 2).toUpperCase()}</span>
                    </div>
                )}

                <div className="hidden text-left md:block pr-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{currentUser?.fullName || currentUser?.name || 'User'}</p>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{currentUser?.role || 'Member'}</p>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black ring-opacity-5 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        {currentUser?.avatar ? (
                            <img src={currentUser.avatar} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                                <span className="text-sm font-black">{(currentUser?.fullName || currentUser?.name || '??').substring(0, 2).toUpperCase()}</span>
                            </div>
                        )}
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser?.fullName || currentUser?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                            <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md ${getRoleBrandColor(currentUser?.role)}`}>
                                {currentUser?.role}
                            </span>
                        </div>
                    </div>

                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => {
                                const rolePath = currentUser?.role?.toLowerCase();
                                navigate(`/${rolePath}/settings/personal`);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <Settings size={18} className="text-slate-400" />
                            Personal Settings
                        </button>

                        {currentUser?.role?.toUpperCase() === 'ADMIN' && (
                            <button
                                onClick={() => {
                                    const rolePath = currentUser?.role?.toLowerCase();
                                    navigate(`/${rolePath}/settings/organization`);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <Building size={18} className="text-slate-400" />
                                Organizations
                            </button>
                        )}

                        {/* <button
                            onClick={() => { window.open('https://help.insightful.io', '_blank'); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <HelpCircle size={18} className="text-slate-400" />
                            Help
                        </button> */}
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 rounded-xl transition-colors"
                        >
                            <LogOut size={18} className="text-red-500" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
