import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { X, Send, User as UserIcon, Shield } from 'lucide-react';
import type { SellRequest } from '../types';

interface SellRequestChatModalProps {
  request: SellRequest;
  userRole: 'user' | 'admin';
  onClose: () => void;
}

const SellRequestChatModal: React.FC<SellRequestChatModalProps> = ({ request, userRole, onClose }) => {
  const { users, sellRequestMessages, addSellRequestMessage } = useData();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const requestUser = useMemo(() => users.find(u => u.householdId === request.householdId), [users, request]);

  const messages = useMemo(() => {
    return sellRequestMessages
        .filter(m => m.sellRequestId === request.id)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [sellRequestMessages, request.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    addSellRequestMessage({
        sellRequestId: request.id,
        sender: userRole,
        text: input,
    });
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-md h-[80vh] bg-card-light dark:bg-card-dark rounded-2xl shadow-xl flex flex-col">
        <header className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg">Chat for Request #{request.id.slice(-6)}</h3>
            <p className="text-xs opacity-80">Regarding {request.weightKg}kg of materials from {requestUser?.name}</p>
          </div>
          <button onClick={onClose} className="hover:bg-black/20 p-1 rounded-full"><X size={24} /></button>
        </header>

        <div className="flex-grow p-4 overflow-y-auto bg-background-light dark:bg-slate-900">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === userRole ? 'justify-end' : 'justify-start'} animate-scale-in`}>
                {msg.sender !== userRole && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'admin' ? 'bg-slate-600 text-white' : 'bg-primary text-white'}`}>
                        {msg.sender === 'admin' ? <Shield size={20} /> : <UserIcon size={20} />}
                    </div>
                )}
                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${msg.sender === userRole ? 'bg-gradient-to-br from-primary to-accent text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-4 border-t border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-b-2xl flex-shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow p-3 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-primary to-accent text-white p-3 rounded-full hover:shadow-glow-primary transition"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellRequestChatModal;