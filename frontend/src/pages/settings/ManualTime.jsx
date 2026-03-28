import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Search, Clock } from 'lucide-react';
import { useManualTimeStore } from '../../store/manualTimeStore';
import { ManualTimeTable } from '../../components/manualTime/ManualTimeTable';
import { AddEditManualTimeModal } from '../../components/manualTime/AddEditManualTimeModal';
import { ConfirmDeleteModal } from '../../components/modals/ConfirmDeleteModal';


export function ManualTime() {
    const navigate = useNavigate();
    const { types, addType, updateType, deleteType } = useManualTimeStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [deletingId, setDeletingId] = useState(null);


    const filteredTypes = useMemo(
        () => types.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [types, searchQuery]
    );

    const existingTitles = types.map(t => t.title);

    const handleSave = (formData) => {
        if (editingType) {
            updateType(editingType.id, formData);
            setEditingType(null);
        } else {
            addType(formData);
        }
    };

    const handleEdit = (id) => {
        const type = types.find(t => t.id === id);
        setEditingType(type);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingType(null);
    };

    const handleDeleteConfirm = () => {
        if (!deletingId) return;
        deleteType(deletingId);
        setDeletingId(null);
    };

    const deletingTitle = types.find(t => t.id === deletingId)?.title;

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4 sm:px-6 lg:px-8 pt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer" onClick={() => navigate('/settings')}>
                                Settings
                            </span>
                            <span>/</span>
                            <span className="text-violet-600">Manual Time</span>
                        </nav>
                        <div className="flex items-center gap-3">
                            {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                                <Clock size={18} />
                            </div> */}
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Manual time
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Top Right */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingType(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus size={16} strokeWidth={3} /> Add New Type
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <ManualTimeTable
                    types={filteredTypes}
                    onEdit={handleEdit}
                    onDelete={setDeletingId}
                />
            </div>

            {/* Add / Edit Modal */}
            <AddEditManualTimeModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleSave}
                existingType={editingType}
                existingTitles={editingType ? existingTitles.filter(t => t !== editingType.title) : existingTitles}
            />

            {/* Delete Confirm */}
            <ConfirmDeleteModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Manual Time Type"
                description={`Are you sure you want to delete "${deletingTitle}"? This action cannot be undone.`}
            />

        </div>
    );
}
