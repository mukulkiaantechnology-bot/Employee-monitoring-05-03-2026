import React, { useState, useEffect } from 'react';
import { X, Calendar, Search, ChevronDown, Plus, Info } from 'lucide-react';
import { createPortal } from 'react-dom';

export const AddTimeOffModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        type: 'Days', // 'Days' or 'Hours'
        range: 'Feb 26, 2026 – Feb 27, 2026',
        singleDay: false,
        timeOffType: '',
        timezone: '',
        note: ''
    });

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-700">Add Time Off</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Teams and Employees */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Teams and Employees</label>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-lg border-2 border-primary-200 text-primary-600 font-bold hover:bg-primary-50 transition-all w-fit">
                            <Plus size={18} /> Add
                        </button>
                    </div>

                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setFormData({ ...formData, type: 'Days' })}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.type === 'Days' ? 'border-primary-500 bg-primary-50/30' : 'border-slate-100'}`}
                        >
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.type === 'Days' ? 'border-primary-500' : 'border-slate-300'}`}>
                                {formData.type === 'Days' && <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />}
                            </div>
                            <span className="text-sm font-bold text-slate-700">Time Off Days</span>
                        </button>
                        <button
                            onClick={() => setFormData({ ...formData, type: 'Hours' })}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.type === 'Hours' ? 'border-primary-500 bg-primary-50/30' : 'border-slate-100'}`}
                        >
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.type === 'Hours' ? 'border-primary-500' : 'border-slate-300'}`}>
                                {formData.type === 'Hours' && <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />}
                            </div>
                            <span className="text-sm font-bold text-slate-700">Time Off Hours</span>
                        </button>
                    </div>

                    {/* Range and Single Day */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Choose range</label>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={formData.range}
                                    className="w-full h-12 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-white text-slate-700 font-medium focus:border-primary-500 outline-none transition-all"
                                    readOnly
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all ${formData.singleDay ? 'bg-primary-500 border-primary-500' : 'border-slate-200 group-hover:border-primary-500'}`}>
                                    {formData.singleDay && <X size={14} className="text-white" strokeWidth={4} />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.singleDay}
                                    onChange={(e) => setFormData({ ...formData, singleDay: e.target.checked })}
                                />
                                <span className="text-sm font-bold text-slate-700">Single day</span>
                            </label>
                        </div>
                    </div>

                    {/* Time Off Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Time Off Type</label>
                        <div className="relative">
                            <select
                                className="w-full h-12 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-white text-slate-500 font-medium appearance-none focus:border-primary-500 outline-none transition-all"
                                value={formData.timeOffType}
                                onChange={(e) => setFormData({ ...formData, timeOffType: e.target.value })}
                            >
                                <option value="">Choose Type</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Timezone</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search timezone"
                                className="w-full h-12 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-white font-medium focus:border-primary-500 outline-none transition-all"
                                value={formData.timezone}
                                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Note</label>
                        <textarea
                            placeholder="Your note here"
                            className="w-full min-h-[120px] p-4 rounded-lg border-2 border-slate-100 bg-white font-medium focus:border-primary-500 outline-none transition-all resize-none"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>
                </div>

                {/* Footer (Assumed based on pattern) */}
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-lg border border-primary-200 text-primary-600 font-black text-sm uppercase tracking-wider hover:bg-primary-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-8 py-2.5 rounded-lg bg-indigo-600 text-white font-black text-sm uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
