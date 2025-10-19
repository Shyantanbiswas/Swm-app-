import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User, Payment, Complaint, Booking } from '../types';

// --- MOCK DATABASE ---
const initialUsers: User[] = [
    { name: 'Shyantan Biswas', householdId: 'HH-SHYA-SWAS', identifier: '9635929052', password: 'password123', status: 'active', hasGreenBadge: true, bookingReminders: true, profilePicture: '', email: 'shyantanbiswas7@gmail.com' },
    { name: 'Jane Doe', householdId: 'HH-JANE-9876', identifier: 'jane.doe@example.com', password: 'password456', status: 'active', hasGreenBadge: false, bookingReminders: true, profilePicture: '', email: 'jane.doe@example.com' },
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
// --- END MOCK DATABASE ---

interface DataContextType {
  users: User[];
  payments: Payment[];
  complaints: Complaint[];
  bookings: Booking[];
  broadcastMessage: string | null;
  addUser: (user: User) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (householdId: string) => void;
  clearUserWarning: (householdId: string) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (complaint: Complaint) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  updateBroadcastMessage: (message: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>("Welcome! A friendly reminder that monthly payments are due by the end of the week. Thank you!");


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

  const addPayment = (payment: Payment) => setPayments(prev => [payment, ...prev]);
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
  
  const updateBroadcastMessage = (message: string) => {
    setBroadcastMessage(message);
  }

  return (
    <DataContext.Provider value={{ users, payments, complaints, bookings, broadcastMessage, addUser, updateUser, deleteUser, clearUserWarning, addPayment, updatePayment, addComplaint, updateComplaint, addBooking, updateBooking, updateBroadcastMessage }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};