import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User, Payment, Complaint, Booking, Message } from '../types';
import { PAYMENT_AMOUNT } from '../constants';

// --- MOCK DATABASE (for initial seeding) ---
const initialUsers: User[] = [
    { name: 'Shyantan Biswas', householdId: 'HH-SHYA-SWAS', identifier: '9635929052', password: 'password123', status: 'active', hasGreenBadge: true, bookingReminders: true, profilePicture: '', email: 'shyantanbiswas7@gmail.com', createdAt: new Date(2024, 5, 1), outstandingBalance: 75 },
    { name: 'Admin Two', householdId: 'HH-ADMN-1746', identifier: '9064201746', password: 'adminpassword', status: 'active', hasGreenBadge: true, bookingReminders: false, profilePicture: '', email: 'admin2@ecotrack.com', createdAt: new Date(2024, 5, 1), outstandingBalance: 0 },
    { name: 'Jane Doe', householdId: 'HH-JANE-9876', identifier: 'jane.doe@example.com', password: 'password456', status: 'active', hasGreenBadge: false, bookingReminders: true, profilePicture: '', email: 'jane.doe@example.com', createdAt: new Date(2024, 6, 10), outstandingBalance: 150 },
];

const initialPayments: Payment[] = [
    { id: 'TXN789123', householdId: 'HH-SHYA-SWAS', date: new Date(2024, 6, 15, 10, 30, 12), amount: 75, status: 'Paid' },
    { id: 'TXN654321', householdId: 'HH-SHYA-SWAS', date: new Date(2024, 5, 14, 9, 15, 45), amount: 75, status: 'Paid' },
    { id: 'TXN112233', householdId: 'HH-JANE-9876', date: new Date(2024, 6, 14, 8, 0, 0), amount: 75, status: 'Paid' },
    { id: 'TXN445566', householdId: 'HH-JANE-9876', date: new Date(), amount: 75, status: 'Pending Verification', screenshot: 'https://via.placeholder.com/300x600.png?text=Sample+Screenshot' },

];

const initialComplaints: Complaint[] = [
    { id: 'CMPT-001', householdId: 'HH-SHYA-SWAS', date: new Date(2024, 6, 10), issue: 'Missed Pickup', status: 'Resolved', details: 'Collector did not arrive on the scheduled day.' },
    { id: 'CMPT-002', householdId: 'HH-SHYA-SWAS', date: new Date(), issue: 'Driver Behavior', status: 'Pending', details: 'The driver was rude.' },
    { id: 'CMPT-003', householdId: 'HH-JANE-9876', date: new Date(2024, 6, 20), issue: 'Payment Issue', status: 'In Progress', details: 'My payment is not reflecting in the app.' },
];

const initialBookings: Booking[] = [
    { id: 'BK-001', householdId: 'HH-SHYA-SWAS', date: '2024-07-28', timeSlot: 'Morning', wasteType: 'Garden Waste', status: 'Completed' },
    { id: 'BK-002', householdId: 'HH-JANE-9876', date: '2024-08-05', timeSlot: 'Afternoon', wasteType: 'Bulk Household', status: 'Scheduled' },
];

const initialMessages: Message[] = [
    { id: 'MSG-001', recipientId: 'HH-JANE-9876', text: 'Hi Jane, please ensure your waste is properly segregated for the next pickup. Thank you!', timestamp: new Date(2024, 6, 22, 11, 45), read: false },
    { id: 'MSG-002', recipientId: 'HH-SHYA-SWAS', text: 'Your "Driver Behavior" complaint (CMPT-002) has been reviewed. We have taken action and apologize for the inconvenience.', timestamp: new Date(), read: true },
];

const initialBroadcastMessage = "Welcome! A friendly reminder that monthly payments are due by the end of the week. Thank you!";
// --- END MOCK DATABASE ---


// --- LOCALSTORAGE PERSISTENCE HELPERS ---

// A reviver function for JSON.parse to correctly handle Date objects
const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return new Date(value);
    }
    return value;
};

// FIX: Added generic type parameter <T> to the function signature.
// Generic function to load data from localStorage or return initial data
const loadFromStorage = <T,>(key: string, initialValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item, dateReviver) as T;
        }
    } catch (error) {
        // FIX: Correctly reference 'key' and 'error' variables in the console message.
        console.error(`Error loading ${key} from storage, using initial value.`, error);
    }
    // If no item, set the initial value in storage for next time
    window.localStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
};


// FIX: Defined the DataContextType interface.
interface DataContextType {
  users: User[];
  payments: Payment[];
  complaints: Complaint[];
  bookings: Booking[];
  messages: Message[];
  broadcastMessage: string | null;
  addUser: (user: User) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (householdId: string) => void;
  clearUserWarning: (householdId: string) => void;
  addPayment: (payment: Payment) => Promise<Payment>;
  updatePayment: (payment: Payment) => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (complaint: Complaint) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  addMessage: (recipientId: string, text: string) => void;
  markMessagesAsRead: (householdId: string) => void;
  updateBroadcastMessage: (message: string) => void;
}

// FIX: Created the context with the correct type.
const DataContext = createContext<DataContextType | undefined>(undefined);

// FIX: Created and exported the DataProvider component, which was missing.
// This component encapsulates all the state management logic.
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // FIX: Used useState hook correctly to manage state for users, payments, etc.
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('ecotrack_users', initialUsers));
  const [payments, setPayments] = useState<Payment[]>(() => loadFromStorage('ecotrack_payments', initialPayments));
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadFromStorage('ecotrack_complaints', initialComplaints));
  const [bookings, setBookings] = useState<Booking[]>(() => loadFromStorage('ecotrack_bookings', initialBookings));
  const [messages, setMessages] = useState<Message[]>(() => loadFromStorage('ecotrack_messages', initialMessages));
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(() => loadFromStorage('ecotrack_broadcast', initialBroadcastMessage));

  // FIX: Used useEffect hooks to persist state changes to localStorage.
  useEffect(() => { localStorage.setItem('ecotrack_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('ecotrack_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('ecotrack_complaints', JSON.stringify(complaints)); }, [complaints]);
  useEffect(() => { localStorage.setItem('ecotrack_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('ecotrack_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('ecotrack_broadcast', JSON.stringify(broadcastMessage)); }, [broadcastMessage]);

  // FIX: Defined all data manipulation functions inside the provider component scope.
  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  }
  
  const updateUser = (updatedUser: User) => {
      setUsers(prev => prev.map(u => u.householdId === updatedUser.householdId ? updatedUser : u));
  }
  
  const deleteUser = (householdId: string) => {
      setUsers(prev => prev.filter(u => u.householdId !== householdId));
      // Also delete associated data
      setPayments(prev => prev.filter(p => p.householdId !== householdId));
      setComplaints(prev => prev.filter(c => c.householdId !== householdId));
      setBookings(prev => prev.filter(b => b.householdId !== householdId));
  }

  const clearUserWarning = (householdId: string) => {
      setUsers(prev => prev.map(u => u.householdId === householdId ? { ...u, status: 'active', warningMessage: undefined } : u));
  }

  const addPayment = (payment: Payment): Promise<Payment> => {
    // Add payment to state optimistically
    setPayments(prev => [payment, ...prev]);

    // This simulation remains, but now the final result is persisted
    if (payment.status === 'Pending Verification') {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isSuccess = Math.random() < 0.8; // 80% success rate simulation
                
                let finalPayment: Payment = { ...payment };

                if (isSuccess) {
                    finalPayment = { ...payment, status: 'Paid' };
                    // Deduct amount from user's balance
                    setUsers(prevUsers => prevUsers.map(u => 
                        u.householdId === payment.householdId && typeof u.outstandingBalance === 'number'
                        ? { ...u, outstandingBalance: u.outstandingBalance - payment.amount }
                        : u
                    ));
                } else {
                    finalPayment = { 
                        ...payment, 
                        status: 'Rejected', 
                        rejectionReason: 'Automated verification failed. Please check the screenshot and try again.' 
                    };
                }
                
                // Update the payment status in the main state, which will trigger the useEffect to save it
                setPayments(prevPayments => prevPayments.map(p => 
                    p.id === payment.id ? finalPayment : p
                ));
                
                if (isSuccess) {
                    resolve(finalPayment);
                } else {
                    reject(finalPayment);
                }
            }, 3000); // 3-second delay to simulate backend processing
        });
    }

    // If payment does not require verification, resolve immediately.
    return Promise.resolve(payment);
  };

  const updatePayment = (updatedPayment: Payment) => {
    setPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p));
  }
  
  const addComplaint = (complaint: Complaint) => setComplaints(prev => [complaint, ...prev]);

  const updateComplaint = (updatedComplaint: Complaint) => {
    setComplaints(prev => prev.map(c => c.id === updatedComplaint.id ? updatedComplaint : c));
  };
  
  const addBooking = (booking: Booking) => setBookings(prev => [booking, ...prev]);
  
  const updateBooking = (updatedBooking: Booking) => {
      setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  const addMessage = (recipientId: string, text: string) => {
    const newMessage: Message = {
        id: `MSG-${Date.now()}`,
        recipientId,
        text,
        timestamp: new Date(),
        read: false,
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const markMessagesAsRead = (householdId: string) => {
      setMessages(prev => prev.map(msg => 
          msg.recipientId === householdId && !msg.read ? { ...msg, read: true } : msg
      ));
  };
  
  const updateBroadcastMessage = (message: string) => {
    setBroadcastMessage(message);
  }

  // FIX: Bundled all state and functions into a value object to pass to the provider.
  const value = { users, payments, complaints, bookings, messages, broadcastMessage, addUser, updateUser, deleteUser, clearUserWarning, addPayment, updatePayment, addComplaint, updateComplaint, addBooking, updateBooking, addMessage, markMessagesAsRead, updateBroadcastMessage };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// FIX: Created and exported the useData custom hook for consuming the context.
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};