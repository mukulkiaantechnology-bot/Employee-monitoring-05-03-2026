import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { Globe, Clock } from 'lucide-react';

export function LocalizationTab() {
    const { currentUser, updateLocalization } = useUserStore();
    const [formData, setFormData] = useState({
        timeZonePreference: currentUser.timeZonePreference,
        timeFormat: currentUser.timeFormat,
        language: currentUser.language
    });

    const isDirty = formData.timeZonePreference !== currentUser.timeZonePreference ||
                    formData.timeFormat !== currentUser.timeFormat ||
                    formData.language !== currentUser.language;

    const handleSave = () => {
        if (!isDirty) return;
        updateLocalization(formData);
    };

    return (
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Time & Language</h2>
                <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-medium flex gap-3 border border-primary-100 dark:border-primary-900/30">
                    <Globe size={20} className="shrink-0" />
                    <p>Time zone explanation. <a href="#" className="font-bold underline hover:text-primary-800 transition-colors">Learn more.</a></p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Time Zone Preference */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 dark:text-white block">Time Zones</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => setFormData({ ...formData, timeZonePreference: 'organization' })}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                formData.timeZonePreference === 'organization'
                                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 dark:border-primary-500 shadow-sm'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-sm font-bold ${formData.timeZonePreference === 'organization' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>Organizational Time Zone</h3>
                                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.timeZonePreference === 'organization' ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {formData.timeZonePreference === 'organization' && <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />}
                                </div>
                            </div>
                            <p className="text-xs font-bold text-slate-400">UTC-5 (EST)</p>
                        </button>
                        
                        <button
                            onClick={() => setFormData({ ...formData, timeZonePreference: 'employee' })}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                formData.timeZonePreference === 'employee'
                                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 dark:border-primary-500 shadow-sm'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-sm font-bold ${formData.timeZonePreference === 'employee' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>Time Zone of Your Employees</h3>
                                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${formData.timeZonePreference === 'employee' ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {formData.timeZonePreference === 'employee' && <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />}
                                </div>
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Location where your employees work.</p>
                        </button>
                    </div>
                </div>

                {/* Time Format */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 dark:text-white block">Time Format</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                        <button
                            onClick={() => setFormData({ ...formData, timeFormat: '12h' })}
                            className={`px-4 py-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                                formData.timeFormat === '12h'
                                    ? 'border-primary-500 bg-primary-50/50 text-primary-700 dark:bg-primary-900/10 dark:text-primary-400'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                        >
                            <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${formData.timeFormat === '12h' ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                {formData.timeFormat === '12h' && <div className="h-2 w-2 rounded-full bg-primary-500" />}
                            </div>
                            <span className="text-sm font-bold">12 hour</span>
                        </button>
                        
                        <button
                            onClick={() => setFormData({ ...formData, timeFormat: '24h' })}
                            className={`px-4 py-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                                formData.timeFormat === '24h'
                                    ? 'border-primary-500 bg-primary-50/50 text-primary-700 dark:bg-primary-900/10 dark:text-primary-400'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                        >
                            <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${formData.timeFormat === '24h' ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                {formData.timeFormat === '24h' && <div className="h-2 w-2 rounded-full bg-primary-500" />}
                            </div>
                            <span className="text-sm font-bold">24 hour</span>
                        </button>
                    </div>
                </div>

                {/* Language Selection */}
                <div className="space-y-2 max-w-sm">
                    <label className="text-sm font-bold text-slate-900 dark:text-white">Language</label>
                    <div className="relative">
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:border-primary-500 dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="German">German</option>
                            <option value="French">French</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                            isDirty 
                                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30 hover:shadow-lg' 
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                        }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
