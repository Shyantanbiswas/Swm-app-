import React, { useState } from 'react';
import { Home, IndianRupee, History, MessageSquareWarning, BookOpen, Bot, ShoppingBasket } from 'lucide-react';

import type { View, Payment, Complaint, Booking, User } from './types';
import { ViewType } from './types';
import Dashboard from './components/Dashboard';
import PaymentComponent from './components/Payment';
import HistoryComponent from './components/History';
import ComplaintsComponent from './components/Complaints';
import EducationComponent from './components/Education';
import BookingComponent from './components/Booking';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import { useTheme } from './context/ThemeContext';

const App: React.FC = () => {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<View>(ViewType.Dashboard);
  const [isChatbotOpen, setChatbotOpen] = useState<boolean>(false);

  // Mock Data
  const [user, setUser] = useState<User>({
    name: 'Shyantan Biswas',
    householdId: 'HH-18B-3A45',
    hasGreenBadge: true,
    bookingReminders: true, // User can configure this
  });
  
  const [payments, setPayments] = useState<Payment[]>([
    { id: 'TXN789123', date: new Date(2024, 6, 15, 10, 30, 12), amount: 75, status: 'Paid' },
    { id: 'TXN654321', date: new Date(2024, 5, 14, 9, 15, 45), amount: 75, status: 'Paid' },
  ]);
  
  const [complaints, setComplaints] = useState<Complaint[]>([
      { id: 'CMPT-001', date: new Date(2024, 6, 10), issue: 'Missed Pickup', status: 'Resolved', details: 'Collector did not arrive on the scheduled day.' },
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

  const addBooking = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
  }

  const renderView = () => {
    switch (currentView) {
      case ViewType.Dashboard:
        return <Dashboard user={user} bookings={bookings} />;
      case ViewType.Payment:
        return <PaymentComponent addPayment={addPayment} setCurrentView={setCurrentView} />;
      case ViewType.History:
        return <HistoryComponent payments={payments} />;
      case ViewType.Complaints:
        return <ComplaintsComponent complaints={complaints} addComplaint={addComplaint} />;
      case ViewType.Education:
        return <EducationComponent />;
      case ViewType.Booking:
        return <BookingComponent user={user} setUser={setUser} bookings={bookings} addBooking={addBooking} />;
      default:
        return <Dashboard user={user} bookings={bookings} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme}`}>
      <div className="w-full max-w-lg mx-auto bg-card-light dark:bg-card-dark shadow-2xl flex flex-col h-screen">
        <Header user={user} />
        <main className="flex-grow p-4 overflow-y-auto pb-24 bg-background-light dark:bg-background-dark">
          {renderView()}
        </main>
        <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
        <button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-24 right-4 bg-primary-light text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-110 z-30"
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
    { view: ViewType.Complaints, icon: MessageSquareWarning, label: 'Complaint' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-lg mx-auto bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark shadow-t-lg z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setCurrentView(item.view)}
            className={`flex flex-col items-center justify-center w-full transition-all duration-300 h-full ${
              currentView === item.view ? 'text-primary-light -translate-y-1' : 'text-secondary-dark dark:text-secondary-dark hover:text-primary-light'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className="text-xs font-medium mt-1">{item.label}</span>
             {currentView === item.view && <div className="w-8 h-1 bg-primary-light rounded-full mt-1"></div>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default App;