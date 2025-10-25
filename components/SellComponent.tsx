import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Package, Send, CheckCircle, Weight, Trash2, Recycle, Newspaper, GlassWater, History } from 'lucide-react';
import type { SellRequest, View } from '../types';
import { ViewType } from '../types';

interface SellComponentProps {
    setCurrentView: (view: View) => void;
}

const SellComponent: React.FC<SellComponentProps> = ({ setCurrentView }) => {
    const { user } = useAuth();
    const { addSellRequest } = useData();
    const [materials, setMaterials] = useState({
        plastic: false,
        paper: false,
        bottles: false,
        glass: false,
        other: ''
    });
    const [weightKg, setWeightKg] = useState<number | ''>('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleMaterialChange = (material: keyof Omit<typeof materials, 'other'>) => {
        setMaterials(prev => ({ ...prev, [material]: !prev[material] }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || (!materials.plastic && !materials.paper && !materials.bottles && !materials.glass && !materials.other.trim()) || !weightKg) {
            alert("Please select at least one material and enter the weight.");
            return;
        }

        const newRequest: SellRequest = {
            id: `SELL-${Date.now()}`,
            householdId: user.householdId,
            date: new Date(),
            materials,
            weightKg: Number(weightKg),
            status: 'Pending'
        };

        addSellRequest(newRequest);
        setIsSubmitted(true);
        // Reset form after a delay
        setTimeout(() => {
            setMaterials({ plastic: false, paper: false, bottles: false, glass: false, other: '' });
            setWeightKg('');
            setIsSubmitted(false);
        }, 5000);
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-4 flex flex-col items-center justify-center h-full animate-scale-in">
                <CheckCircle className="w-20 h-20 text-primary mb-4" />
                <h2 className="text-3xl font-bold text-heading-light dark:text-heading-dark">Request Submitted!</h2>
                <p className="text-text-light dark:text-text-dark mt-2 mb-6 max-w-sm">
                    Thank you! Our team has received your request and will contact you shortly to arrange the collection and payment.
                </p>
                <button
                    onClick={() => setCurrentView(ViewType.SellHistory)}
                    className="w-full max-w-sm bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg shadow-lg hover:shadow-glow-primary transition-all transform hover:scale-105"
                >
                    View My Requests
                </button>
            </div>
        );
    }
    
    const MaterialButton: React.FC<{icon: React.ElementType, label: string, isSelected: boolean, onClick: () => void}> = ({ icon: Icon, label, isSelected, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all w-full h-full ${isSelected ? 'bg-primary/10 border-primary text-primary' : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark hover:border-primary/50'}`}
        >
            <Icon size={32} />
            <span className="font-semibold mt-2 text-sm">{label}</span>
        </button>
    );

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark">Sell Recyclable Materials</h2>
                 <button onClick={() => setCurrentView(ViewType.SellHistory)} className="flex items-center text-sm font-semibold text-primary hover:underline">
                    <History size={16} className="mr-1.5"/>
                    My Requests
                </button>
            </div>

            <p className="text-text-light dark:text-text-dark mb-6">Select the materials you wish to sell and provide an estimated weight. Our team will verify and pay you upon collection.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md border border-border-light dark:border-border-dark">
                <div>
                    <label className="block text-lg font-semibold text-heading-light dark:text-heading-dark mb-3">1. Select Materials</label>
                    <div className="grid grid-cols-2 gap-4">
                        <MaterialButton icon={Trash2} label="Plastic" isSelected={materials.plastic} onClick={() => handleMaterialChange('plastic')} />
                        <MaterialButton icon={Newspaper} label="Paper" isSelected={materials.paper} onClick={() => handleMaterialChange('paper')} />
                        <MaterialButton icon={Recycle} label="Bottles" isSelected={materials.bottles} onClick={() => handleMaterialChange('bottles')} />
                        <MaterialButton icon={GlassWater} label="Glass" isSelected={materials.glass} onClick={() => handleMaterialChange('glass')} />
                    </div>
                    <input
                        type="text"
                        value={materials.other}
                        onChange={(e) => setMaterials(prev => ({...prev, other: e.target.value}))}
                        placeholder="Other materials (e.g., cardboard, metal)"
                        className="mt-4 w-full p-3 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label htmlFor="weight" className="block text-lg font-semibold text-heading-light dark:text-heading-dark mb-2">2. Estimated Weight</label>
                    <div className="relative">
                        <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            id="weight"
                            type="number"
                            value={weightKg}
                            onChange={(e) => setWeightKg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            step="0.1"
                            min="0"
                            placeholder="e.g., 5.5"
                            required
                            className="w-full p-3 pl-10 border border-border-light dark:border-border-dark bg-background-light dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">kg</span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-lg flex items-center justify-center text-lg shadow-lg hover:shadow-glow-primary transition-all transform hover:scale-105"
                >
                    <Send className="mr-3" /> Submit Request
                </button>
            </form>
        </div>
    );
};

export default SellComponent;