import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, CheckCircle, XCircle, Flame, LogOut, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StaffDashboardProps {
    locationStatus: string;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ locationStatus }) => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    
    const isWorkdayOver = () => {
        const now = new Date();
        return now.getHours() >= 16; // 4 PM or later (16:00)
    }
    
    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'captain': return t('role_captain');
            case 'sanitaryworker': return t('role_sanitaryworker');
            case 'employee': return t('role_employee');
            default: return role;
        }
    }

    const getAttendanceIcon = () => {
        if (user?.attendanceStatus === 'present') {
            return <CheckCircle className="text-success w-8 h-8" />;
        }
        if (user?.attendanceStatus === 'absent') {
            return <XCircle className="text-red-500 w-8 h-8" />;
        }
        return <Clock className="text-slate-500 w-8 h-8" />;
    };

    if (!user) return null;

    return (
        <div className="flex flex-col items-center text-center h-full animate-fade-in-up">
            <div className="w-full space-y-4">
                 <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4 rounded-lg shadow-md text-center">
                    <h3 className="font-semibold text-text-light dark:text-text-dark text-md">
                        {t('yourRole')}
                    </h3>
                    <p className="font-bold text-2xl text-primary capitalize mt-1">{getRoleDisplayName(user.role)}</p>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold text-heading-light dark:text-heading-dark flex items-center justify-center text-lg">
                            <Clock className="mr-2" /> Attendance
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mt-2 text-xl">
                            {getAttendanceIcon()}
                            <p className="font-bold capitalize">{user?.attendanceStatus}</p>
                        </div>
                        {user?.lastLoginTime && <p className="text-xs text-slate-500 mt-1">In: {user.lastLoginTime.toLocaleTimeString()}</p>}
                    </div>
                     <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold text-heading-light dark:text-heading-dark flex items-center justify-center text-lg">
                            <Flame className="mr-2 text-orange-500" /> Streak
                        </h3>
                        <div className="text-center mt-2">
                            <p className="text-3xl font-bold text-orange-500">{user?.loginStreak || 0} Day{user?.loginStreak !== 1 && 's'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-heading-light dark:text-heading-dark flex items-center justify-center text-lg">
                        <MapPin className="mr-2" /> Location Status
                    </h3>
                    <p className="text-sm text-text-light dark:text-text-dark mt-2 px-2">{locationStatus}</p>
                </div>
            </div>

            <div className="mt-auto w-full pt-6">
                {isWorkdayOver() && <p className="text-sm text-success mb-2 font-semibold animate-pulse">Workday complete. You may log out.</p>}
                <button 
                    onClick={logout} 
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 rounded-lg flex items-center justify-center text-lg shadow-lg transition-transform transform hover:scale-105"
                >
                    <LogOut className="mr-3" /> End Day & Logout
                </button>
                <p className="text-xs text-slate-400 mt-4 px-4">
                    Note: Location tracking is active. This app needs to remain open in your browser to function correctly. Closing the app will stop location updates.
                </p>
            </div>
        </div>
    );
};

export default StaffDashboard;
