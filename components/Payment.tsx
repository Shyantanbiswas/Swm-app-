import React, { useState } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { CheckCircle, QrCode, Wallet } from 'lucide-react';

import type { Payment, View } from '../types';
import { PAYMENT_AMOUNT, UPI_PAYMENT_URL } from '../constants';
import Receipt from './Receipt';

interface PaymentComponentProps {
    addPayment: (payment: Payment) => void;
    setCurrentView: (view: View) => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ addPayment, setCurrentView }) => {
    const [showQR, setShowQR] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [newPayment, setNewPayment] = useState<Payment | null>(null);

    const handlePayment = () => {
        // In a real app, you'd integrate a payment gateway.
        // Here, we'll simulate a successful payment.
        const paymentDetails: Payment = {
            id: `TXN${Date.now()}`,
            date: new Date(),
            amount: PAYMENT_AMOUNT,
            status: 'Paid'
        };
        addPayment(paymentDetails);
        setNewPayment(paymentDetails);
        setPaymentSuccess(true);
    };

    if (paymentSuccess && newPayment) {
        return <Receipt payment={newPayment} setCurrentView={setCurrentView} />;
    }

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-2">Monthly Subscription</h2>
            <p className="text-text-light dark:text-text-dark mb-6">Your contribution keeps our community clean.</p>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-md inline-block">
                <p className="text-slate-500 dark:text-slate-400 text-lg">Amount Due</p>
                <p className="text-5xl font-bold text-primary-light my-2">₹{PAYMENT_AMOUNT}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">for the month of {new Date().toLocaleString('default', { month: 'long' })}</p>
            </div>
            
            <div className="mt-8 space-y-4 max-w-sm mx-auto">
                 <a 
                    href={UPI_PAYMENT_URL}
                    onClick={handlePayment}
                    className="w-full bg-primary-light text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg hover:bg-primary-dark transition-transform transform hover:scale-105"
                >
                    <Wallet className="mr-3" /> Pay with UPI App
                </a>
                <button 
                    onClick={() => setShowQR(!showQR)}
                    className="w-full bg-secondary-light dark:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg hover:bg-slate-700 transition-transform transform hover:scale-105"
                >
                    <QrCode className="mr-3" /> {showQR ? 'Hide QR Code' : 'Generate QR Code'}
                </button>
            </div>
            
            {showQR && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md inline-block transition-all animate-fade-in">
                    <h3 className="font-semibold mb-2">Scan to Pay</h3>
                    <QRCode value={UPI_PAYMENT_URL} size={180} />
                    <p className="text-sm text-slate-500 mt-4">After scanning, please tap below to confirm.</p>
                     <button 
                        onClick={handlePayment}
                        className="mt-2 w-full bg-green-100 text-green-800 font-bold py-2 px-4 rounded-lg flex items-center justify-center text-sm hover:bg-green-200 transition"
                    >
                        <CheckCircle className="mr-2" /> I have paid
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentComponent;