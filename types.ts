import { Type } from "@google/genai";

export enum ViewType {
    Dashboard = 'Dashboard',
    Payment = 'Payment',
    History = 'History',
    Complaints = 'Complaints',
    Education = 'Education',
    Booking = 'Booking',
    Profile = 'Profile',
}

export type View = ViewType;

export interface User {
    name: string;
    householdId: string;
    identifier: string; // The unique mobile number or email used to log in
    password?: string; // User's password for login
    status: 'active' | 'blocked' | 'warned';
    warningMessage?: string;
    hasGreenBadge: boolean;
    bookingReminders: boolean;
    profilePicture?: string;
    email?: string;
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
}