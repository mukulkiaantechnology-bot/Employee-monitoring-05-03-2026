import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

export function FilterDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filters = ["Employee", "Teams", "Work Locations"];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-black uppercase tracking-tight px-4 py-2 border border-primary-100 dark:border-primary-900/30 bg-primary-50/30 dark:bg-primary-900/20 rounded-lg transition-colors"
            >
                <Plus size={14} strokeWidth={2.5} />
                <span>Add Filter</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 mb-1">
                        Filter By
                    </div>
                    {filters.map((filter, idx) => (
                        <button
                            key={idx}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-between group"
                            onClick={() => setIsOpen(false)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
