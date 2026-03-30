import React, { useEffect, useState } from 'react';
import { Download, ShieldCheck, Activity, Monitor, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiClient';
import { toast } from '../utils/toastManager';

export const AgentRequired = () => {
    const { user, setSession } = useAuthStore();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(false);
    const [status, setStatus] = useState('waiting'); // waiting, checking, connected

    const checkStatus = async () => {
        setIsChecking(true);
        try {
            const response = await api.get(`/agent/status/${user.employeeId}`);
            if (response.data.active) {
                setStatus('connected');
                // Refresh session to update agentStatus in store
                const profileRes = await api.get('/auth/me');
                setSession(profileRes.data);
                setTimeout(() => navigate('/employee'), 1500);
            } else {
                setStatus('waiting');
            }
        } catch (error) {
            console.error('Check status error:', error);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(checkStatus, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-lg w-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                                <ShieldCheck size={48} className="text-indigo-600 dark:text-indigo-400 relative" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-black text-center text-slate-900 dark:text-white mb-3">
                            Tracking Agent is Required for System Access
                        </h1>
                        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-sm mx-auto">
                            To ensure security and compliance, you must install the tracking application. You cannot access the dashboard without an active agent.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {[
                                { icon: Monitor, label: 'Screen Monitoring', color: 'text-blue-500 bg-blue-50' },
                                { icon: Activity, label: 'Activity Tracking', color: 'text-emerald-500 bg-emerald-50' },
                                { icon: ShieldCheck, label: 'Secure Connection', color: 'text-amber-500 bg-amber-50' }
                            ].map((f, i) => (
                                <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className={`p-3 rounded-xl ${f.color} dark:bg-opacity-10 mb-3`}>
                                        <f.icon size={24} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{f.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Area */}
                        <div className="space-y-4">
                            <a
                                href="/agent/EMS-Tracker-v1.0.0.exe"
                                download
                                className="w-full py-5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                <Download size={24} className="group-hover:bounce" />
                                Download Tracking Agent (.exe)
                            </a>

                            <div className="flex items-center justify-center gap-4 py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
                                {status === 'connected' ? (
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                        <ShieldCheck size={20} /> Agent Connected! Redirecting...
                                    </div>
                                ) : isChecking ? (
                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                                        <Loader2 size={20} className="animate-spin" /> Checking Connection...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                                        <AlertCircle size={20} /> Waiting for agent connection...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-4">
                            <button
                                onClick={checkStatus}
                                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-2 text-sm"
                            >
                                Manually refresh status <ArrowRight size={16} />
                            </button>
                            
                            <button
                                onClick={async () => {
                                    try {
                                        await api.post('/agent/register', { 
                                            employeeId: user.employeeId, 
                                            deviceId: 'SIMULATOR-' + Math.random().toString(36).substr(2, 9),
                                            systemInfo: { os: 'Windows 11', browser: 'Simulation' } 
                                        });
                                        const profileRes = await api.get('/auth/me');
                                        setSession(profileRes.data);
                                        toast?.success('Simulator agent attached and running!');
                                        setTimeout(() => navigate('/employee'), 1000);
                                    } catch (err) {
                                        console.error(err);
                                        toast?.error('Failed to simulate connection');
                                    }
                                }}
                                className="mt-4 px-4 py-2 border border-dashed border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 transition-all opacity-80 hover:opacity-100"
                            >
                                <Activity size={14} /> Simulate Agent Connection (Testing)
                            </button>
                        </div>
                    </div>
                </div>
                
                <p className="text-center mt-8 text-slate-400 dark:text-slate-600 text-sm">
                    Stuck? Contact system administrator or IT support for assistance.
                </p>
            </div>
        </div>
    );
};
