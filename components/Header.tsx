import React from 'react';
import type { User } from '../types';
import { ShieldCheck, Recycle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-primary-dark to-primary-light text-white p-4 shadow-md w-full max-w-lg mx-auto sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
           <Recycle className="h-8 w-8" />
           <h1 className="text-2xl font-bold">EcoTrack</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-sm">{user.name}</p>
            <div className="flex items-center justify-end space-x-1">
              <p className="text-xs opacity-80">ID: {user.householdId}</p>
              {user.hasGreenBadge && (
                <ShieldCheck className="w-4 h-4 text-green-300" title="Green Badge Holder" />
              )}
            </div>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/20 transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;