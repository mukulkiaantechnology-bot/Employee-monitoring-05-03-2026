import React from 'react';
import { usePrivacyStore } from '../../store/privacyStore';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { BlurPreviewCard } from '../../components/privacy/BlurPreviewCard';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { cn } from '../../utils/cn';

function SectionLabel({ title, description }) {
    return (
        <div className="min-w-[200px] max-w-[220px] shrink-0">
            <h3 className="text-sm font-black text-violet-600 dark:text-violet-400 mb-1">{title}</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}

export function PrivacyOverview() {
    const { privacy, updateField } = usePrivacyStore();

    return (
        <div className="space-y-12">
            {/* ── Activity Logs ─────────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
                <SectionLabel
                    title="Activity Logs"
                    description="Chose whether URLs and Titles will be included in the Activity Logs report."
                />
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm px-6 py-5">
                    <ToggleSwitch
                        checked={privacy.showUrlsInActivityLogs}
                        onChange={(val) => updateField('showUrlsInActivityLogs', val)}
                        label={
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Show <span className="font-black text-slate-900 dark:text-white">URLs</span> and{' '}
                                <span className="font-black text-slate-900 dark:text-white">Titles</span> for{' '}
                                <span className="font-black text-violet-600">Activity Logs</span>
                            </span>
                        }
                    />
                </div>
            </div>

            {/* ── Screenshots Blur ──────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-8">
                <SectionLabel
                    title="Screenshots Blur"
                    description="Set up your preferred screenshot blur level."
                />
                <div className="flex-1 space-y-5">
                    {/* Live blur preview */}
                    <BlurPreviewCard blurLevel={privacy.blurLevel} />

                    {/* Slider */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm px-6 py-5 space-y-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                                Blur Level
                            </p>
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min={0}
                                    max={5}
                                    step={1}
                                    value={privacy.blurLevel}
                                    onChange={(e) => updateField('blurLevel', Number(e.target.value))}
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-violet-600"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                    {[0, 1, 2, 3, 4, 5].map((n) => <span key={n}>{n}</span>)}
                                </div>
                            </div>
                        </div>

                        {/* High blur warning */}
                        {privacy.blurLevel > 3 && (
                            <InfoBanner variant="warning">
                                High blur level may reduce screenshot readability.
                            </InfoBanner>
                        )}

                        {/* Save original checkbox */}
                        <label
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => updateField('saveOriginalScreenshots', !privacy.saveOriginalScreenshots)}
                        >
                            <div className={cn(
                                'h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0',
                                privacy.saveOriginalScreenshots ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600'
                            )}>
                                {privacy.saveOriginalScreenshots && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Save Original Screenshots</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
