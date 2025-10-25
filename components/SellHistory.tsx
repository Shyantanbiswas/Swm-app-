import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ArrowLeft, Check, Clock, Package, MessageSquare, CheckCheck } from 'lucide-react';
import type { SellRequest, View } from '../types';
import { ViewType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import SellRequestChatModal from './SellRequestChatModal';

interface SellHistoryProps {
    setCurrentView: (view: View) => void;
}

const SellHistory: React.FC<SellHistoryProps> = ({ setCurrentView }) => {
    const { user } = useAuth();
    const { sellRequests } = useData();
    const { t } = useLanguage();
    const [chattingRequest, setChattingRequest] = useState<SellRequest | null>(null);

    const userSellRequests = useMemo(() => {
        if (!user) return [];
        return sellRequests
            .filter(req => req.householdId === user.householdId)
            .sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [sellRequests, user]);

    const getStatusChip = (status: SellRequest['status']) => {
        switch(status) {
            case 'Pending':
                return <div className="flex items-center text-xs font-semibold text-warning-dark dark:text-warning bg-warning/10 px-2 py-1 rounded-full"><Clock size={12} className="mr-1"/>{status}</div>;
            case 'Approved':
                return <div className="flex items-center text-xs font-semibold text-info bg-info/10 px-2 py-1 rounded-full"><Check size={12} className="mr-1"/>{status}</div>;
            case 'Completed':
                 return <div className="flex items-center text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full"><CheckCheck size={12} className="mr-1"/>{status}</div>
        }
    }

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center mb-4">
                <button onClick={() => setCurrentView(ViewType.Sell)} className="p-2 mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <ArrowLeft />
                </button>
                <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark">{t('mySellRequests')}</h2>
            </div>
            
            {userSellRequests.length === 0 ? (
                <div className="text-center py-10 bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                    <Package className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-lg font-medium text-heading-light dark:text-heading-dark">{t('noSellRequests')}</h3>
                </div>
            ) : (
                <ul className="space-y-3">
                    {userSellRequests.map((req, index) => (
                        <li 
                            key={req.id} 
                            className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md border border-border-light dark:border-border-dark animate-fade-in-up"
                            style={{ animationDelay: `${index * 75}ms` }}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-heading-light dark:text-heading-dark">Request on {req.date.toLocaleDateString()}</p>
                                    <p className="text-sm text-text-light dark:text-text-dark">{req.weightKg} kg of materials</p>
                                </div>
                                {getStatusChip(req.status)}
                            </div>
                            {req.status === 'Approved' && (
                                <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                                    <button onClick={() => setChattingRequest(req)} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center text-sm shadow-md hover:shadow-glow-primary transition-all">
                                        <MessageSquare size={16} className="mr-2" />
                                        {t('chatWithAdmin')}
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {chattingRequest && (
                <SellRequestChatModal
                    request={chattingRequest}
                    userRole="user"
                    onClose={() => setChattingRequest(null)}
                />
            )}
        </div>
    );
};

export default SellHistory;