import React, { useState, useEffect } from 'react';
import { 
    X, 
    Key, 
    Copy, 
    Check, 
    AlertCircle, 
    ShieldCheck, 
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { useApiTokenStore } from '../../store/apiTokenStore';
import { logAction } from '../../utils/logAction';
import { cn } from '../../utils/cn';

export function CreateApiTokenModal({ isOpen, onClose, regenerateId = null }) {
    const { createToken, regenerateToken, tempVisibleToken, clearTempToken } = useApiTokenStore();
    const [name, setName] = useState('');
    const [permission, setPermission] = useState('read');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showPlain, setShowPlain] = useState(true);

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setPermission('read');
            clearTempToken();
            setLoading(false);
            setCopied(false);
            setShowPlain(true);
        }
    }, [isOpen, clearTempToken]);

    if (!isOpen) return null;

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Slight delay for premium feel
        setTimeout(async () => {
            if (regenerateId) {
                await regenerateToken(regenerateId);
                logAction('Jane Smith', 'Owner', 'Update', 'API Token', `Regenerated API Token (ID: ${regenerateId.slice(0, 8)}...)`);
            } else {
                await createToken(name, permission);
                logAction('Jane Smith', 'Owner', 'Create', 'API Token', `Created API Token: "${name}" (${permission} access)`);
            }
            setLoading(false);
        }, 1000);
    };

    const handleCopy = () => {
        if (tempVisibleToken) {
            navigator.clipboard.writeText(tempVisibleToken);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const isStep1 = !tempVisibleToken && !loading;
    const isGenerating = loading;
    const isStep2 = !!tempVisibleToken && !loading;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        {regenerateId ? 'Regenerate API Token' : 'Create New API Token'}
                    </h2>
                    <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {isStep1 && (
                        <form onSubmit={handleGenerate} className="space-y-8">
                            {!regenerateId && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name of API Token</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="e.g. Production Mobile App"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Permissions</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={cn(
                                        "relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all",
                                        permission === 'read' 
                                            ? "border-primary-500 bg-primary-50/30 dark:bg-primary-500/5 ring-4 ring-primary-500/5" 
                                            : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                                    )}>
                                        <input 
                                            type="radio" 
                                            name="permission" 
                                            className="hidden" 
                                            checked={permission === 'read'}
                                            onChange={() => setPermission('read')}
                                        />
                                        <div className={cn(
                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                                            permission === 'read' ? "border-primary-500" : "border-slate-300 dark:border-slate-600"
                                        )}>
                                            {permission === 'read' && <div className="h-2.5 w-2.5 rounded-full bg-primary-500 animate-in zoom-in duration-200" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-slate-900 dark:text-white">Read</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">GET only</p>
                                        </div>
                                    </label>

                                    <label className={cn(
                                        "relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all",
                                        permission === 'write' 
                                            ? "border-primary-500 bg-primary-50/30 dark:bg-primary-500/5 ring-4 ring-primary-500/5" 
                                            : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                                    )}>
                                        <input 
                                            type="radio" 
                                            name="permission" 
                                            className="hidden" 
                                            checked={permission === 'write'}
                                            onChange={() => setPermission('write')}
                                        />
                                        <div className={cn(
                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                                            permission === 'write' ? "border-primary-500" : "border-slate-300 dark:border-slate-600"
                                        )}>
                                            {permission === 'write' && <div className="h-2.5 w-2.5 rounded-full bg-primary-500 animate-in zoom-in duration-200" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-slate-900 dark:text-white">Write</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">Full Access</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button 
                                disabled={!regenerateId && !name}
                                type="submit"
                                className="w-full h-16 bg-primary-600 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                            >
                                <Key size={20} />
                                Generate Token
                            </button>
                        </form>
                    )}

                    {isGenerating && (
                        <div className="py-20 flex flex-col items-center justify-center gap-6 animate-pulse">
                            <div className="h-20 w-20 rounded-[2rem] bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                <Loader2 size={40} className="animate-spin" />
                            </div>
                            <p className="text-xs font-black text-primary-600 uppercase tracking-widest">Generating secure credentials...</p>
                        </div>
                    )}

                    {isStep2 && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-500">
                            {/* Visual Asset Simulation */}
                            <div className="relative group perspective-1000">
                                <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full animate-pulse" />
                                <div className="relative bg-primary-50 dark:bg-primary-500/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center border-2 border-primary-500/20 shadow-inner">
                                    <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-primary-100 dark:border-primary-900/30 flex items-center justify-center text-primary-600 mb-6">
                                        <Key size={32} />
                                    </div>
                                    
                                    <div className="relative w-full overflow-hidden truncate px-8 py-4 bg-white dark:bg-slate-950 rounded-2xl border-2 border-primary-500/30 shadow-2xl font-mono text-lg font-black text-primary-600 text-center tracking-tight">
                                        {showPlain ? tempVisibleToken : '••••••••••••••••••••••••••••••••••••'}
                                        <div className="mt-4 flex items-center justify-center gap-4">
                                            <button 
                                                onClick={() => setShowPlain(!showPlain)}
                                                className="text-[10px] font-black uppercase text-slate-400 hover:text-primary-500 transition-colors flex items-center gap-2"
                                            >
                                                {showPlain ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleCopy}
                                        className={cn(
                                            "mt-8 h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all",
                                            copied 
                                                ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                                                : "bg-primary-600 text-white shadow-primary-500/20 hover:scale-105 active:scale-95"
                                        )}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? 'Copied to Clipboard' : 'Copy API Token'}
                                    </button>
                                </div>
                            </div>

                            {/* Warning Banner */}
                            <div className="flex gap-4 p-6 bg-amber-50 dark:bg-amber-500/5 rounded-3xl border border-amber-200 dark:border-amber-500/20 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl -mr-12 -mt-12 rounded-full" />
                                <AlertCircle size={24} className="text-amber-600 shrink-0 mt-0.5" />
                                <div className="space-y-1 relative z-10">
                                    <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest">Security Warning</h4>
                                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                                        For security reasons, we can show you this API token only once. Please copy it and save it somewhere safe. If you lose it, you'll have to regenerate it.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="h-12 px-10 bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
