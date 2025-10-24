import React from 'react';
import { GRAM_PANCHAYATS } from '../types';
import { Globe } from 'lucide-react';

interface GramPanchayatSelectorProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

const GramPanchayatSelector: React.FC<GramPanchayatSelectorProps> = ({
    value,
    onChange,
    disabled = false,
    required = false,
    className = ''
}) => {
    return (
        <div className={`relative w-full ${className}`}>
             <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className="w-full appearance-none p-3 pl-12 border border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="" disabled>
                    Select Gram Panchayat
                </option>
                {GRAM_PANCHAYATS.map(gp => (
                    <option key={gp} value={gp}>
                        {gp}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default GramPanchayatSelector;