import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Recycle, Smartphone, KeyRound, ArrowRight, RefreshCw, Info } from 'lucide-react';

const AuthFlow: React.FC = () => {
    const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const auth = useAuth();

    useEffect(() => {
        let timerId: number;
        if (resendTimer > 0) {
            timerId = window.setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timerId);
    }, [resendTimer]);

    const sendOtpViaWhatsApp = () => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);

        const message = `Your EcoTrack verification OTP is: ${newOtp}`;
        // Assuming an Indian country code. A real app would need a country code selector.
        const whatsappUrl = `https://wa.me/91${mobileNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    };

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileNumber.length !== 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setError('');
        sendOtpViaWhatsApp();
        setResendTimer(30);
        setStep('otp');
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp !== generatedOtp) {
            setError('Invalid OTP. Please try again.');
            return;
        }
        setError('');
        auth.login(mobileNumber);
    };

    const handleResendOtp = () => {
        if (resendTimer === 0) {
            sendOtpViaWhatsApp();
            setResendTimer(30);
            setError('');
            setOtp('');
        }
    };
    
    const changeNumber = () => {
        setMobileNumber('');
        setOtp('');
        setError('');
        setGeneratedOtp('');
        setStep('mobile');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4 font-sans">
            <div className="w-full max-w-sm mx-auto text-center">
                <div className="flex justify-center items-center gap-3 mb-6">
                    <Recycle className="h-10 w-10 text-primary-light" />
                    <h1 className="text-4xl font-bold text-heading-light dark:text-heading-dark">EcoTrack</h1>
                </div>
                <p className="text-text-light dark:text-text-dark mb-8">Your partner in sustainable waste management.</p>
                
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl w-full">
                    {step === 'mobile' ? (
                        <form onSubmit={handleSendOtp}>
                            <h2 className="text-2xl font-semibold text-heading-light dark:text-heading-dark mb-2">Login or Sign Up</h2>
                            <p className="text-text-light dark:text-text-dark mb-6 text-sm">Enter your mobile number to receive an OTP on WhatsApp.</p>
                            <div className="relative mb-4">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                    placeholder="10-digit mobile number"
                                    className="w-full p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={mobileNumber.length !== 10}
                                className="w-full bg-primary-light text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg hover:bg-primary-dark transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:scale-100"
                            >
                                Send OTP <ArrowRight className="ml-2" />
                            </button>
                        </form>
                    ) : (
                         <form onSubmit={handleVerifyOtp}>
                            <h2 className="text-2xl font-semibold text-heading-light dark:text-heading-dark mb-2">Verify OTP</h2>
                            <p className="text-text-light dark:text-text-dark mb-4 text-sm">
                                Enter the 6-digit code sent to <span className="font-bold">{mobileNumber}</span>.
                                <button type="button" onClick={changeNumber} className="text-primary-light ml-2 text-sm font-semibold">Change</button>
                            </p>
                            
                            <div className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-3 rounded-r-lg shadow-sm mb-4 text-sm flex items-start" role="alert">
                                <Info size={18} className="mr-2 flex-shrink-0 mt-0.5"/>
                                <div>
                                    An OTP has been sent to your WhatsApp. A new tab may have opened. Please check your messages and enter the code below.
                                </div>
                            </div>

                            <div className="relative mb-4">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="tel"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    placeholder="6-digit OTP"
                                    className="w-full p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={otp.length !== 6}
                                className="w-full bg-primary-light text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg hover:bg-primary-dark transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:scale-100"
                            >
                                Verify & Proceed
                            </button>
                            <div className="mt-4 text-sm">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0}
                                    className="text-primary-light font-semibold disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center w-full"
                                >
                                    <RefreshCw size={14} className={`mr-1 ${resendTimer > 0 ? 'animate-spin' : ''}`} style={{animationDuration: '2s'}} />
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                </button>
                            </div>
                         </form>
                    )}
                     {error && <p className="text-red-500 text-sm mt-4 animate-fade-in">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default AuthFlow;