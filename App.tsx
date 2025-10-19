import React, { useState } from 'react';
import { Home, IndianRupee, History, MessageSquareWarning, Bot, ShoppingBasket, User as UserIcon } from 'lucide-react';

import type { View, Payment, Complaint, Booking, User } from './types';
import { ViewType } from './types';
import Dashboard from './components/Dashboard';
import PaymentComponent from './components/Payment';
import HistoryComponent from './components/History';
import ComplaintsComponent from './components/Complaints';
import EducationComponent from './components/Education';
import BookingComponent from './components/Booking';
import ProfileComponent from './components/Profile';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import AuthFlow from './components/AuthFlow';

const App: React.FC = () => {
  const { theme } = useTheme();
  const { isLoggedIn, user } = useAuth();
  
  const [currentView, setCurrentView] = useState<View>(ViewType.Dashboard);
  const [isChatbotOpen, setChatbotOpen] = useState<boolean>(false);

  // Mock Data (user data is now in AuthContext)
  const [payments, setPayments] = useState<Payment[]>([
    { id: 'TXN789123', date: new Date(2024, 6, 15, 10, 30, 12), amount: 75, status: 'Paid' },
    { id: 'TXN654321', date: new Date(2024, 5, 14, 9, 15, 45), amount: 75, status: 'Paid' },
  ]);
  
  const [complaints, setComplaints] = useState<Complaint[]>([
      { id: 'CMPT-001', date: new Date(2024, 6, 10), issue: 'Missed Pickup', status: 'Resolved', details: 'Collector did not arrive on the scheduled day.' },
      { id: 'CMPT-002', date: new Date(), issue: 'Driver Behavior', status: 'Pending', details: 'The driver was rude.' },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
      { id: 'BK-001', date: '2024-07-28', timeSlot: 'Morning', wasteType: 'Garden Waste', status: 'Completed' }
  ]);

  const addPayment = (newPayment: Payment) => {
    setPayments([newPayment, ...payments]);
  };

  const addComplaint = (newComplaint: Complaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  const updateComplaint = (updatedComplaint: Complaint) => {
    setComplaints(complaints.map(c => c.id === updatedComplaint.id ? updatedComplaint : c));
  };

  const addBooking = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
  }

  const renderView = () => {
    if (!user) return null; // Should not happen if logged in, but good for type safety
    switch (currentView) {
      case ViewType.Dashboard:
        return <Dashboard user={user} bookings={bookings} />;
      case ViewType.Payment:
        return <PaymentComponent addPayment={addPayment} setCurrentView={setCurrentView} />;
      case ViewType.History:
        return <HistoryComponent payments={payments} />;
      case ViewType.Complaints:
        return <ComplaintsComponent complaints={complaints} addComplaint={addComplaint} updateComplaint={updateComplaint} />;
      case ViewType.Education:
        return <EducationComponent />;
      case ViewType.Booking:
        return <BookingComponent bookings={bookings} addBooking={addBooking} />;
      case ViewType.Profile:
        return <ProfileComponent />;
      default:
        return <Dashboard user={user} bookings={bookings} />;
    }
  };

  if (!isLoggedIn || !user) {
    return <AuthFlow />;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme} bg-gradient-to-b from-slate-50 to-slate-100 dark:from-background-dark dark:to-slate-900`}>
      <div className="w-full max-w-lg mx-auto bg-card-light dark:bg-card-dark shadow-2xl flex flex-col h-screen">
        <Header user={user} />
        <main className="flex-grow p-4 overflow-y-auto pb-24 bg-transparent animate-fade-in">
          {renderView()}
        </main>
        <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
        <button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-24 right-4 bg-gradient-to-r from-primary to-accent text-white p-4 rounded-full shadow-lg hover:shadow-glow-primary transition-all transform hover:scale-110 z-30 animate-pulse-glow"
          aria-label="Open AI Chatbot"
        >
          <Bot size={28} />
        </button>
        {isChatbotOpen && <Chatbot onClose={() => setChatbotOpen(false)} />}
      </div>
    </div>
  );
};

interface BottomNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: ViewType.Dashboard, icon: Home, label: 'Home' },
    { view: ViewType.Payment, icon: IndianRupee, label: 'Pay' },
    { view: ViewType.Booking, icon: ShoppingBasket, label: 'Book eCart' },
    { view: ViewType.History, icon: History, label: 'History' },
    { view: ViewType.Profile, icon: UserIcon, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-lg mx-auto bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-lg border-t border-border-light dark:border-border-dark shadow-t-2xl z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setCurrentView(item.view)}
            className={`relative flex flex-col items-center justify-center w-full transition-all duration-300 h-full ${
              currentView === item.view ? 'text-primary' : 'text-secondary dark:text-secondary-dark hover:text-primary'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className={`text-xs font-semibold mt-1 transition-opacity ${currentView === item.view ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
             {currentView === item.view && <div className="absolute -bottom-1 w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-1 transition-all"></div>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default App;