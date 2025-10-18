import React, { useState } from 'react';
import type { Complaint } from '../types';
import { PlusCircle, Paperclip } from 'lucide-react';

interface ComplaintsComponentProps {
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
}

const ComplaintsComponent: React.FC<ComplaintsComponentProps> = ({ complaints, addComplaint }) => {
  const [showForm, setShowForm] = useState(false);
  const [issue, setIssue] = useState('');
  const [details, setDetails] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue || !details) return;

    const newComplaint: Complaint = {
      id: `CMPT-${Date.now()}`,
      date: new Date(),
      issue,
      details,
      status: 'Pending',
      photo: photo ? URL.createObjectURL(photo) : undefined,
    };
    addComplaint(newComplaint);
    setShowForm(false);
    setIssue('');
    setDetails('');
    setPhoto(null);
  };
  
  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark">Complaints & Feedback</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary-light text-white p-2 rounded-full hover:bg-primary-dark transition-transform transform hover:scale-110">
          <PlusCircle size={24} />
        </button>
      </div>

      {showForm && (
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md mb-6 border border-border-light dark:border-border-dark">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-heading-light dark:text-heading-dark">File a New Complaint</h3>
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-text-light dark:text-text-dark">Issue Type</label>
              <select
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-card-light dark:bg-slate-700 text-text-light dark:text-text-dark border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light"
              >
                <option value="">Select an issue</option>
                <option>Missed Pickup</option>
                <option>Driver Behavior</option>
                <option>Payment Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-text-light dark:text-text-dark">Details</label>
              <textarea
                id="details"
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-card-light dark:bg-slate-700 text-text-light dark:text-text-dark border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light"
                placeholder="Please provide as much detail as possible."
              />
            </div>
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-text-light dark:text-text-dark">Upload Photo (Optional)</label>
               <div className="mt-1 flex items-center space-x-2">
                 <label className="cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-text-light dark:text-text-dark font-bold py-2 px-4 rounded-lg inline-flex items-center">
                    <Paperclip size={16} className="mr-2"/>
                    <span>{photo ? photo.name : "Choose File"}</span>
                    <input type="file" id="photo" className="hidden" onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} accept="image/*" />
                 </label>
               </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark">Submit</button>
            </div>
          </form>
        </div>
      )}

      <h3 className="text-xl font-semibold text-heading-light dark:text-heading-dark mb-3">Your Complaint History</h3>
      {complaints.length === 0 ? (
        <p className="text-text-light dark:text-text-dark">No complaints filed.</p>
      ) : (
        <ul className="space-y-3">
          {complaints.map((c) => (
            <li key={c.id} className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md border border-border-light dark:border-border-dark">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-heading-light dark:text-heading-dark">{c.issue}</p>
                    <p className="text-sm text-text-light dark:text-text-dark mt-1">{c.details}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(c.status)}`}>{c.status}</span>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 border-t border-border-light dark:border-border-dark pt-2 flex justify-between">
                <span>ID: {c.id}</span>
                <span>{c.date.toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComplaintsComponent;