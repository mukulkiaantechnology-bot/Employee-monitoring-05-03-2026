import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Search, Filter, ChevronDown, X } from 'lucide-react';
import { useUtilizationStore, FORMULA_TYPES } from '../../store/utilizationStore';
import { UtilizationTable } from '../../components/utilization/UtilizationTable';
import { AddFormulaWizard } from '../../components/utilization/AddFormulaWizard';
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
                    <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
}

const FILTER_OPTIONS = [
    { key: 'author', label: 'Author', options: ['system', 'user'] },
    { key: 'type', label: 'Formula Type', options: FORMULA_TYPES.map((t) => t.id) },
    { key: 'teams', label: 'Teams', options: ['all'] },
];

function FilterDropdown({ onSelect }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    React.useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="flex items-center gap-2 h-9 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-600 dark:text-slate-300 hover:border-violet-400 transition-all shadow-sm">
                <Plus size={13} className="text-violet-500" strokeWidth={3} /> Add Filter
            </button>
            {open && (
                <div className="absolute left-0 top-full mt-2 z-50 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <p className="px-4 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Filter By</p>
                    {FILTER_OPTIONS.map((opt) => (
                        <button key={opt.key} onClick={() => { onSelect(opt); setOpen(false); }} className="w-full px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all">
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function FilterModal({ filter, onApply, onClose }) {
    const [val, setVal] = useState('');
    if (!filter) return null;
    const typeMap = Object.fromEntries(FORMULA_TYPES.map((t) => [t.id, t.label]));
    return (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">Filter by {filter.label}</h3>
                <div className="space-y-2">
                    {filter.options.map((opt) => (
                        <label key={opt} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all',
                            val === opt ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300')}>
                            <input type="radio" name="filterVal" value={opt} checked={val === opt} onChange={() => setVal(opt)} className="accent-violet-600" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                                {typeMap[opt] ?? opt}
                            </span>
                        </label>
                    ))}
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                    <button onClick={() => { onApply(filter.key, val); onClose(); }} disabled={!val} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black disabled:opacity-40 transition-all">Apply</button>
                </div>
            </div>
        </div>
    );
}

export function Utilization() {
    const navigate = useNavigate();
    const { getFiltered, setSearch, search, filters, applyFilter, resetFilters, deleteFormula, setDefaultFormula } = useUtilizationStore();
    const [wizardOpen, setWizardOpen] = useState(false);
    const [editFormula, setEditFormula] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null); // filter option obj
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const formulas = getFiltered();
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;
    const typeMap = Object.fromEntries(FORMULA_TYPES.map((t) => [t.id, t.label]));

    const handleDelete = (formula) => {
        if (formula.author === 'system') {
            showToast('System formulas cannot be deleted.', 'error'); return;
        }
        setConfirmDelete(formula);
    };

    const confirmDoDelete = () => {
        deleteFormula(confirmDelete.id);
        showToast('Formula deleted successfully.');
        setConfirmDelete(null);
    };

    const handleEdit = (formula) => {
        setEditFormula(formula);
        setWizardOpen(true);
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
                            <span>/</span><span className="text-violet-600">Utilization</span>
                        </nav>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Utilization</h1>
                    </div>
                </div>
                <button onClick={() => { setEditFormula(null); setWizardOpen(true); }}
                    className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black shadow-lg shadow-violet-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all">
                    <Plus size={14} strokeWidth={3} /> Add New Formula
                </button>
            </div>

            {/* Filter bar + Search */}
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <FilterDropdown onSelect={(opt) => setActiveFilter(opt)} />
                    {/* Active filter chips */}
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value) return null;
                        const label = key === 'type' ? typeMap[value] : value;
                        return (
                            <span key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest">
                                {key}: {label}
                                <button onClick={() => applyFilter(key, null)} className="hover:text-rose-500 transition-colors"><X size={11} /></button>
                            </span>
                        );
                    })}
                    {activeFiltersCount > 0 && (
                        <button onClick={resetFilters} className="text-[10px] font-black text-rose-500 hover:underline transition-all">Clear all</button>
                    )}
                </div>
                <div className="relative shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Search formula" value={search} onChange={(e) => setSearch(e.target.value)}
                        className="h-9 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none shadow-sm" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <UtilizationTable
                    formulas={formulas}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSetDefault={setDefaultFormula}
                />
            </div>

            {/* Wizard */}
            <AddFormulaWizard isOpen={wizardOpen} editFormula={editFormula} onClose={() => { setWizardOpen(false); setEditFormula(null); }} />

            {/* Confirm delete */}
            <ConfirmModal
                show={!!confirmDelete}
                title="Delete Formula"
                message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
                onConfirm={confirmDoDelete}
                onCancel={() => setConfirmDelete(null)}
            />
            <Toast {...toast} />
        </div>
    );
}
