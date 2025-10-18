import React, { useState, useEffect } from 'react';
import type { User, Booking } from '../types';
import { Truck, Video, BarChart2, MapPin, BellRing } from 'lucide-react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  user: User;
  bookings: Booking[];
}

const communityData = [
  { name: 'Recycled', value: 78, color: '#34d399' },
  { name: 'Composted', value: 45, color: '#fbbf24' },
  { name: 'Landfill', value: 12, color: '#f87171' },
];
const totalWaste = communityData.reduce((sum, entry) => sum + entry.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = ((data.value / totalWaste) * 100).toFixed(1);
        return (
            <div className="p-2 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border border-border-light dark:border-border-dark rounded-lg shadow-lg">
                <p style={{ color: data.color }} className="font-bold">{data.name}</p>
                <p className="text-text-light dark:text-text-dark">{`${data.value} kg (${percentage}%)`}</p>
            </div>
        );
    }
    return null;
};

const Dashboard: React.FC<DashboardProps> = ({ user, bookings }) => {
  const [rickshawPosition, setRickshawPosition] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRickshawPosition((prev) => (prev > 95 ? 0 : prev + 10));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user.bookingReminders) {
        const checkUpcomingBookings = () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowString = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

            const foundBooking = bookings.find(b => b.date === tomorrowString && b.status === 'Scheduled');
            if (foundBooking) {
                setUpcomingBooking(foundBooking);
            } else {
                setUpcomingBooking(null);
            }
        };

        checkUpcomingBookings();
    } else {
        setUpcomingBooking(null);
    }
  }, [bookings, user.bookingReminders]);
  
  const handleAdWatch = () => {
      setShowAd(true);
      setTimeout(() => setShowAd(false), 5000); // Simulate 5s ad
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-heading-light dark:text-heading-dark">Welcome, {user.name.split(' ')[0]}!</h2>
      
      {upcomingBooking && (
        <div className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded-r-lg shadow-md animate-fade-in" role="alert">
          <div className="flex items-center">
            <BellRing className="h-6 w-6 mr-3 flex-shrink-0"/>
            <div>
              <p className="font-bold">Reminder</p>
              <p className="text-sm">You have a {upcomingBooking.wasteType} collection scheduled for tomorrow ({upcomingBooking.timeSlot}).</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
        <h3 className="font-semibold text-lg mb-3 flex items-center text-heading-light dark:text-heading-dark"><MapPin className="mr-2 text-primary-light" />Live Collection Status</h3>
        <p className="text-sm text-text-light dark:text-text-dark mb-4">Your e-rickshaw is on its way. ETA: <span className="font-bold text-primary-light">{15 - Math.floor(rickshawPosition / 10)} mins</span></p>
        <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary-light rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${rickshawPosition}%` }}
          >
          </div>
          <Truck 
              className="absolute -top-2 w-10 h-10 text-primary-light transition-all duration-1000 ease-linear" 
              style={{ left: `calc(${rickshawPosition}% - 20px)`}}
          />
        </div>
        <div className="flex justify-between text-xs mt-3 text-slate-500 dark:text-slate-400">
            <span>Dispatched</span>
            <span>Your Location</span>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
        <h3 className="font-semibold text-lg mb-3 flex items-center text-heading-light dark:text-heading-dark"><BarChart2 className="mr-2 text-primary-light" />Community Waste Diversion</h3>
        <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={communityData}
                        cx="40%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                    >
                        {communityData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        iconType="circle" 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ right: -10 }}
                        formatter={(value) => <span className="text-text-light dark:text-text-dark ml-2">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ left: '40%', transform: 'translateX(-50%)' }}>
                <div className="text-center">
                    <p className="text-3xl font-bold text-heading-light dark:text-heading-dark">{totalWaste}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">kg total</p>
                </div>
            </div>
        </div>
        <p className="text-center text-sm text-text-light dark:text-text-dark mt-2">Total CO₂ Saved: <span className="font-bold text-green-700 dark:text-green-400">1.2 Tons</span></p>
      </div>

       <div className="bg-gradient-to-r from-primary-dark to-primary-light text-white p-4 rounded-xl shadow-md text-center transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="font-bold text-lg">Support Our NGO!</h3>
            <p className="text-sm mt-1 mb-3">Watch a 30-second ad to contribute to our cause. It's optional but greatly appreciated!</p>
            <button onClick={handleAdWatch} className="bg-white text-primary-dark font-bold py-2 px-4 rounded-full flex items-center mx-auto hover:bg-green-100 transition-transform transform hover:scale-105">
                <Video className="mr-2" /> Watch Ad
            </button>
       </div>
       
       {showAd && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
           <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg text-center text-heading-light dark:text-heading-dark">
             <h3 className="text-xl font-bold">Ad in Progress...</h3>
             <p className="my-4 text-text-light dark:text-text-dark">Thank you for your support!</p>
             <div className="w-24 h-24 bg-slate-200 dark:bg-slate-600 mx-auto flex items-center justify-center text-slate-500">
                 Video
             </div>
             <p className="text-sm mt-4 text-text-light dark:text-text-dark">This window will close automatically.</p>
           </div>
         </div>
       )}
    </div>
  );
};

export default Dashboard;