import React, { useState, useEffect, useCallback } from 'react';
import type { User, Booking, View } from '../types';
import { ViewType } from '../types';
import { Truck, Video, BarChart2, Package, BellRing, IndianRupee, CheckCircle, Flame, Droplets, Recycle, CircleDot } from 'lucide-react';
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  user: User;
  bookings: Booking[];
  setCurrentView: (view: View) => void;
}

const communityData = [
  { name: 'Recycled', value: 78, color: '#34d399' },
  { name: 'Composted', value: 45, color: '#fbbf24' },
  { name: 'Landfill', value: 12, color: '#f87171' },
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, t } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill={fill} className="text-xl font-bold transition-opacity duration-300">
        {t(payload.name.toLowerCase())}
      </text>
       <text x={cx} y={cy + 15} textAnchor="middle" fill={fill} className="text-lg opacity-80 transition-opacity duration-300">
        {`${payload.value} kg`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6} // Pop out effect
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 4px 8px ${fill}99)` }} // Glow effect
      />
    </g>
  );
};

const DailyWasteDeclaration: React.FC = () => {
    const { user } = useAuth();
    const { addWasteLog } = useData();
    const [submittedType, setSubmittedType] = useState<string | null>(null);

    const getTodayDateString = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        if(user) {
            const todayKey = `ecotrack_waste_log_${user.householdId}_${getTodayDateString()}`;
            const storedType = localStorage.getItem(todayKey);
            if (storedType) {
                setSubmittedType(storedType);
            }
        }
    }, [user]);


    const handleSubmit = (wasteType: 'Wet' | 'Dry' | 'Mixed') => {
        if (!user) return;
        const todayKey = `ecotrack_waste_log_${user.householdId}_${getTodayDateString()}`;
        
        const newLog = {
            id: `WLOG-${Date.now()}`,
            householdId: user.householdId,
            date: getTodayDateString(),
            wasteType: wasteType
        };

        addWasteLog(newLog);
        localStorage.setItem(todayKey, wasteType);
        setSubmittedType(wasteType);
    };

    if (submittedType) {
        return (
             <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md text-center border border-border-light dark:border-border-dark animate-fade-in-up">
                <h3 className="font-semibold text-lg text-heading-light dark:text-heading-dark">Thanks for your submission!</h3>
                <p className="text-text-light dark:text-text-dark mt-2">You have declared <span className="font-bold text-primary">{submittedType} Waste</span> for today.</p>
            </div>
        )
    }

    return (
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md border border-border-light dark:border-border-dark animate-fade-in-up">
            <h3 className="font-semibold text-lg text-center mb-3 text-heading-light dark:text-heading-dark">What type of waste are you giving today?</h3>
            <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleSubmit('Wet')} className="flex flex-col items-center p-3 rounded-lg bg-blue-100/50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 transition-colors">
                    <Droplets size={24} />
                    <span className="font-semibold mt-1 text-sm">Wet</span>
                </button>
                 <button onClick={() => handleSubmit('Dry')} className="flex flex-col items-center p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-300 transition-colors">
                    <Recycle size={24} />
                    <span className="font-semibold mt-1 text-sm">Dry</span>
                </button>
                 <button onClick={() => handleSubmit('Mixed')} className="flex flex-col items-center p-3 rounded-lg bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors">
                    <CircleDot size={24} />
                    <span className="font-semibold mt-1 text-sm">Mixed</span>
                </button>
            </div>
        </div>
    )
}


const Dashboard: React.FC<DashboardProps> = ({ user, bookings, setCurrentView }) => {
  const { t } = useLanguage();
  const [showAd, setShowAd] = useState(false);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const totalWaste = communityData.reduce((sum, entry) => sum + entry.value, 0);

  const onPieEnter = useCallback((_: any, index: number) => {
      setActiveIndex(index);
  }, [setActiveIndex]);

  const onPieLeave = useCallback(() => {
      setActiveIndex(null);
  }, [setActiveIndex]);

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
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-fade-in-down">{t('dashboardTitle', { name: user.name.split(' ')[0] })}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in-up border border-border-light dark:border-border-dark" style={{animationDelay: '100ms'}}>
          <h3 className="font-semibold text-lg mb-3 flex items-center text-heading-light dark:text-heading-dark"><IndianRupee className="mr-2 text-primary" />{t('balance')}</h3>
          {user.outstandingBalance > 0 ? (
            <div>
              <p className="text-sm text-text-light dark:text-text-dark">{t('pendingBalance')}</p>
              <p className="text-3xl font-bold text-red-500 mt-2">₹{user.outstandingBalance.toFixed(2)}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-light dark:text-text-dark">{t('allSettled')}</p>
              <p className="text-3xl font-bold text-success mt-2 flex items-center"><CheckCircle className="mr-2"/> {t('cleared')}</p>
            </div>
          )}
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in-up border border-border-light dark:border-border-dark" style={{animationDelay: '150ms'}}>
          <h3 className="font-semibold text-lg mb-3 flex items-center text-heading-light dark:text-heading-dark"><Flame className="mr-2 text-orange-500" />{t('loginStreak')}</h3>
            <div className="text-center">
                <p className="text-4xl font-bold text-orange-500 mt-2">{user.loginStreak || 0}</p>
                <p className="text-sm text-text-light dark:text-text-dark">{t(user.loginStreak === 1 ? 'daysInARow' : 'daysInARow_plural', { count: user.loginStreak || 0 })}</p>
            </div>
        </div>
      </div>
      
      <DailyWasteDeclaration />


      {upcomingBooking && (
        <div className="bg-info/10 dark:bg-info/20 border-l-4 border-info text-info p-4 rounded-r-lg shadow-md animate-fade-in-up" role="alert" style={{animationDelay: '200ms'}}>
          <div className="flex items-center">
            <BellRing className="h-6 w-6 mr-3 flex-shrink-0"/>
            <div>
              <p className="font-bold">{t('reminder')}</p>
              <p className="text-sm">You have a {upcomingBooking.wasteType} collection scheduled for tomorrow ({upcomingBooking.timeSlot}).</p>
            </div>
          </div>
        </div>
      )}
      
      <button onClick={() => setCurrentView(ViewType.Sell)} className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in-up border border-border-light dark:border-border-dark w-full text-left" style={{animationDelay: '300ms'}}>
        <h3 className="font-semibold text-lg mb-1 flex items-center text-heading-light dark:text-heading-dark"><Package className="mr-2 text-primary" />Sell Materials</h3>
        <p className="text-sm text-text-light dark:text-text-dark">Have recyclables like paper or plastic? Sell them here.</p>
      </button>

      <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in-up border border-border-light dark:border-border-dark" style={{animationDelay: '400ms'}}>
        <h3 className="font-semibold text-lg mb-3 flex items-center text-heading-light dark:text-heading-dark"><BarChart2 className="mr-2 text-primary" />{t('communityWasteDiversion')}</h3>
        <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={(props) => renderActiveShape({ ...props, t })}
                        data={communityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationEasing="ease-out"
                    >
                        {communityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            {activeIndex === null && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-heading-light dark:text-heading-dark">{totalWaste}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">kg {t('total')}</p>
                    </div>
                </div>
            )}
        </div>
        <div className="mt-4 flex justify-center items-center space-x-4 md:space-x-6">
            {communityData.map((entry) => (
                <div key={entry.name} className="flex items-center text-sm">
                    <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: entry.color }}></span>
                    <span className="text-text-light dark:text-text-dark">{t(entry.name.toLowerCase())} <span className="font-semibold">({((entry.value / totalWaste) * 100).toFixed(0)}%)</span></span>
                </div>
            ))}
        </div>
        <p className="text-center text-sm text-text-light dark:text-text-dark mt-4">{t('co2Saved', { amount: '1.2' })}</p>
      </div>

       <div className="bg-gradient-to-br from-primary-dark to-accent text-white p-5 rounded-xl shadow-lg text-center transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '500ms'}}>
            <h3 className="font-bold text-lg">Support Our NGO!</h3>
            <p className="text-sm mt-1 mb-3 opacity-90">Watch a 30-second ad to contribute to our cause. It's optional but greatly appreciated!</p>
            <button onClick={handleAdWatch} className="bg-white/90 text-primary-dark font-bold py-2 px-5 rounded-full flex items-center mx-auto hover:bg-white transition-transform transform hover:scale-105 shadow-md hover:shadow-lg">
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