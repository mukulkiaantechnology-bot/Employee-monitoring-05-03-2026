import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronRight, User, Users, X } from 'lucide-react';
import { useRealTime } from '../hooks/RealTimeContext';
import { useFilterStore } from '../store/filterStore';

export function FilterDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('main'); // 'main' | 'Employee' | 'Teams'
    const dropdownRef = useRef(null);
    const { employees, teams } = useRealTime();
    const { setEmployee, setTeam, selectedEmployee, selectedTeam } = useFilterStore();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setActiveMenu('main');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const menuItems = [
        { id: 'Employee', label: 'Employee', icon: User },
        { id: 'Teams', label: 'Teams', icon: Users },
    ];

    const handleSelect = (type, id) => {
        if (type === 'Employee') setEmployee(id);
        if (type === 'Teams') setTeam(id);
        setIsOpen(false);
        setActiveMenu('main');
    };

    const clearFilters = (e) => {
        e.stopPropagation();
        setEmployee(null);
        setTeam(null);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-tight px-4 py-2 border rounded-lg transition-all ${
                    selectedEmployee || selectedTeam 
                    ? "bg-primary-600 border-primary-600 text-white" 
                    : "bg-primary-50/30 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/30 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                }`}
            >
                <Plus size={14} strokeWidth={2.5} />
                <span>{selectedEmployee ? 'Employee Filtered' : selectedTeam ? 'Team Filtered' : 'Add Filter'}</span>
                {(selectedEmployee || selectedTeam) && (
                    <X size={14} className="ml-1 hover:text-slate-200" onClick={clearFilters} />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {activeMenu === 'main' ? (
                        <>
                            <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 mb-1">
                                Filter By
                            </div>
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-between group"
                                    onClick={() => setActiveMenu(item.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={16} className="text-slate-400 group-hover:text-primary-500" />
                                        {item.label}
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </button>
                            ))}
                        </>
                    ) : activeMenu === 'Employee' ? (
                        <>
                            <div className="flex items-center gap-2 px-2 py-1 mb-1">
                                <button onClick={() => setActiveMenu('main')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400">
                                    <ChevronRight size={14} className="rotate-180" />
                                </button>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Employee</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <button
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => handleSelect('Employee', null)}
                                >
                                    All Employees
                                </button>
                                {employees.map(emp => (
                                    <button
                                        key={emp.id}
                                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center gap-2 ${
                                            selectedEmployee === emp.id ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                        onClick={() => handleSelect('Employee', emp.id)}
                                    >
                                        <div className="h-6 w-6 rounded-full bg-slate-100 overflow-hidden">
                                            <img src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.name}`} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        {emp.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : activeMenu === 'Teams' ? (
                        <>
                            <div className="flex items-center gap-2 px-2 py-1 mb-1">
                                <button onClick={() => setActiveMenu('main')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400">
                                    <ChevronRight size={14} className="rotate-180" />
                                </button>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Team</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <button
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => handleSelect('Teams', null)}
                                >
                                    All Teams
                                </button>
                                {teams.map(team => (
                                    <button
                                        key={team.id}
                                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                                            selectedTeam === team.id ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                        onClick={() => handleSelect('Teams', team.id)}
                                    >
                                        {team.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}
