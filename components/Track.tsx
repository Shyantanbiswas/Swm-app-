import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { Truck, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TrackComponentProps {
    users: User[];
}

const TrackComponent: React.FC<TrackComponentProps> = ({ users }) => {
    const { user } = useAuth();
    const [activeDriver, setActiveDriver] = useState<User | null>(null);
    const [eta, setEta] = useState<string | null>(null);

    useEffect(() => {
        // Find a captain with a recent location update (e.g., within the last 15 minutes)
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const driver = users.find(
            (u) =>
                u.role === 'captain' &&
                u.lastLocation &&
                u.lastLocation.timestamp > fifteenMinutesAgo
        );
        setActiveDriver(driver || null);
    }, [users]);

    // Calculate ETA (simulation)
    useEffect(() => {
        if (activeDriver && activeDriver.lastLocation && user && user.lastLocation) {
            const R = 6371; // Radius of the Earth in km
            const dLat = (activeDriver.lastLocation.lat - user.lastLocation.lat) * (Math.PI / 180);
            const dLon = (activeDriver.lastLocation.lng - user.lastLocation.lng) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(user.lastLocation.lat * (Math.PI / 180)) * Math.cos(activeDriver.lastLocation.lat * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // Distance in km

            const avgSpeed = 15; // km/h
            const timeHours = distance / avgSpeed;
            const timeMinutes = Math.round(timeHours * 60);
            
            setEta(`${timeMinutes} - ${timeMinutes + 5} min`);
        } else {
            setEta(null);
        }
    }, [activeDriver, user]);

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">Live Vehicle Tracking</h2>
            
            {activeDriver && activeDriver.lastLocation ? (
                 <div className="space-y-4">
                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md border border-border-light dark:border-border-dark">
                         <h3 className="font-semibold text-lg mb-3 flex items-center text-heading-light dark:text-heading-dark"><Truck className="mr-2 text-primary" /> On Duty Vehicle</h3>
                         <div className="flex items-center space-x-4">
                            <img src={activeDriver.profilePicture || `https://ui-avatars.com/api/?name=${activeDriver.name}&background=10b981&color=fff&size=128`} alt={activeDriver.name} className="w-16 h-16 rounded-full object-cover"/>
                            <div>
                                <p className="font-bold text-xl text-heading-light dark:text-heading-dark">{activeDriver.name}</p>
                                <p className="text-sm text-text-light dark:text-text-dark capitalize">{activeDriver.role}</p>
                            </div>
                         </div>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md border border-border-light dark:border-border-dark">
                         <h3 className="font-semibold text-lg mb-3 flex items-center text-heading-light dark:text-heading-dark"><Clock className="mr-2 text-primary" /> Estimated Arrival</h3>
                         <p className="text-3xl font-bold text-primary text-center py-2">{eta || "Calculating..."}</p>
                         <p className="text-xs text-slate-400 dark:text-slate-500 text-center">Last updated: {activeDriver.lastLocation.timestamp.toLocaleTimeString()}</p>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md border border-border-light dark:border-border-dark">
                         <h3 className="font-semibold text-lg mb-3 flex items-center text-heading-light dark:text-heading-dark"><MapPin className="mr-2 text-primary" />Map View</h3>
                         <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-500 mb-4">
                             <p>Live Map Preview</p>
                         </div>
                         {user && user.lastLocation ? (
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${user.lastLocation.lat},${user.lastLocation.lng}&destination=${activeDriver.lastLocation.lat},${activeDriver.lastLocation.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-glow-primary transition-all transform hover:scale-105"
                            >
                                <MapPin className="mr-2" size={20} /> View on Google Maps
                            </a>
                        ) : (
                            <button
                                disabled
                                className="w-full inline-flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 font-bold py-3 px-4 rounded-lg cursor-not-allowed"
                            >
                                <MapPin className="mr-2" size={20} /> Enable your location to see route
                            </button>
                        )}
                    </div>

                </div>
            ) : (
                <div className="text-center py-10 bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                    <Truck className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-lg font-medium text-heading-light dark:text-heading-dark">No Active Vehicle</h3>
                    <p className="mt-1 text-sm text-text-light dark:text-text-dark">There is currently no collection vehicle active in your area. Please check back later.</p>
                </div>
            )}
        </div>
    );
};

export default TrackComponent;
