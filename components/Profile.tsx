import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, Shield, Save, CheckCircle, Camera, Upload, X, Mail, Globe, AlertTriangle, KeyRound, ChevronRight, MessageSquareWarning, HelpCircle, Bell, PenSquare, LifeBuoy } from 'lucide-react';
import GramPanchayatSelector from './GramPanchayatSelector';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { useLanguage } from '../context/LanguageContext';
import type { View } from '../types';
import { ViewType } from '../types';
import { SUPPORT_EMAIL } from '../constants';

interface ProfileComponentProps {
    setCurrentView: (view: View) => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ setCurrentView }) => {
    const { user, updateUserName, updateUserProfilePicture, updateUserEmail, updateUserGramPanchayat, forcePasswordChange, changePassword, togglePushNotifications } = useAuth();
    const { messages } = useData();
    const { t } = useLanguage();

    const [isEditing, setIsEditing] = useState(false);
    
    // State for user details
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [gramPanchayat, setGramPanchayat] = useState(user?.gramPanchayat || '');
    const [isSaved, setIsSaved] = useState(false);

    // State for password change
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isPanchayatMissing = !user?.gramPanchayat;
    
    const unreadCount = useMemo(() => {
        if (!user) return 0;
        return messages.filter(m => m.recipientId === user.householdId && !m.read).length;
    }, [user, messages]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email || '');
            setGramPanchayat(user.gramPanchayat || '');
        }
    }, [user]);

    useEffect(() => {
        if (isPanchayatMissing || forcePasswordChange) {
            setIsEditing(true);
            if(forcePasswordChange) {
                setIsChangingPassword(true);
            }
        }
    }, [isPanchayatMissing, forcePasswordChange]);

    const handleSaveDetails = (e: React.FormEvent) => {
        e.preventDefault();
        let changed = false;
        if (name.trim() && user && name.trim() !== user.name) {
            updateUserName(name.trim());
            changed = true;
        }
        if (user && email.trim() !== (user.email || '')) {
            updateUserEmail(email.trim());
            changed = true;
        }
        if (isPanchayatMissing && gramPanchayat) {
            updateUserGramPanchayat(gramPanchayat);
            changed = true;
        }

        if (changed) {
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
                setIsEditing(false);
            }, 2000);
        } else {
            setIsEditing(false);
        }
    };
    
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        if (newPassword !== confirmNewPassword) {
            setPasswordError(t('passwordMismatchError'));
            return;
        }
        
        const result = await changePassword(currentPassword, newPassword);
        if (result.success) {
            setPasswordSuccess(t('passwordChangedSuccess'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setTimeout(() => {
                setPasswordSuccess('');
                setIsChangingPassword(false);
                if (!isPanchayatMissing) setIsEditing(false);
            }, 3000);
        } else {
            setPasswordError(result.message || 'An error occurred.');
        }
    };


    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if(reader.result) {
                    updateUserProfilePicture(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }
    
    const hasDetailsChanges = (name.trim() && name.trim() !== user.name) || (email.trim() !== (user.email || '')) || (isPanchayatMissing && !!gramPanchayat);

    const ProfileHeader = () => (
        <div className="flex flex-col items-center space-y-2 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md border border-border-light dark:border-border-dark animate-fade-in-up">
            <div className="relative p-1 bg-gradient-to-r from-primary to-accent rounded-full">
                {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-card-light dark:border-card-dark" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-card-light dark:border-card-dark">
                        <User size={48} className="text-slate-400 dark:text-slate-500" />
                    </div>
                )}
            </div>
            <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark">{user.name}</h2>
            <p className="text-sm text-text-light dark:text-text-dark font-mono">{user.householdId}</p>
        </div>
    );

    const MenuButton: React.FC<{icon: React.ElementType, label: string, onClick: () => void, badgeCount?: number}> = ({ icon: Icon, label, onClick, badgeCount }) => (
         <button onClick={onClick} className="w-full flex items-center p-4 bg-card-light dark:bg-card-dark rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-border-light dark:border-border-dark">
            <Icon className="mr-4 text-primary" size={22} />
            <span className="flex-grow text-left font-semibold text-heading-light dark:text-heading-dark">{label}</span>
            {badgeCount && badgeCount > 0 && (
              <span className="w-6 h-6 text-xs bg-red-500 text-white font-bold rounded-full flex items-center justify-center">
                  {badgeCount > 9 ? '9+' : badgeCount}
              </span>
            )}
            <ChevronRight className="ml-2 text-slate-400" size={20} />
        </button>
    );

    const ToggleButton: React.FC<{icon: React.ElementType, label: string, isEnabled: boolean, onToggle: () => void}> = ({ icon: Icon, label, isEnabled, onToggle }) => (
        <div className="w-full flex items-center p-4 bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark">
            <Icon className="mr-4 text-primary" size={22} />
            <span className="flex-grow text-left font-semibold text-heading-light dark:text-heading-dark">{label}</span>
            <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`} aria-pressed={isEnabled}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
        </div>
    );


    if(isEditing) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark animate-fade-in-down">Edit Profile</h2>
                 {isPanchayatMissing && (
                    <div className="bg-amber-500/10 dark:bg-amber-500/20 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300 p-4 rounded-r-lg shadow-md" role="alert">
                        <div className="flex items-center">
                            <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0"/>
                            <div>
                                <p className="font-bold">Action Required</p>
                                <p className="text-sm">Please select your Gram Panchayat to continue using the app.</p>
                            </div>
                        </div>
                    </div>
                )}
                 {forcePasswordChange && !isChangingPassword && (
                    <div className="bg-red-500/10 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-r-lg shadow-md" role="alert">
                        <div className="flex items-center">
                            <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0"/>
                            <div>
                                <p className="font-bold">{t('securityAlert')}</p>
                                <p className="text-sm">{t('weakPasswordWarning')}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md border border-border-light dark:border-border-dark animate-fade-in-up">
                    <form onSubmit={handleSaveDetails} className="space-y-4">
                        <div className="text-center mb-4">
                            <div className="relative inline-block">
                                <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&size=128`} alt="Profile" className="w-24 h-24 rounded-full object-cover"/>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full hover:bg-primary-dark">
                                    <Camera size={16} />
                                </button>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 pl-10 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 pl-10 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg"/>
                            </div>
                        </div>
                        <div>
                        <label htmlFor="gramPanchayat" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Gram Panchayat</label>
                        {isPanchayatMissing ? (
                            <GramPanchayatSelector value={gramPanchayat} onChange={(e) => setGramPanchayat(e.target.value)} required />
                        ) : (
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input id="gramPanchayat" type="text" value={user.gramPanchayat} readOnly className="w-full p-3 pl-10 border border-border-light dark:border-border-dark bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded-lg cursor-not-allowed"/>
                            </div>
                        )}
                        </div>
                        <div className="flex items-center justify-end space-x-4">
                             {isSaved && (
                                <div className="flex items-center text-green-600 dark:text-green-400 animate-fade-in" role="status">
                                    <CheckCircle size={18} className="mr-2" />
                                    <span className="text-sm font-semibold">Saved!</span>
                                </div>
                            )}
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg">Cancel</button>
                            <button type="submit" disabled={!hasDetailsChanges} className="bg-gradient-to-r from-primary to-accent text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center shadow-lg disabled:opacity-50">
                                <Save className="mr-2" size={18} /> Save
                            </button>
                        </div>
                    </form>
                    
                    {(forcePasswordChange || isChangingPassword) && (
                         <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                             <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-4">{t('changePassword')}</h3>
                             <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">{t('currentPassword')}</label>
                                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">{t('newPassword')}</label>
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg" />
                                    <PasswordStrengthIndicator password={newPassword} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">{t('confirmNewPassword')}</label>
                                    <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required className="w-full p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg" />
                                </div>
                                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                                {passwordSuccess && <p className="text-success text-sm font-semibold">{passwordSuccess}</p>}
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-gradient-to-r from-secondary to-slate-700 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center shadow-md">
                                        <KeyRound className="mr-2" size={18} /> {t('changePassword')}
                                    </button>
                                </div>
                             </form>
                        </div>
                    )}

                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <ProfileHeader />
            <div className="space-y-3 animate-fade-in-up" style={{animationDelay: '100ms'}}>
                <MenuButton icon={PenSquare} label="Edit Profile" onClick={() => setIsEditing(true)} />
                <MenuButton icon={Mail} label="Inbox" onClick={() => setCurrentView(ViewType.Messages)} badgeCount={unreadCount} />
                <MenuButton icon={MessageSquareWarning} label="File a Complaint" onClick={() => setCurrentView(ViewType.Complaints)} />
                <a href={`mailto:${SUPPORT_EMAIL}?subject=Feedback%20for%20Eco%20Track`} className="w-full">
                    <MenuButton icon={LifeBuoy} label="Provide Feedback" onClick={() => {}} />
                </a>
                <MenuButton icon={HelpCircle} label="Help & FAQ" onClick={() => setCurrentView(ViewType.Education)} />
            </div>

            <div className="space-y-3 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark px-2">Settings</h3>
                <ToggleButton icon={Bell} label="Push Notifications" isEnabled={user.pushNotificationsEnabled ?? true} onToggle={togglePushNotifications} />
                {/* FIX: Multiple statements in an arrow function's body should be wrapped in curly braces. */}
                <button onClick={() => { setIsChangingPassword(true); setIsEditing(true); }} className="w-full">
                    <MenuButton icon={KeyRound} label={t('changePassword')} onClick={() => {}} />
                </button>
            </div>
        </div>
    );
};

export default ProfileComponent;
