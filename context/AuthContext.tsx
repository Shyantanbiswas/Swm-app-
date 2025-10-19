import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User } from '../types';

const USER_STORAGE_KEY = 'ecotrack-user';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (mobileNumber: string) => void;
  logout: () => void;
  toggleBookingReminders: () => void;
  updateUserName: (newName: string) => void;
  updateUserProfilePicture: (pictureDataUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // On initial load, check for a saved user session
    try {
      const savedUserJson = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUserJson) {
        const savedUser = JSON.parse(savedUserJson);
        setUser(savedUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const login = (mobileNumber: string) => {
    // In a real app, this would involve an API call to fetch user data
    const mockUser: User = {
        name: 'Shyantan Biswas', // This would be fetched based on mobile number
        householdId: `HH-${mobileNumber.slice(-4)}-${mobileNumber.slice(0,2)}`,
        hasGreenBadge: true,
        bookingReminders: true, // Default to true on login
        profilePicture: '',
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  };
  
  const toggleBookingReminders = () => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, bookingReminders: !prevUser.bookingReminders };
        updateUserData(updatedUser);
        return updatedUser;
    });
  };

  const updateUserName = (newName: string) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, name: newName };
      updateUserData(updatedUser);
      return updatedUser;
    });
  };

  const updateUserProfilePicture = (pictureDataUrl: string) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, profilePicture: pictureDataUrl };
        updateUserData(updatedUser);
        return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, toggleBookingReminders, updateUserName, updateUserProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};