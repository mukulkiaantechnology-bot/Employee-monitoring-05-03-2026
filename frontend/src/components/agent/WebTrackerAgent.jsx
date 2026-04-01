import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, MonitorCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import screenshotService from '../../services/screenshotService';
import useSocket from '../../hooks/useSocket';
import { toast } from '../../utils/toastManager';

export function WebTrackerAgent() {
    const { user, role, clockIn, clockOut, isClockedIn, isTrackerActive, setTrackerActive } = useAuthStore();
    const [isTracking, setIsTracking] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({ frequency: 10, globalBlur: false });

    const streamRef = useRef(null);
    const intervalRef = useRef(null);
    const videoRef = useRef(null);
    const isStartingRef = useRef(false);
    
    // WebRTC Live Monitoring
    const { socket, on, emit, off } = useSocket();
    const pcRef = useRef(null);

    // Only render for EMPLOYEE role
    if (role !== 'EMPLOYEE') return null;


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

            // Screen sharing check
            if (trackSettings.displaySurface !== 'monitor') {
                track.stop();
                setError('You MUST share your ENTIRE SCREEN. Window or Tab sharing is not allowed.');
                setIsTracking(false);
                setTrackerActive(false);
                return;
            }

            streamRef.current = stream;

            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            videoRef.current = video;

            await new Promise((resolve) => { video.onplaying = resolve; });

            // Trigger Location Permission
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(() => {}, () => {}, { enableHighAccuracy: true });
            }

            setIsTracking(true);
            setTrackerActive(true);
            setError('');

            // Stop when user ends screen share via browser UI
            track.onended = () => stopTracking();

            // Screenshot interval
            captureAndUpload();
            const intervalMs = (settings.frequency || 10) * 60 * 1000;
            intervalRef.current = setInterval(captureAndUpload, intervalMs);

            intervalRef.current = setInterval(captureAndUpload, intervalMs);

        } catch (err) {
            console.error('[WebTrackerAgent] Failed to start tracking:', err);
            setError('Permission denied. Please click "Start Work" and allow screen sharing.');
            setIsTracking(false);
        } finally {
            isStartingRef.current = false;
        }
    };

    const stopTracking = async () => {

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setIsTracking(false);
        setTrackerActive(false);
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
        const handleStartTrackerEvent = () => startTracking().catch(() => {});
        const handleStopTrackerEvent = () => stopTracking();
        
        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('start-web-tracker', handleStartTrackerEvent);
        window.addEventListener('stop-web-tracker', handleStopTrackerEvent);
        
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('start-web-tracker', handleStartTrackerEvent);
            window.removeEventListener('stop-web-tracker', handleStopTrackerEvent);
            stopTracking();
        };
    }, []);

    // Stop if role changes away from EMPLOYEE or if logged out
    useEffect(() => {
        if (role !== 'EMPLOYEE') stopTracking();
    }, [role]);

    // Cleanup tracks only when unmounting, but don't force clockOut if persistent
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    // ─── WebRTC Live Signaling ───────────────────────────────────────────────
    useEffect(() => {
        if (!socket || role !== 'EMPLOYEE' || !isTracking) return;

        const handleLiveRequest = async ({ requesterId }) => {
            console.log('[WebTrackerAgent] Received live request from:', requesterId);
            
            if (pcRef.current) {
                pcRef.current.close();
            }

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            pcRef.current = pc;

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => pc.addTrack(track, streamRef.current));
            }

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    emit('live:candidate', { 
                        targetId: requesterId, 
                        candidate: event.candidate,
                        forEmployeeId: user?.employeeId 
                    });
                }
            };

            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                emit('live:offer', { requesterId, offer });
            } catch (err) {
                console.error('[WebTrackerAgent] WebRTC Offer failed:', err);
            }
        };

        const handleLiveAnswer = async ({ answer }) => {
            if (pcRef.current) {
                try {
                    await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (err) {
                    console.error('[WebTrackerAgent] WebRTC Answer failed:', err);
                }
            }
        };

        const handleIceCandidate = async ({ candidate }) => {
            if (pcRef.current) {
                try {
                    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error('[WebTrackerAgent] WebRTC Candidate failed:', err);
                }
            }
        };

        on('live:request', handleLiveRequest);
        on('live:answer', handleLiveAnswer);
        on('live:candidate', handleIceCandidate);

        return () => {
            off('live:request', handleLiveRequest);
            off('live:answer', handleLiveAnswer);
            off('live:candidate', handleIceCandidate);
            if (pcRef.current) {
                pcRef.current.close();
                pcRef.current = null;
            }
        };
    }, [socket, role, isTracking, emit, on, off]);

    // Removed arbitrary click auto-start
    // The user will explicitly click "Start Tracker" in the WorkSessionBanner now.
    
    // Dynamic screenshot frequency update
    useEffect(() => {
        if (isTracking && intervalRef.current) {
            clearInterval(intervalRef.current);
            const intervalMs = (settings.frequency || 10) * 60 * 1000;
            intervalRef.current = setInterval(captureAndUpload, intervalMs);
        }
    }, [settings.frequency, isTracking]);

    // Use isTrackerActive to hide the global overlay
    const showLoadingOverlay = !isTrackerActive && role === 'EMPLOYEE';

    return (
        <>
            {/* We no longer render the tiny top-left badge; 
                the UI is managed fully by the WorkSessionBanner and this Overlay */}
            
            {/* Compliance Blocking Overlay */}
            {showLoadingOverlay && createPortal(
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500 pointer-events-auto"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
                >
                    <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] max-w-lg w-full mx-4 border border-slate-200 dark:border-slate-800 text-center">
                        <div className="h-24 w-24 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white dark:border-slate-900 shadow-xl">
                            <ShieldAlert size={48} className="text-rose-600 dark:text-rose-400 animate-pulse" />
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                            System Locked
                        </h2>

                        <p className="text-slate-500 dark:text-slate-400 text-base mb-8 leading-relaxed font-medium">
                            To unlock the software and access your dashboard, you must first activate the <strong className="text-slate-900 dark:text-white">Web Tracker Agent</strong> and share your <strong className="text-slate-900 dark:text-white underline decoration-rose-500 decoration-2">ENTIRE SCREEN</strong>.
                        </p>

                        {error && (
                            <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl flex items-center gap-3 text-left animate-in slide-in-from-bottom-3">
                                <ShieldAlert size={24} className="text-rose-500 shrink-0" />
                                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase leading-tight tracking-wider">{error}</span>
                            </div>
                        )}

                        <button
                            onClick={() => startTracking().catch(()=>{})}
                            className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-lg font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(225,29,72,0.3)] transition-all hover:scale-[1.02] active:scale-95 mb-6 flex items-center justify-center gap-3"
                        >
                            <MonitorCheck size={24} />
                            <span>Launch Web Tracker</span>
                        </button>

                        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">
                            <span>Requires Screen Share</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
