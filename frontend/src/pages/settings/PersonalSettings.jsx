import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PersonalInfoTab } from '../../components/settings/PersonalInfoTab';
import { LocalizationTab } from '../../components/settings/LocalizationTab';

export function PersonalSettings() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'info';

    const handleTabChange = (tab) => {
        setSearchParams({ tab });
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8">
            <div className="py-8 mb-4 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Personal Settings</h1>

                {/* Tabs */}
                <div className="flex items-center gap-8 mt-6">
                    <button
                        onClick={() => handleTabChange('info')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-all ${currentTab === 'info'
                                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }`}
                    >
                        Info
                    </button>
                    {/* <button
                        onClick={() => handleTabChange('localization')}
                        className={`pb-4 text-sm font-bold border-b-2 transition-all ${
                            currentTab === 'localization'
                                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                        }`}
                    >
                        Localization
                    </button> */}
                </div>
            </div>

            <div className="mt-8">
                {currentTab === 'info' ? <PersonalInfoTab /> : <LocalizationTab />}
            </div>
        </div>
    );
}
