import React, { useState } from 'react';
import type { SellRequest, User } from '../types';
import { Check, Clock, Eye, MessageSquare, CheckCheck } from 'lucide-react';
import SellRequestChatModal from '../components/SellRequestChatModal';

interface AdminSellRequestsProps {
    sellRequests: SellRequest[];
    users: User[];
    updateSellRequest: (request: SellRequest) => void;
}

const AdminSellRequests: React.FC<AdminSellRequestsProps> = ({ sellRequests, users, updateSellRequest }) => {
    const [viewingRequest, setViewingRequest] = useState<SellRequest | null>(null);
    const [chattingRequest, setChattingRequest] = useState<SellRequest | null>(null);
    
    const getUserName = (householdId: string) => {
        return users.find(u => u.householdId === householdId)?.name || householdId;
    }

    const handleStatusChange = (request: SellRequest, newStatus: SellRequest['status']) => {
        updateSellRequest({ ...request, status: newStatus });
    }
    
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
            <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark mb-6">Sell Requests Management</h1>
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-border-light dark:border-border-dark">
                        <tr>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark">Date</th>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark">User</th>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark">Weight (kg)</th>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark">Status</th>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellRequests.map((request, index) => (
                             <tr key={request.id} className={`border-b border-border-light dark:border-border-dark ${index % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}>
                                <td className="p-4 text-text-light dark:text-text-dark">{request.date.toLocaleDateString()}</td>
                                <td className="p-4 text-heading-light dark:text-heading-dark">{getUserName(request.householdId)}</td>
                                <td className="p-4 text-text-light dark:text-text-dark">{request.weightKg} kg</td>
                                <td className="p-4">{getStatusChip(request.status)}</td>
                                <td className="p-4 text-center space-x-2">
                                     <button onClick={() => setViewingRequest(request)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-sky-500 rounded-full transition" title="View Details">
                                        <Eye size={18} />
                                    </button>
                                    {request.status === 'Pending' && (
                                        <button onClick={() => handleStatusChange(request, 'Approved')} className="p-2 text-green-500 bg-green-500/10 hover:bg-green-500/20 rounded-full transition" title="Approve Request">
                                            <Check size={18} />
                                        </button>
                                    )}
                                    {request.status === 'Approved' && (
                                        <>
                                            <button onClick={() => setChattingRequest(request)} className="p-2 text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition" title="Chat with User">
                                                <MessageSquare size={18} />
                                            </button>
                                            <button onClick={() => handleStatusChange(request, 'Completed')} className="p-2 text-purple-500 bg-purple-500/10 hover:bg-purple-500/20 rounded-full transition" title="Mark as Completed">
                                                <CheckCheck size={18} />
                                            </button>
                                        </>
                                    )}
                                    {request.status === 'Completed' && (
                                         <button onClick={() => setChattingRequest(request)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-500 rounded-full transition" title="View Chat">
                                            <MessageSquare size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {sellRequests.length === 0 && <p className="p-4 text-center text-text-light dark:text-text-dark">No sell requests found.</p>}
            </div>

            {viewingRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md relative transform transition-all animate-scale-in">
                        <div className="p-6">
                             <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-1">Sell Request Details</h3>
                            <p className="text-sm font-mono text-slate-400 mb-4">ID: {viewingRequest.id}</p>
                             <div className="space-y-2 text-text-light dark:text-text-dark">
                                <p><strong>User:</strong> {getUserName(viewingRequest.householdId)}</p>
                                <p><strong>Weight:</strong> {viewingRequest.weightKg} kg</p>
                                <div>
                                    <strong className="font-semibold text-heading-light dark:text-heading-dark">Materials:</strong>
                                    <ul className="list-disc pl-5 mt-1">
                                        {viewingRequest.materials.plastic && <li>Plastic</li>}
                                        {viewingRequest.materials.paper && <li>Paper</li>}
                                        {viewingRequest.materials.bottles && <li>Bottles</li>}
                                        {viewingRequest.materials.glass && <li>Glass</li>}
                                        {viewingRequest.materials.other && <li>Other: {viewingRequest.materials.other}</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                         <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex justify-end rounded-b-xl">
                            <button onClick={() => setViewingRequest(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold">Close</button>
                        </div>
                    </div>
                </div>
            )}
            {chattingRequest && (
                <SellRequestChatModal
                    request={chattingRequest}
                    userRole="admin"
                    onClose={() => setChattingRequest(null)}
                />
            )}
        </div>
    );
};

export default AdminSellRequests;