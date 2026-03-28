import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Camera, ShieldAlert, MonitorCheck } from 'lucide-react';
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
    const isStartingRef = useRef(false);

    // Only allow for EMPLOYEE role
    if (role !== 'EMPLOYEE') return null;

    const startTracking = async () => {
        if (isStartingRef.current || isTracking) return;
        
        try {
            isStartingRef.current = true;
            setError('');
            const stream = await navigator.mediaDevices.getDisplayMedia({ 
                video: { 
                    displaySurface: 'monitor', 
                    cursor: 'always'
                }, 
                audio: false 
            });

            // Validate "Entire Screen" selection
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            
            if (settings.displaySurface !== 'monitor') {
                track.stop();
                setError('You MUST share your ENTIRE SCREEN to continue. Window or Tab sharing is not allowed.');
                setIsTracking(false);
                return;
            }

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
            setError(''); // Clear any previous errors

            // Handle when user stops sharing via browser default UI
            track.onended = () => {
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
            setError('Permission denied. Please click "Start Work" and allow screen sharing.');
            setIsTracking(false);
        } finally {
            isStartingRef.current = false;
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

    // Initial settings fetch - only runs once
    useEffect(() => {
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
        initSettings();
    }, []);

    // Global persistence lifecycle - only runs on mount/unmount
    useEffect(() => {
        const handleUnload = () => stopTracking();
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            stopTracking(); // Only stop when component actually unmounts
        };
    }, []);

    // Explicit Logout/Role-Change stop
    useEffect(() => {
        if (role !== 'EMPLOYEE') {
            stopTracking();
        }
    }, [role]);

    // Interaction trigger - only runs when NOT tracking
    useEffect(() => {
        if (isTracking) return;

        const handleFirstInteraction = () => {
            if (!isTracking) {
                console.log('[WebTrackerAgent] User interacted. Attempting to start tracking...');
                startTracking().catch(() => {
                    // Fail silently or show error in overlay
                });
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener('click', handleFirstInteraction);
        }, 1000); // Small delay to avoid triggering on the click that mounts the component

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            clearTimeout(timer);
        };
    }, [isTracking]);

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
                {isTracking ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Agent Active</span>
                    </div>
                ) : (
                    error && <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest animate-pulse">{error}</span>
                )}
            </div>

            {/* Compliance Blocking Overlay - Global Portal */}
            {!isTracking && createPortal(
                <div 
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500 pointer-events-auto"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
                >
                    <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] max-w-lg w-full mx-4 border border-white/20 text-center transform scale-100 transition-all">
                        <div className="h-28 w-28 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-10 border-8 border-slate-100 dark:border-slate-800 shadow-2xl">
                            <MonitorCheck size={56} className="text-white animate-pulse" />
                        </div>
                        
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                            Work Session <br/> Required
                        </h2>
                        
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 leading-relaxed font-semibold">
                            To continue your shift, please share your <strong className="text-slate-900 dark:text-white underline decoration-primary-500 decoration-4">ENTIRE SCREEN</strong>. 
                            <br/><span className="text-sm mt-3 block opacity-80 font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Software is locked for safety</span>
                        </p>

                        {error && (
                            <div className="mb-10 p-5 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-200 dark:border-rose-500/20 rounded-3xl flex items-center gap-4 text-left animate-in slide-in-from-bottom-3 shadow-lg">
                                <ShieldAlert size={28} className="text-rose-500 shrink-0" />
                                <span className="text-sm font-black text-rose-700 dark:text-rose-400 leading-tight tracking-tight uppercase">{error}</span>
                            </div>
                        )}

                        <button
                            onClick={startTracking}
                            className="w-full py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] text-xl font-black uppercase tracking-[0.1em] shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.05] active:scale-95 mb-8 group flex items-center justify-center gap-4"
                        >
                            <MonitorCheck size={28} />
                            <span>Start Work Now</span>
                        </button>

                        <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 uppercase font-black tracking-[0.25em] opacity-40">
                            <span>Secure</span>
                            <div className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                            <span>Monitor</span>
                            <div className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                            <span>Compliant</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
