import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, Shield, Users, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const from = location.state?.from?.pathname || '/';

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address first.');
            return;
        }
        setError('');
        setInfo('Sending reset link...');
        try {
            await authService.forgotPassword(email);
            setInfo('If an account exists, a reset link has been sent to your email.');
        } catch (err) {
            setError('Failed to process request.');
            setInfo('');
        }
    };

    const handleQuickLogin = async (role) => {
        setIsLoading(true);
        setError('');
        try {
            // In a real app, quick login would still hit a test account or specific dummy endpoint
            // For now, we simulate with a known test email or just the role name if seeded
            const email = `${role.toLowerCase()}@example.com`;
            const password = '123456';
            await login(email, password);
            navigate(`/${role.toLowerCase()}`, { replace: true });
        } catch (err) {
            setError(err.message || 'Quick login failed. Make sure the database is seeded.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login(email, password);
            // Redirection based on role: ADMIN -> /admin, etc.
            const rolePath = data.user.role.toLowerCase();
            navigate(`/${rolePath}`, { replace: true });
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center group cursor-default">
                    <div className="flex flex-col items-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent leading-none transition-transform duration-500 group-hover:scale-110">
                            EMPLOYEE<br />
                            MANAGEMENT
                        </h1>
                        <div className="h-1.5 w-24 bg-primary-600 mt-4 rounded-full transition-all duration-500 group-hover:w-48 opacity-30"></div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase text-xs">Sign in to your portal</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                <button 
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                                >
                                    Forgot Password?
                                </button>
                            </div>
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}

                        {info && (
                            <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                {info}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative flex w-full justify-center rounded-xl bg-primary-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 font-bold">Quick Demo Access</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => handleQuickLogin('Admin')}
                            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-3 text-center transition-all hover:bg-primary-50 hover:border-primary-200 dark:border-slate-800 dark:hover:bg-primary-900/20 dark:hover:border-primary-800 group"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 transition-transform group-hover:scale-110">
                                <Shield size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 group-hover:text-primary-600">Admin</span>
                        </button>

                        <button
                            onClick={() => handleQuickLogin('Manager')}
                            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-3 text-center transition-all hover:bg-emerald-50 hover:border-emerald-200 dark:border-slate-800 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-800 group"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 transition-transform group-hover:scale-110">
                                <Users size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 group-hover:text-emerald-600">Manager</span>
                        </button>

                        <button
                            onClick={() => handleQuickLogin('Employee')}
                            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-3 text-center transition-all hover:bg-amber-50 hover:border-amber-200 dark:border-slate-800 dark:hover:bg-amber-900/20 dark:hover:border-amber-800 group"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 transition-transform group-hover:scale-110">
                                <User size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 group-hover:text-amber-600">Employee</span>
                        </button>
                    </div>

                    {/* <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <a href="#" className="font-bold text-primary-600 hover:text-primary-700">Sign Up</a>
                    </p> */}
                </div>
            </div>
        </div>
    );
}
