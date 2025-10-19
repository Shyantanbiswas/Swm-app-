import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Recycle, Smartphone, KeyRound, ArrowRight, Info, Mail, ArrowLeft, Loader2, User as UserIcon } from 'lucide-react';

type AuthMode = 'login' | 'signup';

interface AuthFlowProps {
    onBack: () => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ onBack }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const auth = useAuth();
    
    const isEmail = identifier.includes('@');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await auth.login(identifier, password, rememberMe);
        setIsLoading(false);
        if (!result.success) {
            setError(result.message || 'Login failed. Please try again.');
        }
    };
    
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setIsLoading(true);
        const result = await auth.signup(name, identifier, password);
        setIsLoading(false);
        if (!result.success) {
            setError(result.message || 'Sign up failed. Please try again.');
        }
    }
    
    const resetForm = () => {
        setIdentifier('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setError('');
        setRememberMe(true);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-background-dark p-4 font-sans">
            <div className="w-full max-w-sm mx-auto text-center">
                <div className="flex justify-center items-center gap-3 mb-6">
                    <Recycle className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold text-heading-light dark:text-heading-dark">EcoTrack</h1>
                </div>
                <p className="text-text-light dark:text-text-dark mb-8">Your partner in sustainable waste management.</p>
                
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl w-full relative">
                    <button onClick={onBack} className="absolute top-4 left-4 text-slate-500 hover:text-primary">
                        <ArrowLeft size={24}/>
                    </button>
                    
                    <div className="flex items-center justify-center p-1 rounded-full bg-slate-100 dark:bg-slate-700 mb-6">
                        <button onClick={() => { setMode('login'); resetForm(); }} className={`w-1/2 p-2 rounded-full font-semibold text-sm transition-colors ${mode === 'login' ? 'bg-white dark:bg-slate-800 shadow text-primary' : 'text-slate-500'}`}>Login</button>
                        <button onClick={() => { setMode('signup'); resetForm(); }} className={`w-1/2 p-2 rounded-full font-semibold text-sm transition-colors ${mode === 'signup' ? 'bg-white dark:bg-slate-800 shadow text-primary' : 'text-slate-500'}`}>Sign Up</button>
                    </div>

                    {mode === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                            <h2 className="text-2xl font-semibold text-heading-light dark:text-heading-dark">Welcome Back!</h2>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Email or Mobile" className="w-full p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-slate-100 dark:bg-slate-700"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-light dark:text-text-dark">
                                    Remember me
                                </label>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg shadow-lg hover:shadow-glow-primary transition-all transform hover:scale-105 disabled:opacity-50">
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
                            </button>
                             <p className="text-xs text-slate-500 pt-2">Forgot password? Please contact the administrator for assistance.</p>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
                            <h2 className="text-2xl font-semibold text-heading-light dark:text-heading-dark">Create Account</h2>
                             <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Email or Mobile" className="w-full p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                             <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg shadow-lg hover:shadow-glow-primary transition-all transform hover:scale-105 disabled:opacity-50">
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                            </button>
                        </form>
                    )}
                     {error && <p className="text-red-500 text-sm mt-4 animate-fade-in">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default AuthFlow;