import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Settings2, Plus } from 'lucide-react';
import { useTrackingStore } from '../../store/trackingStore';
import { useAuthStore } from '../../store/authStore';
import { TrackingTable } from '../../components/tracking/TrackingTable';
import { TrackingForm } from '../../components/tracking/TrackingForm';
import { cn } from '../../utils/cn';

function Toast({ show, message }) {
    if (!show) return null;
    return (
        <div className="fixed bottom-8 right-8 z-[300] px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-3">
            <span className="text-emerald-400 dark:text-emerald-600">✓</span>{message}
        </div>
    );
}

const BLANK_PROFILE = {
    title: '',
    computerType: 'company',
    visibility: 'visible',
    screenshotsPerHour: 0,
    allowAccessScreenshots: false,
    allowRemoveScreenshots: false,
    breakTime: 0,
    allowOverBreak: false,
    allowNewBreaks: false,
    idleTime: 2,
    trackingScenario: 'unlimited',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    trackTasks: false,
    allowAddTasks: false,
    permissions: { canAnalyze: false, canSeeApps: false, canAddManual: false },
};

export function TrackingSettings() {
    const navigate = useNavigate();
    const { trackingProfiles, fetchTrackingData, createProfile, updateProfile, deleteProfile, setDefaultProfile } = useTrackingStore();
    const { role } = useAuthStore();
    const [search, setSearch] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
    const [editId, setEditId] = useState(null); // null = create
    const [form, setForm] = useState({ ...BLANK_PROFILE });
    const [toast, setToast] = useState({ show: false, message: '' });

    const rolePath = role?.toLowerCase() === 'admin' ? '/admin' : '/manager';

    React.useEffect(() => {
        fetchTrackingData();
    }, [fetchTrackingData]);

    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const openCreate = () => {
        setEditId(null);
        setForm({ ...BLANK_PROFILE });
        setPanelOpen(true);
    };

    const openEdit = (id) => {
        const profile = trackingProfiles.find((p) => p.id === id);
        if (!profile) return;
        setEditId(id);
        setForm({ ...profile });
        setPanelOpen(true);
    };

    const closePanel = () => {
        setPanelOpen(false);
        setEditId(null);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        try {
            if (editId) {
                await updateProfile(editId, form);
                showToast('Profile updated successfully!');
            } else {
                await createProfile(form);
                showToast('Profile created successfully!');
            }
            closePanel();
        } catch (error) {
            showToast('Failed to save profile.');
        }
    };

    const canSave = form.title.trim().length > 0;

    return (
        <div className="relative h-full overflow-hidden">
            <div className={cn('max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4', panelOpen && 'opacity-50 pointer-events-none')}>
                {/* Header */}
                <div className="flex items-center justify-between pt-8 pb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(`${rolePath}/settings`)} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                <span className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" onClick={() => navigate(`${rolePath}/settings`)}>Settings</span>
                                <span>/</span>
                                <span className="text-violet-600">Tracking Settings</span>
                            </nav>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Tracking Settings</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(`${rolePath}/settings/tracking/advanced`)} className="flex items-center gap-2 h-10 px-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 transition-all">
                            <Settings2 size={14} /> Advanced Settings
                        </button>
                        <button onClick={openCreate} className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black shadow-lg shadow-violet-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all">
                            <Plus size={14} strokeWidth={3} /> Create new tracking settings
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex justify-end mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none shadow-sm" />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <TrackingTable
                        profiles={trackingProfiles}
                        search={search}
                        onEdit={openEdit}
                        onDelete={deleteProfile}
                        onSetDefault={setDefaultProfile}
                    />
                </div>
            </div>

            {/* Slide-over Panel */}
            <div className={cn(
                'fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300',
                panelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )} onClick={closePanel} />

            <div className={cn(
                'fixed right-0 top-0 bottom-0 z-[110] w-full max-w-2xl bg-white dark:bg-slate-950 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out',
                panelOpen ? 'translate-x-0' : 'translate-x-full'
            )}>
                {/* Panel Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <nav className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                            <span className="text-violet-600 cursor-pointer hover:underline" onClick={closePanel}>Tracking Settings</span>
                            {' › '}
                            {editId ? 'Edit Tracking Settings' : 'New Tracking Settings'}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={closePanel} className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                        <button onClick={handleSave} disabled={!canSave} className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none">Save</button>
                    </div>
                </div>

                {/* Panel body (scrollable) */}
                <div className="flex-1 overflow-y-auto px-8">
                    <TrackingForm form={form} setForm={setForm} />
                </div>
            </div>

            <Toast show={toast.show} message={toast.message} />
        </div>
    );
}
