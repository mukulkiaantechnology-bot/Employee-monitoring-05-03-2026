import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, Lock, Upload, KeyRound, AlertTriangle } from 'lucide-react';

export function PersonalInfoTab() {
    const { currentUser, updateProfile, updatePassword, toggle2FA, connectAccount, disconnectAccount } = useUserStore();
    const { user: authUser } = useAuthStore();
    const [formData, setFormData] = useState({
        name: authUser?.name || currentUser.name,
        email: authUser?.email || currentUser.email,
        newPassword: '',
        retypePassword: ''
    });

    const activeUser = { ...currentUser, ...authUser };

    const isDirty = formData.name !== activeUser.name || formData.email !== activeUser.email || formData.newPassword.length > 0;
    const isPasswordMatch = formData.newPassword === formData.retypePassword;
    const canSave = isDirty && (formData.newPassword.length === 0 || isPasswordMatch);

    const handleSave = () => {
        if (!canSave) return;
        updateProfile({ name: formData.name, email: formData.email });
        if (formData.newPassword) {
            updatePassword(formData.newPassword);
        }
        setFormData(prev => ({ ...prev, newPassword: '', retypePassword: '' }));
    };

    return (
        <div className="max-w-3xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Personal Info Section */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Personal Info</h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Update your basic profile information and security credentials.</p>
                </div>

                <div className="space-y-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    {/* Avatar Upload mockup */}
                    <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-2xl font-black">
                            {activeUser.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-2">
                                <Upload size={14} /> Upload new avatar
                            </button>
                            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">JPG, GIF or PNG. Max size of 800K</p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-primary-500 dark:text-white transition-colors"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-primary-500 dark:text-white transition-colors"
                        />
                    </div>

                    {activeUser.role !== 'Client' && (
                        <>
                            <div className="space-y-1.5 pt-4">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-primary-500 dark:text-white transition-colors"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Retype New Password</label>
                                <input
                                    type="password"
                                    placeholder="Retype your new password"
                                    value={formData.retypePassword}
                                    onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
                                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl text-sm font-medium outline-none transition-colors dark:text-white ${
                                        formData.newPassword && !isPasswordMatch ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                                    }`}
                                />
                                {formData.newPassword && !isPasswordMatch && (
                                    <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><AlertTriangle size={12} /> Passwords do not match</p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                canSave 
                                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30 hover:shadow-lg' 
                                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                            }`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </section>

            {/* Social Accounts Section */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Social Accounts</h2>
                </div>

                <div className="space-y-3">
                    {/* Google */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center bg-red-50 dark:bg-red-900/10 rounded-xl">
                                <span className="font-bold text-red-500">G</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sign in with Google</h3>
                            </div>
                        </div>
                        {currentUser.connectedAccounts.google ? (
                            <button onClick={() => disconnectAccount('google')} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Disconnect</button>
                        ) : (
                            <button onClick={() => connectAccount('google')} className="px-4 py-2 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 rounded-lg transition-colors">Connect</button>
                        )}
                    </div>

                    {/* Slack */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center bg-green-50 dark:bg-green-900/10 rounded-xl">
                                <span className="font-bold text-green-500">#</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sign in with Slack</h3>
                            </div>
                        </div>
                        {currentUser.connectedAccounts.slack ? (
                            <button onClick={() => disconnectAccount('slack')} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Disconnect</button>
                        ) : (
                            <button onClick={() => connectAccount('slack')} className="px-4 py-2 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 rounded-lg transition-colors">Connect</button>
                        )}
                    </div>
                </div>
            </section>

            {/* 2FA Section (Hidden for clients) */}
            {activeUser.role !== 'Client' && (
                <section className="space-y-6">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">Two Factor Authentication</h2>
                    </div>

                    <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        {currentUser.twoFactorEnabled && (
                            <div className="absolute top-0 right-0 p-6 pointer-events-none">
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                    <ShieldCheck size={12} /> Enabled
                                </span>
                            </div>
                        )}
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Enhance Account Security</h3>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 max-w-xl">
                            Two factor authentication provides an extra layer of security to prevent unauthorized access to your account. Additionally to your email address and password, a security code generated on your mobile is needed to sign in.
                        </p>
                        <button
                            onClick={toggle2FA}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                currentUser.twoFactorEnabled
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40'
                                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/30 hover:shadow-lg'
                            }`}
                        >
                            {currentUser.twoFactorEnabled ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
