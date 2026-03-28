import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Building2, X, AlertTriangle } from 'lucide-react';
import {
    useOrganizationStore,
    INDUSTRY_OPTIONS,
    ORG_SIZE_OPTIONS,
    TIMEZONE_OPTIONS,
} from '../../store/organizationStore';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { cn } from '../../utils/cn';


// ── Timezone Change Confirm Modal ───────────────────────────────────────────
function TimezoneConfirmModal({ isOpen, oldTz, newTz, onConfirm, onCancel }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div
                className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <AlertTriangle size={22} />
                    </div>
                    <button onClick={onCancel} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Update Time Zone?</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Changing from <strong className="text-slate-700 dark:text-slate-200">{oldTz}</strong> to{' '}
                    <strong className="text-slate-700 dark:text-slate-200">{newTz}</strong>.
                </p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
                    This may affect employee reports and take time to apply across all employees.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Styled label ─────────────────────────────────────────────────────────────
function FieldLabel({ children, optional = false }) {
    return (
        <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
            {children}
            {optional && <span className="text-slate-300 dark:text-slate-600 normal-case font-semibold tracking-normal">(optional)</span>}
        </label>
    );
}

// ── Styled select ─────────────────────────────────────────────────────────────
function StyledSelect({ value, onChange, options, placeholder, error }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    'w-full h-12 px-4 pr-10 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all appearance-none',
                    !value ? 'text-slate-400' : '',
                    error
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                )}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function Organization() {
    const navigate = useNavigate();
    const { organization, originalOrganization, updateField, saveOrganization, fetchOrganization, resetChanges, hasChanges, isLoading } = useOrganizationStore();

    const [errors, setErrors] = useState({});
    const [tzConfirm, setTzConfirm] = useState({ open: false, pendingTz: '' });

    useEffect(() => {
        fetchOrganization();
    }, []);

    if (isLoading && !organization) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!organization) return null;

    const isDirty = hasChanges();


    const validate = () => {
        const errs = {};
        if (!organization.legalName.trim()) errs.legalName = 'Legal Name is required.';
        else if (organization.legalName.trim().length < 3) errs.legalName = 'Legal Name must be at least 3 characters.';
        if (!organization.timeZone) errs.timeZone = 'Time Zone is required.';
        return errs;
    };

    const handleTzChange = (newTz) => {
        if (originalOrganization.timeZone && newTz !== originalOrganization.timeZone) {
            setTzConfirm({ open: true, pendingTz: newTz });
        } else {
            updateField('timeZone', newTz);
        }
    };

    const handleTzConfirm = () => {
        updateField('timeZone', tzConfirm.pendingTz);
        setTzConfirm({ open: false, pendingTz: '' });
    };

    const handleTzCancel = () => {
        setTzConfirm({ open: false, pendingTz: '' });
    };

    const handleSave = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        try {
            await saveOrganization();
            setErrors({});
        } catch (error) {
            // Error is handled by apiClient global toast
        }
    };

    const handleReset = () => {
        resetChanges();
        setErrors({});
    };

    return (
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 pt-8 pb-10">
                <button
                    onClick={() => navigate('/settings')}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors" onClick={() => navigate('/settings')}>
                            Settings
                        </span>
                        <span>/</span>
                        <span className="text-violet-600">Organization</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                            <Building2 size={18} />
                        </div> */}
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Organization
                        </h1>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-7">
                {/* Legal Name */}
                <div className="space-y-2">
                    <FieldLabel>Legal Name</FieldLabel>
                    <input
                        type="text"
                        placeholder="Enter your company's legal name"
                        value={organization.legalName}
                        onChange={(e) => {
                            updateField('legalName', e.target.value);
                            setErrors((er) => ({ ...er, legalName: undefined }));
                        }}
                        className={cn(
                            'w-full h-12 px-4 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
                            errors.legalName
                                ? 'border-rose-400 focus:border-rose-500'
                                : 'border-slate-200 dark:border-slate-800 focus:border-violet-500'
                        )}
                    />
                    {errors.legalName && (
                        <p className="text-xs font-bold text-rose-500">{errors.legalName}</p>
                    )}
                </div>

                {/* Workspace */}
                <div className="space-y-2">
                    <FieldLabel>Workspace</FieldLabel>
                    <div className="relative">
                        <input
                            readOnly
                            value={organization.workspaceId}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-mono text-slate-500 dark:text-slate-400 cursor-not-allowed select-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">Read-only</span>
                        </div>
                    </div>
                </div>

                {/* Industry */}
                <div className="space-y-2">
                    <FieldLabel optional>Industry</FieldLabel>
                    <StyledSelect
                        value={organization.industry}
                        onChange={(v) => updateField('industry', v)}
                        options={INDUSTRY_OPTIONS}
                        placeholder="Choose industry from the list"
                    />
                </div>

                {/* Organization Size */}
                <div className="space-y-2">
                    <FieldLabel optional>Organization Size</FieldLabel>
                    <StyledSelect
                        value={organization.organizationSize}
                        onChange={(v) => updateField('organizationSize', v)}
                        options={ORG_SIZE_OPTIONS}
                        placeholder="Choose organization size from the list"
                    />
                </div>

                {/* Time Zone */}
                <div className="space-y-2">
                    <FieldLabel>Time Zone</FieldLabel>
                    <StyledSelect
                        value={organization.timeZone}
                        onChange={handleTzChange}
                        options={TIMEZONE_OPTIONS}
                        placeholder="Select time zone"
                        error={!!errors.timeZone}
                    />
                    {errors.timeZone && (
                        <p className="text-xs font-bold text-rose-500">{errors.timeZone}</p>
                    )}
                </div>

                {/* Work Hours */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <FieldLabel>Standard Work Hours</FieldLabel>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Shift Start</p>
                            <input
                                type="time"
                                value={organization.workHours?.start || '09:00'}
                                onChange={(e) => updateField('workHours', { ...organization.workHours, start: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Shift End</p>
                            <input
                                type="time"
                                value={organization.workHours?.end || '18:00'}
                                onChange={(e) => updateField('workHours', { ...organization.workHours, end: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Workdays */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <FieldLabel>Workdays</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                            const isActive = organization.workDays?.includes(day);
                            return (
                                <button
                                    key={day}
                                    onClick={() => {
                                        const current = organization.workDays || [];
                                        const next = isActive ? current.filter(d => d !== day) : [...current, day];
                                        updateField('workDays', next);
                                    }}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                                        isActive
                                            ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-none"
                                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
                                    )}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Info Banner */}
                <InfoBanner variant="info">
                    Updating the organization's time zone may take time to apply across all employees.{' '}
                    <button className="font-black hover:underline text-blue-700 dark:text-blue-400">Learn more</button>
                </InfoBanner>

                {/* Save Button Row */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className={cn(
                            'px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all',
                            isDirty
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 dark:shadow-none hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-95'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        )}
                    >
                        Save changes
                    </button>
                    {isDirty && (
                        <button
                            onClick={handleReset}
                            className="px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Discard
                        </button>
                    )}
                </div>
            </div>

            {/* Timezone Confirm Modal */}
            <TimezoneConfirmModal
                isOpen={tzConfirm.open}
                oldTz={originalOrganization.timeZone}
                newTz={tzConfirm.pendingTz}
                onConfirm={handleTzConfirm}
                onCancel={handleTzCancel}
            />

        </div>
    );
}
