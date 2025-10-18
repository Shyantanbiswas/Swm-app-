import React from 'react';
import type { Payment } from '../types';
import { FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { NGO_NAME } from '../constants';

interface HistoryComponentProps {
  payments: Payment[];
}

const HistoryComponent: React.FC<HistoryComponentProps> = ({ payments }) => {
    
    const generatePDF = (payment: Payment) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text(`${NGO_NAME}`, 105, 20, { align: 'center' });
        doc.setFontSize(16);
        doc.text("Payment Receipt", 105, 30, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        doc.setFontSize(12);
        doc.text("Transaction ID:", 20, 50);
        doc.text(payment.id, 80, 50);
        doc.text("Date & Time:", 20, 60);
        doc.text(payment.date.toLocaleString(), 80, 60);
        doc.text("Amount Paid:", 20, 70);
        doc.setFont("helvetica", "bold");
        doc.text(`INR ${payment.amount.toFixed(2)}`, 80, 70);
        doc.setFont("helvetica", "normal");
        doc.text("Status:", 20, 80);
        doc.setTextColor(34, 197, 94);
        doc.text("SUCCESSFUL", 80, 80);
        doc.setTextColor(0, 0, 0);
        doc.line(20, 90, 190, 90);
        doc.save(`Receipt-${payment.id}.pdf`);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">Payment History</h2>
            {payments.length === 0 ? (
                <p className="text-text-light dark:text-text-dark">No payment history found.</p>
            ) : (
                <ul className="space-y-3">
                    {payments.map((payment) => (
                        <li key={payment.id} className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md flex justify-between items-center border border-border-light dark:border-border-dark transition-all hover:shadow-lg hover:border-primary-light">
                            <div>
                                <p className="font-bold text-primary-light text-lg">₹{payment.amount.toFixed(2)}</p>
                                <p className="text-sm text-text-light dark:text-text-dark">{payment.date.toLocaleDateString()}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{payment.id}</p>
                            </div>
                            <button onClick={() => generatePDF(payment)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-light rounded-full transition">
                                <FileText size={24} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistoryComponent;