import React from 'react';
import { Recycle, Shield, User } from 'lucide-react';

interface LoginSelectorProps {
    onSelectMode: (mode: 'user' | 'admin') => void;
}

const LoginSelector: React.FC<LoginSelectorProps> = ({ onSelectMode }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-background-dark p-4 font-sans">
            <div className="w-full max-w-sm mx-auto text-center">
                <div className="flex justify-center items-center gap-3 mb-6">
                    <Recycle className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold text-heading-light dark:text-heading-dark">EcoTrack</h1>
                </div>
                <p className="text-text-light dark:text-text-dark mb-8">Your partner in sustainable waste management.</p>
                
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl w-full space-y-4 animate-scale-in">
                    <h2 className="text-2xl font-semibold text-heading-light dark:text-heading-dark mb-4">Choose Your Login</h2>
                    <button
                        onClick={() => onSelectMode('user')}
                        className="w-full bg-gradient-to-r from-secondary to-slate-700 dark:from-slate-600 dark:to-slate-800 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        <User className="mr-3" /> User Login
                    </button>
                    <button
                        onClick={() => onSelectMode('admin')}
                        className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center text-lg shadow-lg hover:shadow-glow-primary transition-all transform hover:scale-105"
                    >
                        <Shield className="mr-3" /> Admin Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginSelector;
