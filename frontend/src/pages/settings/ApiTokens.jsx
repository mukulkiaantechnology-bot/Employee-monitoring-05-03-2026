import React, { useState } from 'react';
import {
    Plus,
    Info,
    Copy,
    Trash2,
    RefreshCw,
    Search,
    Check,
    ChevronLeft,
    ShieldCheck,
    Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApiTokenStore } from '../../store/apiTokenStore';
import { CreateApiTokenModal } from '../../components/modals/CreateApiTokenModal';
import { cn } from '../../utils/cn';

export function ApiTokens() {
    const navigate = useNavigate();
    const { apiTokens, deleteToken } = useApiTokenStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [regenerateId, setRegenerateId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopyMasked = (last4, id) => {
        const masked = `sk_live_*************${last4}`;
        navigator.clipboard.writeText(masked);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this API token? Any applications using this token will lose access immediately.')) {
            deleteToken(id);
        }
    };

    const handleRegenerate = (id) => {
        setRegenerateId(id);
        setIsModalOpen(true);
    };

    const handleCreateNew = () => {
        setRegenerateId(null);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate('/settings')}>Settings</span>
                            <span>/</span>
                            <span className="text-primary-600">API Tokens</span>
                        </nav>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">API Tokens</h1>
                    </div>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-primary-700 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={18} />
                    Create New Token
                </button>
            </div>

            {/* Info Banner */}
            <div className="flex items-center gap-4 p-6 bg-primary-50/50 dark:bg-primary-900/10 rounded-3xl border border-primary-100/50 dark:border-primary-500/20 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />
                <div className="h-12 w-12 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-600 shrink-0">
                    <Info size={24} />
                </div>
                <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Security & Rate Limiting</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        The number of requests per organization is limited to 300 per minute. Use private tokens to authenticate your requests against the Insightful API.
                    </p>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                {apiTokens.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center">
                        <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
                            <Lock size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Data</h3>
                        <p className="text-slate-400 font-bold text-sm max-w-sm">
                            You haven't created any API tokens yet. Generate a token to start integrating with our developer tools.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-10 py-6">Name</th>
                                    <th className="px-10 py-6">Token</th>
                                    <th className="px-10 py-6">Created</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {apiTokens.map((token) => (
                                    <tr key={token.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                                                    token.permission === 'write' ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600" : "bg-primary-50 dark:bg-primary-500/10 text-primary-600"
                                                )}>
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{token.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{token.permission} Access</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3 font-mono text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 w-fit px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                                <span className="opacity-50">sk_live_</span>
                                                <span className="tracking-tighter">*************</span>
                                                <span className="font-black text-slate-900 dark:text-slate-200">{token.last4}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {new Date(token.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
                                                {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleCopyMasked(token.last4, token.id)}
                                                    className={cn(
                                                        "h-10 w-10 flex items-center justify-center rounded-xl transition-all active:scale-90",
                                                        copiedId === token.id ? "bg-emerald-500 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600"
                                                    )}
                                                    title="Copy masked token"
                                                >
                                                    {copiedId === token.id ? <Check size={18} /> : <Copy size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleRegenerate(token.id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary-500 transition-all active:scale-90"
                                                    title="Regenerate token"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(token.id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 transition-all active:scale-90"
                                                    title="Delete token"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <CreateApiTokenModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                regenerateId={regenerateId}
            />
        </div>
    );
}
