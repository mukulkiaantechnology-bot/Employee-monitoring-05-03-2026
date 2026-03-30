import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, MonitorCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import screenshotService from '../../services/screenshotService';
import videoService from '../../services/videoService';
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

    // Video recording refs
    const mediaRecorderRef = useRef(null);
    const videoChunksRef = useRef([]);
    const videoIntervalRef = useRef(null); // For chunk-based uploads
    const VIDEO_CHUNK_MINUTES = 5; // Upload a video chunk every 5 minutes

    // Only render for EMPLOYEE role
    if (role !== 'EMPLOYEE') return null;

    // ─── Upload a video blob ───────────────────────────────────────────────────
    const uploadVideoChunk = async (blob) => {
        if (!blob || blob.size === 0) return;
        try {
            const formData = new FormData();
            formData.append('video', blob, `session-${Date.now()}.webm`);
            formData.append('employeeId', user?.employeeId || '');
            await videoService.uploadVideo(formData);
            console.log('[WebTrackerAgent] Video chunk uploaded successfully.');
        } catch (err) {
            console.error('[WebTrackerAgent] Video chunk upload failed:', err);
        }
    };

    // ─── Start MediaRecorder ───────────────────────────────────────────────────
    const startVideoRecording = (stream) => {
        videoChunksRef.current = [];

        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : MediaRecorder.isTypeSupported('video/webm')
            ? 'video/webm'
            : 'video/mp4';

        try {
            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    videoChunksRef.current.push(e.data);
                }
            };

            recorder.start();
            console.log(`[WebTrackerAgent] Video recording started (${mimeType}).`);

            // Every VIDEO_CHUNK_MINUTES, stop current recorder → triggers onstop → upload → restart
            videoIntervalRef.current = setInterval(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop(); // triggers onstop
                }
            }, VIDEO_CHUNK_MINUTES * 60 * 1000);

            recorder.onstop = () => {
                const blob = new Blob(videoChunksRef.current, { type: mimeType });
                videoChunksRef.current = [];
                uploadVideoChunk(blob);

                // Restart recording if we're still tracking
                if (streamRef.current && isTracking) {
                    try {
                        const newRecorder = new MediaRecorder(streamRef.current, { mimeType });
                        mediaRecorderRef.current = newRecorder;
                        newRecorder.ondataavailable = (e) => {
                            if (e.data && e.data.size > 0) videoChunksRef.current.push(e.data);
                        };
                        newRecorder.onstop = recorder.onstop; // recursive chain
                        newRecorder.start();
                    } catch (err) {
                        console.warn('[WebTrackerAgent] Could not restart recorder:', err);
                    }
                }
            };
        } catch (err) {
            console.warn('[WebTrackerAgent] MediaRecorder failed to start:', err);
        }
    };

    // ─── Stop MediaRecorder ────────────────────────────────────────────────────
    const stopVideoRecording = () => {
        if (videoIntervalRef.current) {
            clearInterval(videoIntervalRef.current);
            videoIntervalRef.current = null;
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            // Final chunk — upload after stop
            mediaRecorderRef.current.onstop = () => {
                const mimeType = mediaRecorderRef.current.mimeType || 'video/webm';
                const blob = new Blob(videoChunksRef.current, { type: mimeType });
                videoChunksRef.current = [];
                uploadVideoChunk(blob);
                mediaRecorderRef.current = null;
            };
            mediaRecorderRef.current.stop();
        }
    };

    // ─── Screenshot capture ────────────────────────────────────────────────────
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
                console.log('[WebTrackerAgent] Screenshot uploaded.');
            }, 'image/png');
        } catch (err) {
            console.error('[WebTrackerAgent] Screenshot capture failed:', err);
        }
    };

    // ─── Start tracking ────────────────────────────────────────────────────────
    const startTracking = async () => {
        if (isStartingRef.current || isTracking) return;
        try {
            isStartingRef.current = true;
            setError('');

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: 'monitor', cursor: 'always' },
                audio: false,
            });

            const track = stream.getVideoTracks()[0];
            const trackSettings = track.getSettings();

            if (trackSettings.displaySurface !== 'monitor') {
                track.stop();
                setError('You MUST share your ENTIRE SCREEN. Window or Tab sharing is not allowed.');
                setIsTracking(false);
                return;
            }

            streamRef.current = stream;

            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            videoRef.current = video;

            await new Promise((resolve) => { video.onplaying = resolve; });

            // Clock-In
            try {
                await attendanceService.clockIn();
                console.log('[WebTrackerAgent] Clock-In successful.');
            } catch (clkErr) {
                console.warn('[WebTrackerAgent] Clock-In skipped:', clkErr.message);
            }

            setIsTracking(true);
            setError('');

            // Stop when user ends screen share via browser UI
            track.onended = () => stopTracking();

            // Screenshot interval
            captureAndUpload();
            const intervalMs = (settings.frequency || 10) * 60 * 1000;
            intervalRef.current = setInterval(captureAndUpload, intervalMs);

            // Start video recording
            startVideoRecording(stream);

        } catch (err) {
            console.error('[WebTrackerAgent] Failed to start tracking:', err);
            setError('Permission denied. Please click "Start Work" and allow screen sharing.');
            setIsTracking(false);
        } finally {
            isStartingRef.current = false;
        }
    };

    // ─── Stop tracking ─────────────────────────────────────────────────────────
    const stopTracking = async () => {
        stopVideoRecording();

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        try {
            await attendanceService.clockOut();
            console.log('[WebTrackerAgent] Clock-Out successful.');
        } catch (clkErr) {
            console.warn('[WebTrackerAgent] Clock-Out failed:', clkErr.message);
        }

        setIsTracking(false);
    };

    // ─── Lifecycle effects ─────────────────────────────────────────────────────
    // Settings fetch
    useEffect(() => {
        const init = async () => {
            try {
                const res = await screenshotService.getSettings();
                if (res.success && res.data) {
                    setSettings({ frequency: res.data.frequency, globalBlur: res.data.globalBlur });
                }
            } catch (err) {
                console.error('[WebTrackerAgent] Failed to fetch settings:', err);
            }
        };
        init();
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        const handleUnload = () => stopTracking();
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            stopTracking();
        };
    }, []);

    // Stop if role changes away from EMPLOYEE
    useEffect(() => {
        if (role !== 'EMPLOYEE') stopTracking();
    }, [role]);

    // Auto-start on first interaction
    useEffect(() => {
        if (isTracking) return;
        const handleClick = () => {
            if (!isTracking) startTracking().catch(() => {});
        };
        const timer = setTimeout(() => document.addEventListener('click', handleClick), 1000);
        return () => {
            document.removeEventListener('click', handleClick);
            clearTimeout(timer);
        };
    }, [isTracking]);

    // Dynamic screenshot frequency update
    useEffect(() => {
        if (isTracking && intervalRef.current) {
            clearInterval(intervalRef.current);
            const intervalMs = (settings.frequency || 10) * 60 * 1000;
            intervalRef.current = setInterval(captureAndUpload, intervalMs);
        }
    }, [settings.frequency, isTracking]);

    // ─── Render ────────────────────────────────────────────────────────────────
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

            {/* Compliance Blocking Overlay */}
            {!isTracking && createPortal(
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500 pointer-events-auto"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
                >
                    <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] max-w-lg w-full mx-4 border border-white/20 text-center">
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
                            className="w-full py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] text-xl font-black uppercase tracking-[0.1em] shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.05] active:scale-95 mb-8 flex items-center justify-center gap-4"
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
