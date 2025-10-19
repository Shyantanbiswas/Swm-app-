import React, { useState } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { CheckCircle, Wallet, X, Loader2, QrCode } from 'lucide-react';

import type { Payment, View } from '../types';
import { PAYMENT_AMOUNT, UPI_PAYMENT_URL, UPI_ID } from '../constants';
import Receipt from './Receipt';

interface PaymentComponentProps {
    addPayment: (payment: Payment) => void;
    setCurrentView: (view: View) => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ addPayment, setCurrentView }) => {
    const [showQrModal, setShowQrModal] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [newPayment, setNewPayment] = useState<Payment | null>(null);

    const handleVerification = () => {
        setIsVerifying(true);
        // Simulate backend verification check
        setTimeout(() => {
            const paymentDetails: Payment = {
                id: `TXN${Date.now()}`,
                date: new Date(),
                amount: PAYMENT_AMOUNT,
                status: 'Paid'
            };
            addPayment(paymentDetails);
            setNewPayment(paymentDetails);
            
            // This order is important for a smooth transition
            setIsVerifying(false);
            setPaymentSuccess(true);
        }, 2500); // 2.5-second delay for a realistic feel
    };

    if (paymentSuccess && newPayment) {
        return <Receipt payment={newPayment} setCurrentView={setCurrentView} />;
    }

    return (
        <>
            <div className="text-center animate-scale-in">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">Monthly Subscription</h2>
                <p className="text-text-light dark:text-text-dark mb-6">Your contribution keeps our community clean.</p>

                <div className="bg-card-light dark:bg-card-dark p-1 rounded-xl shadow-lg inline-block relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent -m-0.5 rounded-xl"></div>
                    <div className="relative bg-card-light dark:bg-card-dark p-8 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Amount Due</p>
                        <p className="text-5xl font-bold text-primary my-2">₹{PAYMENT_AMOUNT}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">for {new Date().toLocaleString('default', { month: 'long' })}</p>
                    </div>
                </div>
                
                <div className="mt-8 max-w-sm mx-auto space-y-4">
                     <a 
                        href={UPI_PAYMENT_URL}
                        className="w-full bg-gradient-to-r from-secondary to-slate-700 dark:from-slate-600 dark:to-slate-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        <Wallet className="mr-3" /> Pay with UPI App
                    </a>
                    <button 
                        onClick={() => setShowQrModal(true)}
                        className="w-full bg-gradient-to-r from-secondary to-slate-700 dark:from-slate-600 dark:to-slate-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        <QrCode className="mr-3" /> Generate QR Code
                    </button>
                </div>
                
                <div className="mt-8 max-w-sm mx-auto p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
                    <p className="text-sm text-text-light dark:text-text-dark mb-4">After paying, click below to confirm your transaction.</p>
                     <button 
                        onClick={handleVerification}
                        className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg shadow-lg hover:shadow-glow-primary transition-all transform hover:scale-105"
                    >
                        <CheckCircle className="mr-3" /> Verify Payment
                    </button>
                </div>
            </div>

            {showQrModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-sm relative transform transition-all animate-scale-in text-center overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-accent p-4">
                             <h3 className="text-xl font-bold text-white">Scan & Pay</h3>
                        </div>
                        <button
                            onClick={() => setShowQrModal(false)}
                            className="absolute top-2 right-2 p-2 text-white/70 hover:bg-black/20 rounded-full"
                            aria-label="Close QR Code Modal"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="p-6">
                            <p className="text-sm text-text-light dark:text-text-dark mb-4">Use any UPI app</p>
            
                            <div className="bg-white p-4 rounded-lg inline-block ring-4 ring-slate-100 dark:ring-slate-700">
                                <QRCode value={UPI_PAYMENT_URL} size={180} />
                            </div>
            
                            <div className="my-4">
                                <p className="text-slate-500 dark:text-slate-400">Amount: <span className="font-bold text-primary">₹{PAYMENT_AMOUNT}</span></p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">UPI ID: {UPI_ID}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isVerifying && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 animate-fade-in">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-2xl w-full max-w-sm">
                        <div className="text-center p-8 flex flex-col items-center justify-center">
                            <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                            <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mt-6">Verifying Payment...</h3>
                            <p className="text-sm text-text-light dark:text-text-dark mt-2">Please wait while we confirm your transaction. This may take a few seconds.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PaymentComponent;