import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/authService';
import { ShieldCheck, Lock, Upload, KeyRound, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export function PersonalInfoTab() {
    const { user: authUser, setSession } = useAuthStore();
    const activeUser = authUser || {};
    
    const [formData, setFormData] = useState({
        name: activeUser.fullName || activeUser.name || '',
        email: activeUser.email || '',
        currentPassword: '',
        newPassword: '',
        retypePassword: ''
    });
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, retype: false });
    const [avatarPreview, setAvatarPreview] = useState(activeUser.avatar || null);
    const fileInputRef = React.useRef(null);

    const isDirty = formData.name !== (activeUser.fullName || activeUser.name) || formData.email !== activeUser.email || formData.newPassword.length > 0;
    const isPasswordMatch = formData.newPassword === formData.retypePassword;
    const canSave = isDirty && (formData.newPassword.length === 0 || isPasswordMatch);

    const handleSave = async () => {
        setStatus({ loading: true, error: '', success: '' });
        try {
            // Update Profile if changed
            if (formData.name !== (activeUser.fullName || activeUser.name) || formData.email !== activeUser.email || avatarPreview !== activeUser.avatar) {
                const res = await authService.updateProfile({ 
                    name: formData.name, 
                    email: formData.email,
                    avatar: avatarPreview
                });
                if (res.success) {
                    setSession({ 
                        ...authUser, 
                        fullName: formData.name, 
                        name: formData.name, // Ensure 'name' is also updated for header
                        email: formData.email,
                        avatar: avatarPreview
                    });
                }
            }

            // Change Password if provided
            if (formData.newPassword) {
                if (!formData.currentPassword) {
                    throw new Error('Current password is required to change password');
                }
                await authService.changePassword(formData.currentPassword, formData.newPassword);
            }

            setStatus({ loading: false, error: '', success: 'Changes saved successfully!' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', retypePassword: '' }));
        } catch (err) {
            setStatus({ loading: false, error: err.response?.data?.message || err.message, success: '' });
        }
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
                    {/* Avatar Upload */}
                    <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setAvatarPreview(reader.result);
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <div className="relative group">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="h-20 w-20 rounded-full object-cover border-2 border-primary-500" />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-2xl font-black">
                                    {(formData.name || '??').substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                            >
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

                        <>
                            <div className="space-y-1.5 pt-4">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        placeholder="Required to change password"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-primary-500 dark:text-white transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        placeholder="Enter your new password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-primary-500 dark:text-white transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Retype New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.retype ? "text" : "password"}
                                        placeholder="Retype your new password"
                                        value={formData.retypePassword}
                                        onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
                                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl text-sm font-medium outline-none transition-colors dark:text-white ${
                                            formData.newPassword && !isPasswordMatch ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, retype: !prev.retype }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPasswords.retype ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {formData.newPassword && !isPasswordMatch && (
                                    <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><AlertTriangle size={12} /> Passwords do not match</p>
                                )}
                            </div>
                        </>

                    {status.error && (
                        <p className="text-xs text-red-500 font-bold mt-2">{status.error}</p>
                    )}
                    {status.success && (
                        <p className="text-xs text-emerald-500 font-bold mt-2">{status.success}</p>
                    )}

                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            disabled={!canSave || status.loading}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                canSave && !status.loading
                                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30 hover:shadow-lg' 
                                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                            }`}
                        >
                            {status.loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
