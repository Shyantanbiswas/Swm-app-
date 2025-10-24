import { Type } from "@google/genai";

export enum ViewType {
    Dashboard = 'Dashboard',
    Payment = 'Payment',
    History = 'History',
    Complaints = 'Complaints',
    Education = 'Education',
    Booking = 'Booking',
    Profile = 'Profile',
    Messages = 'Messages',
}

export type View = ViewType;

export const GRAM_PANCHAYATS = [
    'ANDAL',
    'DAKSHINKHANDA',
    'KAJORA',
    'KHANDRA',
    'MADANPUR',
    'RAMPRASADPUR',
    'SHRIRAMPUR',
    'UKHRA'
] as const;

export type GramPanchayat = typeof GRAM_PANCHAYATS[number];


export interface User {
    name: string;
    householdId: string;
    identifier: string; // The unique mobile number used to log in
    password?: string; // User's password for login
    role: 'household' | 'admin' | 'employee' | 'captain' | 'sanitaryworker';
    status: 'active' | 'blocked' | 'warned';
    warningMessage?: string;
    hasGreenBadge?: boolean;
    bookingReminders?: boolean;
    profilePicture?: string;
    email: string; // User's mandatory email address
    createdAt: Date;
    outstandingBalance: number;
    familySize: number;
    address: {
        area: string;
        landmark: string;
        pincode: string;
    };
    gramPanchayat?: string;
    // Staff-specific properties
    attendanceStatus?: 'present' | 'absent' | 'on_leave';
    lastLoginTime?: Date;
    lastLocation?: { lat: number; lng: number; timestamp: Date };
    lastIpAddress?: string;
    // New properties for streak
    loginStreak?: number;
    lastStreakIncrement?: Date;
}

export interface Payment {
    id: string;
    householdId: string;
    date: Date;
    amount: number;
    status: 'Pending Verification' | 'Paid' | 'Rejected';
    screenshot?: string; // base64 data URL of the uploaded screenshot
    rejectionReason?: string;
}

export interface Complaint {
    id:string;
    householdId: string;
    date: Date;
    issue: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    details: string;
    photo?: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

export interface Booking {
    id: string;
    householdId: string;
    date: string;
    timeSlot: 'Morning' | 'Afternoon';
    wasteType: 'Event Waste' | 'Bulk Household' | 'Garden Waste';
    status: 'Scheduled' | 'Completed';
    notes?: string;
    attendeeCount?: number;
    bookingFee?: number;
}

export interface Message {
  id: string;
  recipientId: string; // householdId
  text: string;
  timestamp: Date;
  read: boolean;
}