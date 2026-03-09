import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export function SetupPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Missing invitation token. Please check your email link.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/invitations/complete', {
                token,
                password
            });
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to setup password');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl text-center space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="text-emerald-500" size={64} />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white">Password Set Successfully!</h2>
                    <p className="text-slate-500 dark:text-slate-400">Your account is now active. Redirecting you to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black tracking-tighter dark:text-white mb-2">
                        SETUP YOUR PASSWORD
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs tracking-widest uppercase">
                        Complete your account setup
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !token}
                            className="w-full flex justify-center items-center rounded-xl bg-primary-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Setup'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
