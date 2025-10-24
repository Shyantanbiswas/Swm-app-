import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { useData } from './DataContext';

const USER_ID_STORAGE_KEY = 'ecotrack-user-id';

interface LoginResult {
    success: boolean;
    message?: string;
    user?: User;
}

interface SignupParams {
    name: string;
    identifier: string; // Mobile number
    email: string;
    password?: string;
    familySize: number;
    address: User['address'];
    gramPanchayat: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  forcePasswordChange: boolean;
  login: (identifier: string, password?: string, rememberMe?: boolean) => Promise<LoginResult>;
  signup: (params: SignupParams) => Promise<LoginResult>;
  loginAsAdmin: (identifier: string) => Promise<LoginResult>;
  loginAsStaff: (identifier: string) => Promise<LoginResult>;
  logout: () => void;
  toggleBookingReminders: () => void;
  updateUserName: (newName: string) => void;
  updateUserEmail: (newEmail: string) => void;
  updateUserProfilePicture: (pictureDataUrl: string) => void;
  updateUserGramPanchayat: (gramPanchayat: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string; }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const { users, addUser, updateUser, subscriptionPlans } = useData();

  const user = users.find(u => u.householdId === loggedInUserId) || null;
  const isLoggedIn = !!user;

  useEffect(() => {
    let savedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (!savedUserId) {
        savedUserId = sessionStorage.getItem(USER_ID_STORAGE_KEY);
    }

    if (savedUserId) {
        const potentialUser = users.find(u => u.householdId === savedUserId);
        if (potentialUser) {
            setLoggedInUserId(savedUserId);
            // Re-check password strength on initial load from storage
            if (potentialUser.password && !isStrongPassword(potentialUser.password)) {
                setForcePasswordChange(true);
            }
        } else {
            localStorage.removeItem(USER_ID_STORAGE_KEY);
            sessionStorage.removeItem(USER_ID_STORAGE_KEY);
        }
    }
  }, [users]);

  const handleStreakLogic = (user: User): Partial<User> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastIncrement = user.lastStreakIncrement ? new Date(user.lastStreakIncrement) : null;
    if (lastIncrement) {
        lastIncrement.setHours(0, 0, 0, 0);
    }

    // If last increment was not today
    if (!lastIncrement || lastIncrement.getTime() !== today.getTime()) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (lastIncrement && lastIncrement.getTime() === yesterday.getTime()) {
            // Streak continues
            return {
                loginStreak: (user.loginStreak || 0) + 1,
                lastStreakIncrement: new Date(),
            };
        } else {
            // Streak resets
            return {
                loginStreak: 1,
                lastStreakIncrement: new Date(),
            };
        }
    }
    // No changes if already incremented today
    return {};
  };
  
  const isStrongPassword = (password: string): boolean => {
    if (!password) return false;
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W|_/.test(password); // Includes underscore
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
  };

  const login = async (identifier: string, password?: string, rememberMe?: boolean): Promise<LoginResult> => {
    const normalizedIdentifier = identifier.replace(/[^0-9]/g, '');

    const existingUser = users.find(u => u.identifier === normalizedIdentifier);

    if (!existingUser) {
        return { success: false, message: 'No account found with this mobile number.' };
    }
    // Allow special admin '9635929052' to log in as a household user
    if (existingUser.role !== 'household' && existingUser.identifier !== '9635929052') {
        return { success: false, message: 'Access denied for this portal.'};
    }
    if (existingUser.status === 'blocked') {
        return { success: false, message: 'Your account has been blocked. Please contact support.' };
    }
    if (existingUser.password !== password) {
        return { success: false, message: 'Invalid password.' };
    }
    
    // Check for weak password after successful login
    if (existingUser.password && !isStrongPassword(existingUser.password)) {
        setForcePasswordChange(true);
    } else {
        setForcePasswordChange(false);
    }

    const mockIpAddress = `103.12.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const streakUpdates = handleStreakLogic(existingUser);
    const updatedUser = { ...existingUser, lastLoginTime: new Date(), lastIpAddress: mockIpAddress, ...streakUpdates };
    updateUser(updatedUser);

    if (rememberMe) {
        localStorage.setItem(USER_ID_STORAGE_KEY, existingUser.householdId);
    } else {
        sessionStorage.setItem(USER_ID_STORAGE_KEY, existingUser.householdId);
    }
    setLoggedInUserId(existingUser.householdId);
    return { success: true, user: updatedUser };
  }

  const signup = async (params: SignupParams): Promise<LoginResult> => {
    const { name, identifier, email, password, familySize, address, gramPanchayat } = params;
    const normalizedIdentifier = identifier.replace(/[^0-9]/g, '');
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    if (users.some(u => u.identifier === normalizedIdentifier)) {
        return { success: false, message: 'An account with this mobile number already exists.' };
    }

    if (users.some(u => u.name.toLowerCase() === normalizedName.toLowerCase() && u.email.toLowerCase() === normalizedEmail)) {
        return { success: false, message: 'An account with this name and email combination already exists.' };
    }
    
    if (!password || !isStrongPassword(password)) {
        return { success: false, message: 'Password is not strong enough. It must be at least 8 characters and include uppercase, lowercase, a number, and a special character.' };
    }

    const householdId = `HH-${normalizedIdentifier.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const balance = familySize > subscriptionPlans.largeFamilyThreshold ? subscriptionPlans.largeFamily : subscriptionPlans.standard;

    const newUser: User = {
        name: normalizedName,
        householdId,
        identifier: normalizedIdentifier,
        password,
        role: 'household',
        status: 'active',
        hasGreenBadge: false,
        bookingReminders: true,
        profilePicture: '',
        email: normalizedEmail,
        createdAt: new Date(),
        outstandingBalance: balance,
        familySize,
        address,
        gramPanchayat,
        loginStreak: 1,
        lastStreakIncrement: new Date(),
    };
    addUser(newUser);

    sessionStorage.setItem(USER_ID_STORAGE_KEY, householdId);
    setLoggedInUserId(householdId);
    setForcePasswordChange(false); // New user has a strong password
    return { success: true, user: newUser };
  }

  const loginAsAdmin = async (identifier: string): Promise<LoginResult> => {
      const existingUser = users.find(u => u.identifier === identifier && u.role === 'admin');
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
      setForcePasswordChange(false);
      return { success: true };
  };

  const loginAsStaff = async (identifier: string): Promise<LoginResult> => {
    const staffRoles: User['role'][] = ['employee', 'captain', 'sanitaryworker'];
    const userToLogin = users.find(u => u.identifier === identifier);

    if (!userToLogin) {
        return { success: false, message: 'No account found with this number.' };
    }

    // Allow admin to log in as staff via the special number
    const isAdminOverride = userToLogin.role === 'admin' && userToLogin.identifier === '9635929052';

    if (!staffRoles.includes(userToLogin.role) && !isAdminOverride) {
        return { success: false, message: 'This account does not have staff permissions.' };
    }

    if (userToLogin.status === 'blocked') {
        return { success: false, message: 'Your account has been blocked. Please contact support.' };
    }
    
    if (userToLogin.password && !isStrongPassword(userToLogin.password)) {
        setForcePasswordChange(true);
    } else {
        setForcePasswordChange(false);
    }

    // Attendance Logic: Present if login is between 10:00 AM and 10:30 AM
    const now = new Date();
    const tenAM = new Date();
    tenAM.setHours(10, 0, 0, 0);
    const tenThirtyAM = new Date();
    tenThirtyAM.setHours(10, 30, 0, 0);
    const attendanceStatus: 'present' | 'absent' = (now >= tenAM && now <= tenThirtyAM) ? 'present' : 'absent';
    
    // Simulate getting IP address
    const mockIpAddress = `103.12.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const streakUpdates = handleStreakLogic(userToLogin);
    
    const updatedUser: User = {
        ...userToLogin,
        attendanceStatus,
        lastLoginTime: now,
        lastIpAddress: mockIpAddress,
        ...streakUpdates,
    };
    updateUser(updatedUser);

    sessionStorage.setItem(USER_ID_STORAGE_KEY, updatedUser.householdId);
    setLoggedInUserId(updatedUser.householdId);
    return { success: true, user: updatedUser };
  };
  
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; }> => {
    if (!user) {
        return { success: false, message: "No user is logged in." };
    }
    if (user.password !== currentPassword) {
        return { success: false, message: "Incorrect current password." };
    }
    if (!isStrongPassword(newPassword)) {
        return { success: false, message: "The new password is not strong enough." };
    }

    const updatedUser = { ...user, password: newPassword };
    updateUser(updatedUser);
    setForcePasswordChange(false); // Password is now strong
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
    sessionStorage.removeItem(USER_ID_STORAGE_KEY);
    localStorage.removeItem('isAdminMode');
    localStorage.removeItem('isAdminLoggedIn');
    setLoggedInUserId(null);
    setForcePasswordChange(false);
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
  
  const updateUserGramPanchayat = (gramPanchayat: string) => {
    if(user) {
        const updatedUser = { ...user, gramPanchayat };
        updateUserData(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, forcePasswordChange, login, signup, loginAsAdmin, loginAsStaff, logout, toggleBookingReminders, updateUserName, updateUserEmail, updateUserProfilePicture, updateUserGramPanchayat, changePassword }}>
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