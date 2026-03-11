import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown, Plus, Loader } from 'lucide-react';
import { createPortal } from 'react-dom';
import useAttendanceStore from '../store/attendanceStore';
import { useRealTime } from '../hooks/RealTimeContext';

const TIME_OFF_TYPES = ['Sick Leave', 'Annual Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave', 'Other'];
const TIMEZONES = ['UTC', 'UTC+5:30 (IST)', 'UTC+8 (SGT)', 'UTC-5 (EST)', 'UTC-8 (PST)', 'UTC+1 (CET)', 'UTC+3 (MSK)'];

export const AddTimeOffModal = ({ isOpen, onClose, onSave }) => {
    const { employees } = useRealTime();
    const { addTimeOff } = useAttendanceStore();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showEmpDropdown, setShowEmpDropdown] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        type: 'Days',
        startDate: today,
        endDate: today,
        singleDay: false,
        timeOffType: '',
        timezone: 'UTC',
        note: ''
    });

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    useEffect(() => {
        if (formData.singleDay) setFormData(f => ({ ...f, endDate: f.startDate }));
    }, [formData.singleDay, formData.startDate]);

    const handleSave = async () => {
        if (!formData.timeOffType) { setError('Please choose a Time Off Type'); return; }
        if (!selectedEmployees.length) { setError('Please add at least one employee'); return; }
        setError(null);
        setSaving(true);
        try {
            for (const emp of selectedEmployees) {
                await addTimeOff({
                    employeeId: emp.id,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    type: formData.type,
                    timeOffType: formData.timeOffType,
                    timezone: formData.timezone,
                    note: formData.note,
                    singleDay: formData.singleDay,
                });
            }
            onSave?.();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save time off');
        } finally {
            setSaving(false);
        }
    };

    const toggleEmployee = (emp) => {
        setSelectedEmployees(prev =>
            prev.find(e => e.id === emp.id)
                ? prev.filter(e => e.id !== emp.id)
                : [...prev, emp]
        );
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-700">Add Time Off</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {error && (
                        <div className="px-4 py-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold">{error}</div>
                    )}

                    {/* Teams and Employees */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Teams and Employees</label>
                        <div className="relative">
                            <button
                                onClick={() => setShowEmpDropdown(v => !v)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary-200 text-primary-600 font-bold hover:bg-primary-50 transition-all text-sm"
                            >
                                <Plus size={16} /> Add Employee
                            </button>
                            {showEmpDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowEmpDropdown(false)} />
                                    <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 max-h-48 overflow-y-auto">
                                        {employees.map(emp => (
                                            <button key={emp.id}
                                                onClick={() => toggleEmployee(emp)}
                                                className={`w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold transition-colors hover:bg-slate-50 ${selectedEmployees.find(e => e.id === emp.id) ? 'text-primary-600 bg-primary-50/50' : 'text-slate-700'}`}
                                            >
                                                <div className="h-7 w-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-black text-[10px] shrink-0">
                                                    {(emp.fullName || emp.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                </div>
                                                {emp.fullName || emp.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {selectedEmployees.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedEmployees.map(emp => (
                                    <span key={emp.id} className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-[11px] font-bold text-primary-700">
                                        {emp.fullName || emp.name}
                                        <button onClick={() => toggleEmployee(emp)} className="hover:text-rose-500"><X size={11} /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        {['Days', 'Hours'].map(t => (
                            <button key={t}
                                onClick={() => setFormData(f => ({ ...f, type: t }))}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.type === t ? 'border-primary-500 bg-primary-50/30' : 'border-slate-100'}`}
                            >
                                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.type === t ? 'border-primary-500' : 'border-slate-300'}`}>
                                    {formData.type === t && <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />}
                                </div>
                                <span className="text-sm font-bold text-slate-700">Time Off {t}</span>
                            </button>
                        ))}
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Choose range</label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData(f => ({ ...f, startDate: e.target.value, endDate: f.singleDay ? e.target.value : (e.target.value > f.endDate ? e.target.value : f.endDate) }))}
                                    className="w-full h-11 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-white text-slate-700 font-medium focus:border-primary-500 outline-none transition-all text-sm"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                            {!formData.singleDay && (
                                <>
                                    <span className="text-slate-400 font-bold text-sm">–</span>
                                    <div className="relative flex-1">
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            min={formData.startDate}
                                            onChange={e => setFormData(f => ({ ...f, endDate: e.target.value }))}
                                            className="w-full h-11 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-white text-slate-700 font-medium focus:border-primary-500 outline-none transition-all text-sm"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </>
                            )}
                            <label className="flex items-center gap-2 cursor-pointer shrink-0 group">
                                <div
                                    onClick={() => setFormData(f => ({ ...f, singleDay: !f.singleDay }))}
                                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${formData.singleDay ? 'bg-primary-500 border-primary-500' : 'border-slate-200'}`}
                                >
                                    {formData.singleDay && <X size={12} className="text-white" strokeWidth={4} />}
                                </div>
                                <span className="text-sm font-bold text-slate-700">Single day</span>
                            </label>
                        </div>
                    </div>

                    {/* Time Off Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Time Off Type</label>
                        <div className="relative">
                            <select
                                className="w-full h-11 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-white text-slate-600 font-medium appearance-none focus:border-primary-500 outline-none transition-all text-sm"
                                value={formData.timeOffType}
                                onChange={e => setFormData(f => ({ ...f, timeOffType: e.target.value }))}
                            >
                                <option value="">Choose Type</option>
                                {TIME_OFF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Timezone</label>
                        <div className="relative">
                            <select
                                className="w-full h-11 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-white text-slate-600 font-medium appearance-none focus:border-primary-500 outline-none transition-all text-sm"
                                value={formData.timezone}
                                onChange={e => setFormData(f => ({ ...f, timezone: e.target.value }))}
                            >
                                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Note <span className="text-slate-400 font-normal">(optional)</span></label>
                        <textarea
                            placeholder="Your note here"
                            className="w-full min-h-[80px] p-3 rounded-lg border-2 border-slate-100 bg-white font-medium focus:border-primary-500 outline-none transition-all resize-none text-sm text-slate-700"
                            value={formData.note}
                            onChange={e => setFormData(f => ({ ...f, note: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} disabled={saving}
                        className="px-6 py-2.5 rounded-lg border border-primary-200 text-primary-600 font-black text-xs uppercase tracking-wider hover:bg-primary-50 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving && <Loader size={14} className="animate-spin" />} Save
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
