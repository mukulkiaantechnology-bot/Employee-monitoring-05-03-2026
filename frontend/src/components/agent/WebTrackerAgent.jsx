import React, { useState, useEffect, useRef } from 'react';
import { Camera, ShieldAlert, MonitorCheck, MonitorOff, Square } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/authStore';
import screenshotService from '../../services/screenshotService';
import attendanceService from '../../services/attendanceService';

export function WebTrackerAgent() {
    const { user, role } = useAuthStore();
    const [isTracking, setIsTracking] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({ frequency: 10, globalBlur: false });
    const streamRef = useRef(null);
    const intervalRef = useRef(null);
    const videoRef = useRef(null);

    // Only allow for EMPLOYEE role
    if (role !== 'EMPLOYEE') return null;

    const startTracking = async () => {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getDisplayMedia({ 
                video: { 
                    displaySurface: 'monitor', // This favors 'Entire Screen'
                    cursor: 'always'
                }, 
                audio: false 
            });
            streamRef.current = stream;

            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            videoRef.current = video;

            // Wait for video stream to be ready
            await new Promise(resolve => { video.onplaying = resolve });

            // Automated Clock-In
            try {
                await attendanceService.clockIn();
                console.log('[WebTrackerAgent] Automated Clock-In successful.');
            } catch (clkErr) {
                console.warn('[WebTrackerAgent] Clock-In skipped or already active:', clkErr.message);
            }

            setIsTracking(true);

            // Handle when user stops sharing via browser default UI
            stream.getVideoTracks()[0].onended = () => {
                stopTracking();
            };

            // Take first screenshot immediately
            captureAndUpload();
 
            // Set interval based on organization settings
            const intervalMs = (settings.frequency || 10) * 60 * 1000;
            console.log(`[WebTrackerAgent] Starting capture interval: ${settings.frequency} mins`);
            intervalRef.current = setInterval(captureAndUpload, intervalMs);

        } catch (err) {
            console.error('Failed to start tracking:', err);
            setError('Screen recording permission denied.');
            setIsTracking(false);
        }
    };

    const stopTracking = async () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Automated Clock-Out
        try {
            await attendanceService.clockOut();
            console.log('[WebTrackerAgent] Automated Clock-Out successful.');
        } catch (clkErr) {
            console.warn('[WebTrackerAgent] Clock-Out failed or already inactive:', clkErr.message);
        }

        setIsTracking(false);
        // Do not reset error here, as this is usually called when browser stops the stream
    };

    const captureAndUpload = async () => {
        if (!videoRef.current || !streamRef.current) return;

        try {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(async (blob) => {
                if (!blob) return;
                
                const formData = new FormData();
                formData.append('image', blob, `agent-capture-${Date.now()}.png`);
                formData.append('employeeId', user?.employeeId || '');
                formData.append('productivity', 'PRODUCTIVE');
                formData.append('blurred', settings.globalBlur ? 'true' : 'false');
 
                await screenshotService.uploadRealScreenshot(formData);
                console.log('[WebTrackerAgent] Auto-screenshot uploaded successfully.');
            }, 'image/png');
        } catch (err) {
            console.error('[WebTrackerAgent] Error capturing/uploading screenshot:', err);
        }
    };

    useEffect(() => {
        // Fetch organizational settings
        const initSettings = async () => {
            try {
                const res = await screenshotService.getSettings();
                if (res.success && res.data) {
                    setSettings({
                        frequency: res.data.frequency,
                        globalBlur: res.data.globalBlur
                    });
                }
            } catch (err) {
                console.error('[WebTrackerAgent] Failed to fetch settings:', err);
            }
        };

        // Attempt to auto-start on mount (will likely need one user click)
        const tryAutoStart = async () => {
            // Check if we already have a session active (this is tricky in pure JS, but we can try)
            if (!isTracking) {
                // If the user already interacted, this might work
                startTracking().catch(() => {
                    console.log('[WebTrackerAgent] Auto-start blocked by browser. Awaiting user interaction.');
                });
            }
        };

        // Handle window close
        const handleUnload = () => {
            stopTracking();
        };
        window.addEventListener('beforeunload', handleUnload);

        initSettings();
        tryAutoStart();
 
        // Cleanup on unmount
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            stopTracking();
        };
    }, []);

    // Effect to handle dynamic frequency changes while tracking
    useEffect(() => {
        if (isTracking && intervalRef.current) {
            clearInterval(intervalRef.current);
            const intervalMs = (settings.frequency || 10) * 60 * 1000;
            console.log(`[WebTrackerAgent] Frequency changed, restarting interval: ${settings.frequency} mins`);
            intervalRef.current = setInterval(captureAndUpload, intervalMs);
        }
    }, [settings.frequency, isTracking]);

    return (
        <>
            <div className="flex items-center gap-2">
                {error && <span className="text-xs text-red-500 font-bold hidden sm:block">{error}</span>}
                
                {!isTracking ? (
                    <button
                        onClick={startTracking}
                        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all animate-pulse"
                    >
                        <MonitorCheck size={16} />
                        <span className="hidden sm:inline">Initialize Monitoring</span>
                        <span className="sm:hidden">Start</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">Agent Active</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Auto-start Modal Overlay for Employees */}
            {!isTracking && !error && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full mx-4 border border-slate-200 dark:border-slate-800 text-center transform scale-105 transition-transform">
                        <div className="h-20 w-20 bg-primary-50 dark:bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MonitorCheck size={40} className="text-primary-600 dark:text-primary-400 animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">System Initialization</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                            To begin your work session, please grant permission to share your <strong>Entire Screen</strong>. This ensures your productivity is accurately tracked.
                        </p>
                        <button
                            onClick={startTracking}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-base font-black uppercase tracking-widest shadow-xl shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95 mb-4"
                        >
                            Start Work Now
                        </button>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                            Secure • Encrypted • Automated
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-rose-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full mx-4 border border-rose-200 dark:border-rose-800 text-center">
                        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert size={32} className="text-rose-500" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Permission Required</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                            Screen recording was denied or stopped. To continue your shift, choose <strong>"Entire Screen"</strong> in the popup.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={startTracking}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-base font-black uppercase tracking-widest shadow-xl shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
