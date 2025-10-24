import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LayoutDashboard, User as UserIcon } from 'lucide-react';
import Header from './Header';
import StaffDashboard from './StaffDashboard';
import StaffProfile from './StaffProfile';
import StaffNoticeModal from './StaffNoticeModal';

type StaffView = 'dashboard' | 'profile';

const StaffApp: React.FC = () => {
    const { user } = useAuth();
    const { updateUserLocation, staffBroadcastMessage } = useData();
    const [locationStatus, setLocationStatus] = useState('Initializing...');
    const locationWatcherId = useRef<number | null>(null);
    const [currentView, setCurrentView] = useState<StaffView>('dashboard');
    const [isNoticeVisible, setNoticeVisible] = useState(false);
    
    const isPanchayatMissing = !user?.gramPanchayat;
    const isPhotoMissing = !user?.profilePicture;

    // Force profile view if photo or panchayat is missing
    useEffect(() => {
        if (user && (isPhotoMissing || isPanchayatMissing)) {
            setCurrentView('profile');
        } else if (user && !isPhotoMissing && !isPanchayatMissing && currentView === 'profile') {
            // If they were on profile and just updated, don't force them away
        } else if (user && !isPhotoMissing && !isPanchayatMissing) {
            setCurrentView('dashboard');
        }
    }, [user, isPhotoMissing, isPanchayatMissing]);

    // Show staff notice modal once per session
    useEffect(() => {
        if (staffBroadcastMessage && sessionStorage.getItem('staffNoticeDismissed') !== 'true') {
            setNoticeVisible(true);
        }
    }, [staffBroadcastMessage]);

    const handleDismissNotice = () => {
        setNoticeVisible(false);
        sessionStorage.setItem('staffNoticeDismissed', 'true');
    };


    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation is not supported by your browser.');
            return;
        }

        const successCallback = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            const newLocation = { lat: latitude, lng: longitude, timestamp: new Date() };
            if (user) {
                updateUserLocation(user.householdId, newLocation);
            }
            setLocationStatus(`Tracking Active. Last update: ${new Date().toLocaleTimeString()}`);
        };

        const errorCallback = (error: GeolocationPositionError) => {
            console.error("Geolocation error:", error);
            let errorMessage = `Error: ${error.message}`;
            if (error.code === error.PERMISSION_DENIED) {
                errorMessage = "Location permission denied. Please enable it in your browser settings.";
            }
            setLocationStatus(errorMessage);
        };

        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
        };

        locationWatcherId.current = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
        setLocationStatus('Attempting to start location tracking...');

        return () => {
            if (locationWatcherId.current !== null) {
                navigator.geolocation.clearWatch(locationWatcherId.current);
            }
        };
    }, [user, updateUserLocation]);
    
    const renderView = () => {
        switch(currentView) {
            case 'profile':
                return <StaffProfile />;
            case 'dashboard':
            default:
                return <StaffDashboard locationStatus={locationStatus} />;
        }
    };
    
    return (
        <div className="w-full max-w-lg mx-auto bg-card-light dark:bg-card-dark shadow-2xl flex flex-col h-screen">
            <Header />
            <main className="flex-grow p-6 overflow-y-auto pb-24 bg-background-light dark:bg-background-dark">
               {renderView()}
            </main>
            <StaffBottomNav 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                actionRequired={isPhotoMissing || isPanchayatMissing} 
            />
            {isNoticeVisible && staffBroadcastMessage && (
                <StaffNoticeModal message={staffBroadcastMessage} onDismiss={handleDismissNotice} />
            )}
        </div>
    );
};


interface StaffBottomNavProps {
  currentView: StaffView;
  setCurrentView: (view: StaffView) => void;
  actionRequired: boolean;
}

const StaffBottomNav: React.FC<StaffBottomNavProps> = ({ currentView, setCurrentView, actionRequired }) => {
    
    const navItems = [
        { view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { view: 'profile', icon: UserIcon, label: 'Profile' },
    ];
    
    const handleNavClick = (view: StaffView) => {
        if (actionRequired && view !== 'profile') {
            // Navigation is disabled, do nothing.
            return;
        }
        setCurrentView(view);
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-lg mx-auto bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-lg border-t border-border-light dark:border-border-dark shadow-t-2xl z-20">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isDisabled = actionRequired && item.view !== 'profile';
                    return (
                        <button
                            key={item.label}
                            onClick={() => handleNavClick(item.view as StaffView)}
                            disabled={isDisabled}
                            className={`relative flex flex-col items-center justify-center w-full transition-all duration-300 h-full ${
                            currentView === item.view ? 'text-primary' : 'text-secondary dark:text-secondary-dark hover:text-primary'
                            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
                            <span className={`text-xs font-semibold mt-1 transition-opacity ${currentView === item.view ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
                            {currentView === item.view && <div className="absolute -bottom-1 w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-1 transition-all"></div>}
                        </button>
                    )
                })}
            </div>
        </nav>
    );
}


export default StaffApp;