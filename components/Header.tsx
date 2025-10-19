import React from 'react';
import type { User } from '../types';
import { ShieldCheck, Recycle, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const getUserInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  return (
    <header className="bg-gradient-to-r from-primary to-accent text-white p-4 shadow-lg w-full max-w-lg mx-auto sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
           <Recycle className="h-8 w-8" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}/>
           <h1 className="text-2xl font-bold" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>EcoTrack</h1>
        </div>
        <div className="flex items-center space-x-2">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white/50" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-dark/50 flex-shrink-0 flex items-center justify-center border-2 border-white/50">
              <span className="font-bold text-sm">{getUserInitials(user.name)}</span>
            </div>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/20 transition-colors" aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
           <button onClick={logout} className="p-2 rounded-full hover:bg-black/20 transition-colors" aria-label="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;