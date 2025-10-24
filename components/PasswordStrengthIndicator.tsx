import React, { useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PasswordStrengthIndicatorProps {
    password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
    const { t } = useLanguage();
    const checks = useMemo(() => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /\W|_/.test(password),
        };
    }, [password]);

    const CheckItem: React.FC<{ text: string; valid: boolean }> = ({ text, valid }) => (
        <li className={`flex items-center transition-colors ${valid ? 'text-success' : 'text-slate-400'}`}>
            <CheckCircle size={14} className="mr-2" />
            <span className="text-xs">{text}</span>
        </li>
    );

    return (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <CheckItem text={t('pw8Chars')} valid={checks.length} />
            <CheckItem text={t('pwUppercase')} valid={checks.uppercase} />
            <CheckItem text={t('pwLowercase')} valid={checks.lowercase} />
            <CheckItem text={t('pwNumber')} valid={checks.number} />
            <CheckItem text={t('pwSpecial')} valid={checks.special} />
        </ul>
    );
};

export default PasswordStrengthIndicator;
