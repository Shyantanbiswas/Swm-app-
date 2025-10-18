export enum ViewType {
    Dashboard = 'Dashboard',
    Payment = 'Payment',
    History = 'History',
    Complaints = 'Complaints',
    Education = 'Education',
    Booking = 'Booking',
}

export type View = ViewType;

export interface User {
    name: string;
    householdId: string;
    hasGreenBadge: boolean;
    bookingReminders: boolean;
}

export interface Payment {
    id: string;
    date: Date;
    amount: number;
    status: 'Paid' | 'Pending';
}

export interface Complaint {
    id:string;
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
    date: string;
    timeSlot: 'Morning' | 'Afternoon';
    wasteType: 'Event Waste' | 'Bulk Household' | 'Garden Waste';
    status: 'Scheduled' | 'Completed';
    notes?: string;
}