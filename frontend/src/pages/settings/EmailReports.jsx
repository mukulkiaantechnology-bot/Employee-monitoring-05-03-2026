import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Search, Mail } from 'lucide-react';
import { useEmailReportStore } from '../../store/emailReportStore';
import { EmailReportTable } from '../../components/email/EmailReportTable';
import { CreateEmailReportModal } from '../../components/email/CreateEmailReportModal';
import { ConfirmDeleteModal } from '../../components/modals/ConfirmDeleteModal';
import { cn } from '../../utils/cn';

// Mini toast component
function Toast({ show, message }) {
    if (!show) return null;
    return (
        <div className="fixed bottom-8 right-8 z-[300] px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-3">
            <span className="text-emerald-400 dark:text-emerald-600">✓</span>
            {message}
        </div>
    );
}

export function EmailReports() {
    const navigate = useNavigate();
    const { reports, createReport, updateReport, deleteReport, toggleReport } = useEmailReportStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [deletingReport, setDeletingReport] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const filteredReports = useMemo(
        () => reports.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [reports, searchQuery]
    );

    const existingTitles = reports.map((r) => r.title);

    const handleSave = (formData) => {
        if (editingReport) {
            updateReport(editingReport.id, formData);
            showToast('Email report updated successfully!');
            setEditingReport(null);
        } else {
            createReport(formData);
            showToast('Email report created successfully!');
        }
    };

    const handleEdit = (report) => {
        setEditingReport(report);
        setIsCreateOpen(true);
    };

    const handleDelete = () => {
        if (!deletingReport) return;
        deleteReport(deletingReport.id);
        showToast('Email report deleted.');
        setDeletingReport(null);
    };

    const handleModalClose = () => {
        setIsCreateOpen(false);
        setEditingReport(null);
    };

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
                            <span
                                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                onClick={() => navigate('/settings')}
                            >
                                Settings
                            </span>
                            <span>/</span>
                            <span className="text-violet-600">Email Reports</span>
                        </nav>
                        <div className="flex items-center gap-3">
                            {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                                <Mail size={18} />
                            </div> */}
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Email Reports
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Top Right Controls */}
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
                        onClick={() => { setEditingReport(null); setIsCreateOpen(true); }}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus size={16} strokeWidth={3} /> Create new report
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                <EmailReportTable
                    reports={filteredReports}
                    onEdit={handleEdit}
                    onDelete={setDeletingReport}
                    onToggle={toggleReport}
                />
            </div>

            {/* Create / Edit Modal */}
            <CreateEmailReportModal
                isOpen={isCreateOpen}
                onClose={handleModalClose}
                onSave={handleSave}
                existingReport={editingReport}
                existingTitles={editingReport ? existingTitles.filter((t) => t !== editingReport.title) : existingTitles}
            />

            {/* Delete Confirm Modal */}
            <ConfirmDeleteModal
                isOpen={!!deletingReport}
                onClose={() => setDeletingReport(null)}
                onConfirm={handleDelete}
                title="Delete Email Report"
                description={`Are you sure you want to delete "${deletingReport?.title}"? This action cannot be undone.`}
            />

            {/* Toast */}
            <Toast show={toast.show} message={toast.message} />
        </div>
    );
}
