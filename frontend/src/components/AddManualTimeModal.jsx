import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Info, Search, ChevronDown, MapPin } from 'lucide-react';
import { createPortal } from 'react-dom';
import { TIMEZONE_OPTIONS } from '../store/organizationStore';

export const AddManualTimeModal = ({ isOpen, onClose, onSave, employees = [] }) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const [formData, setFormData] = useState({
        employeeId: '',
        startDate: formattedDate,
        startTime: '09:00 AM',
        endDate: formattedDate,
        endTime: '05:00 PM',
        timezone: 'UTC+5:30 (IST)',
        type: 'Regular',
        location: 'Office',
        projectTask: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-2xl w-full max-w-[500px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-slate-700 dark:text-slate-200">Add Manual Time</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Employee */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Employee</label>
                        <div className="relative">
                            <select
                                className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium appearance-none focus:border-primary-500 outline-none transition-all"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            >
                                <option value="">Select employee from the list</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.fullName || emp.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    {/* Date and Time Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-bold focus:border-primary-500 outline-none transition-all"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-bold focus:border-primary-500 outline-none transition-all"
                                />
                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">End Date</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-bold focus:border-primary-500 outline-none transition-all"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">End Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-bold focus:border-primary-500 outline-none transition-all"
                                />
                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            Employee's Timezone <Info size={14} className="text-slate-400" />
                        </label>
                        <div className="relative">
                            <select
                                className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium appearance-none focus:border-primary-500 outline-none transition-all"
                                value={formData.timezone}
                                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                            >
                                <option value="">Select timezone from the list</option>
                                {TIMEZONE_OPTIONS.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Type</label>
                        <div className="relative">
                            <select
                                className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium appearance-none focus:border-primary-500 outline-none transition-all"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="">Select type from the list</option>
                                <option value="Regular">Regular</option>
                                <option value="Overtime">Overtime</option>
                                <option value="Sickness">Sickness</option>
                                <option value="Vacation">Vacation</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            Employee's Location <Info size={14} className="text-slate-400" />
                        </label>
                        <div className="relative">
                            <select
                                className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium appearance-none focus:border-primary-500 outline-none transition-all"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            >
                                <option value="">Select location from the list</option>
                                <option value="Office">Office</option>
                                <option value="Remote">Remote</option>
                                <option value="On-site">On-site</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Time Entries Info */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            Time entries <Info size={14} className="text-slate-400" />
                        </label>
                        <div className="p-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg text-center">
                            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Please select the required fields to be able to check time entries.</p>
                        </div>
                    </div>

                    {/* Project and Tasks */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Project and tasks (optional)</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search project or task"
                                className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium dark:text-slate-200 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                value={formData.projectTask}
                                onChange={(e) => setFormData({ ...formData, projectTask: e.target.value })}
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                        <textarea
                            placeholder="Write a more detailed description..."
                            className="w-full min-h-[120px] p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium dark:text-slate-200 focus:border-primary-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-lg border border-primary-200 dark:border-primary-800/50 text-primary-600 dark:text-primary-400 font-black text-sm uppercase tracking-wider hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
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
