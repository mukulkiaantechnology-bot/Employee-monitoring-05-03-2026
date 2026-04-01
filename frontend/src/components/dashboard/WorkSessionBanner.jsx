import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MonitorCheck, ShieldAlert, Clock, Pause, CheckCircle2, Play, LogOut } from 'lucide-react';
import useSocket from '../../hooks/useSocket';
import { toast } from '../../utils/toastManager';

export function WorkSessionBanner() {
    const { user, isClockedIn, clockIn, clockOut, isOnBreak, toggleBreak, activeAttendance, isTrackerActive } = useAuthStore();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { emit } = useSocket();

    // The user's requested flow: 
    // 1. Show Web Tracker Agent status prominently
    // 2. Then show the large Clock In button
    const isAgentActive = isTrackerActive || user?.agentStatus === 'active';

    useEffect(() => {
        let timer;
        if (isClockedIn && activeAttendance?.clockIn && !isOnBreak) {
            // Calculate initial offset
            const start = new Date(activeAttendance.clockIn).getTime();
            setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
            
            // Note: Since we don't currently have a deep break duration tracked in DB here, 
            // a simple UI timer is used. In a prod app, we'd subtract total break durations.
            timer = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isClockedIn, activeAttendance, isOnBreak]);

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    };

    const handleClockIn = async () => {
        setIsLoading(true);
        try {
            await clockIn();
        } catch (err) {
            console.error('Clock in failed', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClockOut = async () => {
        setIsLoading(true);
        try {
            await clockOut();
        } catch (err) {
            console.error('Clock out failed', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleBreak = () => {
        const newStatus = !isOnBreak;
        toggleBreak(newStatus);
        
        // Broadcast the break status via socket so the manager sees it
        if (newStatus) {
            toast.success("Work session paused. You are on break.");
            emit('employee:activity', { activeApp: 'BREAK', activeWindow: 'Break Time', idleTime: 9999 }); // Triggers IDLE/OFFLINE equivalent or we rely on custom socket support
            emit('employee:status_override', { status: 'BREAK' });
        } else {
            toast.success("Work session resumed.");
            emit('employee:status_override', { status: 'ONLINE' });
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6 mb-8 w-full">
            
            {/* The user requested to hide the Agent Status Bar */}

            {/* 2. Clock In / Session Controls */}
            {!isClockedIn ? (
                <button
                    onClick={handleClockIn}
                    disabled={isLoading}
                    className={`w-full py-6 flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-gradient-to-tr from-primary-600 to-primary-500 text-white font-black uppercase tracking-widest shadow-xl shadow-primary-600/20 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
                >
                    {isLoading ? (
                        <div className="h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Clock size={32} />
                            <span className="text-xl">Clock In to Start Work</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                            {isOnBreak ? "Session Paused" : "Total Work Hours"}
                        </span>
                        <div className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                            {formatTime(elapsedSeconds)}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleToggleBreak}
                            className={`flex-1 md:flex-none min-w-[140px] flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold uppercase tracking-widest transition-all ${isOnBreak ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'}`}
                        >
                            {isOnBreak ? <Play size={20} /> : <Pause size={20} />}
                            {isOnBreak ? "Resume" : "Break"}
                        </button>
                        <button
                            onClick={handleClockOut}
                            className="flex-1 md:flex-none min-w-[140px] flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-rose-600 text-white font-bold uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all"
                        >
                            <LogOut size={20} />
                            Clock Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
