import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { useData } from './DataContext';

const USER_ID_STORAGE_KEY = 'ecotrack-user-id';

interface LoginResult {
    success: boolean;
    message?: string;
    user?: User;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (identifier: string, password?: string, rememberMe?: boolean) => Promise<LoginResult>;
  signup: (name: string, identifier: string, password?: string) => Promise<LoginResult>;
  loginAsAdmin: (identifier: string) => Promise<LoginResult>;
  logout: () => void;
  toggleBookingReminders: () => void;
  updateUserName: (newName: string) => void;
  updateUserEmail: (newEmail: string) => void;
  updateUserProfilePicture: (pictureDataUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const { users, addUser, updateUser } = useData();

  const user = users.find(u => u.householdId === loggedInUserId) || null;
  const isLoggedIn = !!user;

  useEffect(() => {
    let savedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (!savedUserId) {
        savedUserId = sessionStorage.getItem(USER_ID_STORAGE_KEY);
    }

    if (savedUserId) {
        if (users.some(u => u.householdId === savedUserId)) {
            setLoggedInUserId(savedUserId);
        } else {
            localStorage.removeItem(USER_ID_STORAGE_KEY);
            sessionStorage.removeItem(USER_ID_STORAGE_KEY);
        }
    }
  }, [users]);

  const login = async (identifier: string, password?: string, rememberMe?: boolean): Promise<LoginResult> => {
    const isEmail = identifier.includes('@');
    const normalizedIdentifier = isEmail ? identifier.toLowerCase() : identifier.replace(/[^0-9]/g, '');

    const existingUser = users.find(u => u.identifier === normalizedIdentifier);

    if (!existingUser) {
        return { success: false, message: 'No account found with this identifier.' };
    }
    if (existingUser.status === 'blocked') {
        return { success: false, message: 'Your account has been blocked. Please contact support.' };
    }
    if (existingUser.password !== password) {
        return { success: false, message: 'Invalid password.' };
    }
    
    if (rememberMe) {
        localStorage.setItem(USER_ID_STORAGE_KEY, existingUser.householdId);
    } else {
        sessionStorage.setItem(USER_ID_STORAGE_KEY, existingUser.householdId);
    }
    setLoggedInUserId(existingUser.householdId);
    return { success: true, user: existingUser };
  }
  
  const signup = async (name: string, identifier: string, password?: string): Promise<LoginResult> => {
    const isEmail = identifier.includes('@');
    const normalizedIdentifier = isEmail ? identifier.toLowerCase() : identifier.replace(/[^0-9]/g, '');

    if (users.some(u => u.identifier === normalizedIdentifier)) {
        return { success: false, message: 'An account with this identifier already exists.' };
    }

    const householdId = `HH-${normalizedIdentifier.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newUser: User = {
        name,
        householdId,
        identifier: normalizedIdentifier,
        password,
        status: 'active',
        hasGreenBadge: false,
        bookingReminders: true,
        profilePicture: '',
        email: isEmail ? normalizedIdentifier : '',
    };
    addUser(newUser);

    sessionStorage.setItem(USER_ID_STORAGE_KEY, householdId);
    setLoggedInUserId(householdId);
    return { success: true, user: newUser };
  }

  const loginAsAdmin = async (identifier: string): Promise<LoginResult> => {
      const existingUser = users.find(u => u.identifier === identifier);
      if (!existingUser) {
           return { success: false, message: 'Admin account not found.' };
      }
      if (existingUser.status === 'blocked') {
        return { success: false, message: 'Your account has been blocked. Please contact support.' };
      }
      
      localStorage.setItem(USER_ID_STORAGE_KEY, existingUser.householdId);
      localStorage.setItem('isAdminMode', 'true');
      localStorage.setItem('isAdminLoggedIn', 'true');
      setLoggedInUserId(existingUser.householdId);
      return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
    sessionStorage.removeItem(USER_ID_STORAGE_KEY);
    localStorage.removeItem('isAdminMode');
    localStorage.removeItem('isAdminLoggedIn');
    setLoggedInUserId(null);
  };

  const updateUserData = (updatedUser: User) => {
    updateUser(updatedUser);
  };
  
  const toggleBookingReminders = () => {
    if(user) {
        const updatedUser = { ...user, bookingReminders: !user.bookingReminders };
        updateUserData(updatedUser);
    }
  };

  const updateUserName = (newName: string) => {
    if(user) {
      const updatedUser = { ...user, name: newName };
      updateUserData(updatedUser);
    }
  };

   const updateUserEmail = (newEmail: string) => {
    if(user) {
      const updatedUser = { ...user, email: newEmail };
      updateUserData(updatedUser);
    }
  };

  const updateUserProfilePicture = (pictureDataUrl: string) => {
     if(user) {
        const updatedUser = { ...user, profilePicture: pictureDataUrl };
        updateUserData(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, loginAsAdmin, logout, toggleBookingReminders, updateUserName, updateUserEmail, updateUserProfilePicture }}>
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