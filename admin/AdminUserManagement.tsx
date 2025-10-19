import React, { useState, Fragment } from 'react';
import type { User } from '../types';
import { Pencil, Save, AlertTriangle, ShieldOff, Shield, Trash2, Eye, EyeOff, Info } from 'lucide-react';
import { useData } from '../context/DataContext';

interface AdminUserManagementProps {
    users: User[];
    updateUser: (user: User) => void;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, updateUser }) => {
    const { deleteUser } = useData();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [warningUser, setWarningUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const getUserInitials = (name: string) => {
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email || '');
    }

    const handleViewClick = (user: User) => {
        setViewingUser(user);
        setIsPasswordVisible(false);
    }
    
    const handleWarnClick = (user: User) => {
        setWarningUser(user);
        setWarningMessage('');
    }

    const handleDeleteClick = (user: User) => {
        setDeletingUser(user);
    }

    const handleBlockToggle = (user: User) => {
        const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
        updateUser({ ...user, status: newStatus });
    }
    
    const closeModals = () => {
        setEditingUser(null);
        setWarningUser(null);
        setDeletingUser(null);
        setViewingUser(null);
        setName('');
        setEmail('');
        setWarningMessage('');
    }

    const handleSaveChanges = () => {
        if (editingUser) {
            updateUser({ ...editingUser, name, email });
            closeModals();
        }
    }

    const handleSendWarning = () => {
        if (warningUser && warningMessage) {
            updateUser({ ...warningUser, status: 'warned', warningMessage });
            closeModals();
        }
    }
    
    const handleConfirmDelete = () => {
        if (deletingUser) {
            deleteUser(deletingUser.householdId);
            closeModals();
        }
    }

    const getStatusChip = (status: User['status']) => {
        switch (status) {
            case 'active':
                return <span className="text-xs font-semibold text-success bg-success/10 dark:bg-success/20 px-2 py-1 rounded-full">Active</span>;
            case 'blocked':
                return <span className="text-xs font-semibold text-red-600 bg-red-500/10 dark:bg-red-500/20 px-2 py-1 rounded-full">Blocked</span>;
            case 'warned':
                 return <span className="text-xs font-semibold text-warning-dark dark:text-warning bg-warning/10 dark:bg-warning/20 px-2 py-1 rounded-full">Warned</span>;
        }
    }

    return (
         <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark mb-6">User Management</h1>
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-border-light dark:border-border-dark">
                        <tr>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark">User</th>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark">Identifier</th>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark">Status</th>
                            <th className="p-4 font-semibold text-text-light dark:text-text-dark text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                             <tr key={user.householdId} className={`border-b border-border-light dark:border-border-dark ${index % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}>
                                <td className="p-4 text-heading-light dark:text-heading-dark">
                                    <div className="flex items-center space-x-3">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                                                <span className="font-bold text-sm text-primary">{getUserInitials(user.name)}</span>
                                            </div>
                                        )}
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-text-light dark:text-text-dark font-mono text-sm">{user.identifier}</td>
                                <td className="p-4">{getStatusChip(user.status)}</td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center items-center space-x-1">
                                         <button onClick={() => handleViewClick(user)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-500 rounded-full transition" title="View Details">
                                            <Info size={18} />
                                        </button>
                                        <button onClick={() => handleEditClick(user)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary rounded-full transition" title="Edit User">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleWarnClick(user)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-500 rounded-full transition" title="Warn User">
                                            <AlertTriangle size={18} />
                                        </button>
                                        <button onClick={() => handleBlockToggle(user)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition" title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}>
                                            {user.status === 'blocked' ? <Shield size={18} className="text-success" /> : <ShieldOff size={18} className="text-red-500" />}
                                        </button>
                                        <button onClick={() => handleDeleteClick(user)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-600 rounded-full transition" title="Delete User">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {viewingUser && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md relative transform transition-all animate-scale-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-4">User Details</h3>
                            <div className="space-y-3 text-sm">
                                <p><strong>Name:</strong> {viewingUser.name}</p>
                                <p><strong>Identifier:</strong> {viewingUser.identifier}</p>
                                <p><strong>Email:</strong> {viewingUser.email || 'N/A'}</p>
                                <p><strong>Household ID:</strong> {viewingUser.householdId}</p>
                                <div className="flex items-center">
                                    <strong className="mr-2">Password:</strong>
                                    <span className={`font-mono ${!isPasswordVisible ? 'blur-sm' : ''}`}>{viewingUser.password || 'Not Set'}</span>
                                    <button onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="ml-auto p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                                        {isPasswordVisible ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>
                        </div>
                         <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex justify-end space-x-3 rounded-b-xl">
                            <button onClick={closeModals} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {editingUser && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md relative transform transition-all animate-scale-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-4">Edit User: {editingUser.name}</h3>
                             <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Full Name</label>
                                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 pl-4 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Email Address</label>
                                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 pl-4 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex justify-end space-x-3 rounded-b-xl">
                            <button onClick={closeModals} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold">Cancel</button>
                            <button onClick={handleSaveChanges} className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow-primary font-semibold flex items-center"><Save size={16} className="mr-2"/> Save</button>
                        </div>
                    </div>
                </div>
            )}
            
            {warningUser && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md relative transform transition-all animate-scale-in">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-4">Warn User: {warningUser.name}</h3>
                            <p className="text-sm text-text-light dark:text-text-dark mb-3">Enter a message that will be shown to the user upon their next login. They must acknowledge it to continue.</p>
                            <textarea value={warningMessage} onChange={(e) => setWarningMessage(e.target.value)} rows={4} className="w-full p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Please be respectful to our staff..."></textarea>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex justify-end space-x-3 rounded-b-xl">
                            <button onClick={closeModals} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold">Cancel</button>
                            <button onClick={handleSendWarning} disabled={!warningMessage.trim()} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"><AlertTriangle size={16} className="mr-2"/> Send Warning</button>
                        </div>
                    </div>
                </div>
            )}

            {deletingUser && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md relative transform transition-all animate-scale-in">
                        <div className="p-6 text-center">
                            <Trash2 size={40} className="mx-auto text-red-500 mb-4"/>
                            <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-2">Are you sure?</h3>
                            <p className="text-text-light dark:text-text-dark">You are about to delete the user <strong className="text-heading-light dark:text-heading-dark">{deletingUser.name}</strong>. All associated data will be removed. This action cannot be undone.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex justify-center space-x-3 rounded-b-xl">
                            <button onClick={closeModals} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold">Cancel</button>
                            <button onClick={handleConfirmDelete} className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold flex items-center"><Trash2 size={16} className="mr-2"/> Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminUserManagement;