import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Play, Shield, Monitor, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export const WorkSessionRequired = () => {
    const { clockIn, user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleClockIn = async () => {
        setLoading(true);
        try {
            await clockIn();
        } catch (error) {
            console.error('Clock-in failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative w-full max-w-2xl">
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl overflow-hidden group">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 mb-8 animate-bounce">
                            <Clock size={40} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
                            Work Session <span className="text-indigo-400">Required</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-sm md:text-lg max-w-md mx-auto leading-relaxed">
                            Hello, <span className="text-white">{user?.fullName || 'Employee'}</span>. Please start your work session to access the enterprise dashboard.
                        </p>
                    </div>

                    {/* Features/Reminders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                                <Shield size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliance</span>
                                <span className="text-xs font-bold text-white">Encrypted Monitoring</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                                <Monitor size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent</span>
                                <span className="text-xs font-bold text-white">Ensure Agent is Running</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleClockIn}
                        disabled={loading}
                        className={cn(
                            "group relative w-full h-16 md:h-20 bg-white text-slate-900 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all duration-300 overflow-hidden flex items-center justify-center gap-4",
                            loading ? "opacity-70 cursor-wait" : "hover:scale-[1.02] hover:bg-indigo-500 hover:text-white active:scale-95 shadow-2xl shadow-white/10"
                        )}
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Play size={24} fill="currentColor" className="transition-transform group-hover:scale-110" />
                                <span>Start Work Session</span>
                            </>
                        )}
                    </button>

                    {/* Warning Footer */}
                    <div className="mt-8 flex items-start gap-3 justify-center text-rose-400">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center">
                            Starting a session activates automated screenshot & productivity tracking.
                        </span>
                    </div>
                </div>

                {/* Decorative Dots */}
                <div className="absolute -top-4 -right-4 h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-purple-500/10 rounded-full blur-3xl" />
            </div>
        </div>
    );
};
