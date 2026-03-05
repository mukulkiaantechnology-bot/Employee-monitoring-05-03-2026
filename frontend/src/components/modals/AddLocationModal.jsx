import React, { useState } from 'react';
import { X, MapPin, Building2, Home, Share2, Save, Loader2 } from 'lucide-react';
import { useLocationStore } from '../../store/locationStore';
import { logAction } from '../../utils/logAction';
import { cn } from '../../utils/cn';

export function AddLocationModal({ isOpen, onClose }) {
    const { addLocation } = useLocationStore();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        type: 'Office',
        address: '',
        lat: '',
        lng: '',
        attendanceThreshold: 4
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulating API delay
        setTimeout(() => {
            addLocation({
                ...formData,
                lat: parseFloat(formData.lat) || 0,
                lng: parseFloat(formData.lng) || 0,
                attendanceThreshold: parseFloat(formData.attendanceThreshold) || 4
            });
            setLoading(false);
            onClose();
            logAction('Jane Smith', 'Owner', 'Create', 'Location', `Created new location: "${formData.name}" (${formData.type})`);
            // In a real app, toast would be triggered here
        }, 800);
    };

    const typeOptions = [
        { id: 'Office', icon: Building2, desc: 'Corporate HQ or Branch' },
        { id: 'Remote', icon: Home, desc: 'Home or Coworking Space' },
        { id: 'Client Site', icon: Share2, desc: 'External Partner Office' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Add New Location</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Define a new geographic tracking point</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Location Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Name</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. London HQ"
                            className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Type Selector */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Type</label>
                        <div className="grid grid-cols-3 gap-4">
                            {typeOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: opt.id })}
                                    className={cn(
                                        "p-4 rounded-2xl border-2 transition-all text-left group",
                                        formData.type === opt.id 
                                            ? "border-primary-500 bg-primary-50/30 dark:bg-primary-500/10" 
                                            : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                                    )}
                                >
                                    <opt.icon size={20} className={cn("mb-2", formData.type === opt.id ? "text-primary-600" : "text-slate-400")} />
                                    <p className={cn("text-xs font-black uppercase tracking-tight", formData.type === opt.id ? "text-primary-700 dark:text-primary-400" : "text-slate-600 dark:text-slate-300")}>{opt.id}</p>
                                    <p className="text-[9px] font-bold text-slate-400 leading-tight mt-0.5">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                        <input 
                            type="text" 
                            placeholder="Enter physical address..."
                            className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    {/* Coordinates & Threshold */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Latitude</label>
                            <input 
                                type="text" 
                                placeholder="0.0000"
                                className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 font-bold text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                                value={formData.lat}
                                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Longitude</label>
                            <input 
                                type="text" 
                                placeholder="0.0000"
                                className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 font-bold text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                                value={formData.lng}
                                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Threshold (hrs)</label>
                            <input 
                                type="number" 
                                className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 font-bold text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                                value={formData.attendanceThreshold}
                                onChange={(e) => setFormData({ ...formData, attendanceThreshold: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-500 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={loading}
                            type="submit"
                            className="flex-[2] h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl dark:shadow-white/10"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            Save Location
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
