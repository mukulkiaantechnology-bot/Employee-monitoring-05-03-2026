import React, { useState } from 'react';
import { X, ChevronDown, Plus } from 'lucide-react';

export function CreateAlertModal({ isOpen, onClose }) {
    const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    const [recipient, setRecipient] = useState('Only Me');
    const [delivery, setDelivery] = useState(['In App']);

    if (!isOpen) return null;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const toggleDelivery = (item) => {
        if (delivery.includes(item)) {
            setDelivery(delivery.filter(d => d !== item));
        } else {
            setDelivery([...delivery, item]);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-700">Create New Alert</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Alert Type */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Alert Type</label>
                        <div className="relative">
                            <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-slate-400">
                                <option>Select alert type from the list</option>
                                <option>Activity Level</option>
                                <option>Productivity Threshold</option>
                                <option>Manual Time Entry</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Name</label>
                        <input
                            type="text"
                            placeholder="Enter a descriptive name for your alert"
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {/* Scope */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Scope</label>
                        <button className="flex items-center gap-2 px-6 py-2.5 border border-indigo-200 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-tight hover:bg-indigo-50 transition-colors">
                            Add scope
                        </button>
                    </div>

                    {/* Days */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Days</label>
                            <button
                                onClick={() => setSelectedDays(days)}
                                className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
                            >
                                Select All
                            </button>
                        </div>
                        <div className="flex gap-2">
                            {days.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`flex-1 h-14 border rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${selectedDays.includes(day)
                                            ? 'border-indigo-500 bg-indigo-50/30'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <div className={`w-4 h-4 border-2 rounded-sm mb-1 flex items-center justify-center transition-colors ${selectedDays.includes(day) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'
                                        }`}>
                                        {selectedDays.includes(day) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase ${selectedDays.includes(day) ? 'text-indigo-600' : 'text-slate-500'}`}>{day}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recipients */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Recipients</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Only Me', 'Specific Users', 'All Admins'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setRecipient(opt)}
                                    className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all ${recipient === opt
                                            ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600'
                                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${recipient === opt ? 'border-indigo-500' : 'border-slate-300'
                                        }`}>
                                        {recipient === opt && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
                                    </div>
                                    <span className="text-xs font-bold">{opt}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Delivery */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Delivery</label>
                        <div className="grid grid-cols-2 gap-4">
                            {['In App', 'Email'].map(item => (
                                <button
                                    key={item}
                                    onClick={() => toggleDelivery(item)}
                                    className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${delivery.includes(item)
                                            ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600'
                                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                                        }`}
                                >
                                    <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${delivery.includes(item) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'
                                        }`}>
                                        {delivery.includes(item) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span className="text-xs font-bold">{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 border border-indigo-200 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-tight hover:bg-indigo-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-tight shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
