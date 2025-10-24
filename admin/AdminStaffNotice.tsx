import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AdminStaffNotice: React.FC = () => {
    const { staffBroadcastMessage, updateStaffBroadcastMessage } = useData();
    const [message, setMessage] = useState(staffBroadcastMessage || '');
    const [isSent, setIsSent] = useState(false);
    const { t } = useLanguage();

    const handleSend = () => {
        if (message.trim()) {
            updateStaffBroadcastMessage(message.trim());
            setIsSent(true);
            setTimeout(() => setIsSent(false), 3000); // Hide confirmation after 3 seconds
        }
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark mb-6">{t('staffNotice')}</h1>
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-2">{t('sendNoticeToStaff')}</h2>
                <p className="text-text-light dark:text-text-dark mb-4">
                    {t('staffNoticeDescription')}
                </p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="broadcast-message" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                            Your Message
                        </label>
                        <textarea
                            id="broadcast-message"
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Your hard work is noticed and appreciated. Keep it up!"
                        />
                    </div>
                    <div className="flex justify-end items-center space-x-4">
                        {isSent && (
                            <div className="flex items-center text-green-600 dark:text-green-400 animate-fade-in" role="status">
                                <CheckCircle size={18} className="mr-2" />
                                <span className="text-sm font-semibold">{t('noticeUpdated')}</span>
                            </div>
                        )}
                        <button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className="bg-gradient-to-r from-primary to-accent text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center shadow-lg hover:shadow-glow-primary transition-all transform hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            <Send size={18} className="mr-2" /> {t('updateNotice')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStaffNotice;
