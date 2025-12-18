// Authentication context for mobile app
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../shared/services';
import { memoryStorage } from '../services/memoryStorage';
import { AuthenticatedUser, LoginRequest } from '../shared/types';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthenticatedUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = '@auth_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userData) {
          setUser(JSON.parse(userData));
          // Optionally refresh user data
          try {
            const refreshedUser = await authService.refreshUser();
            setUser(refreshedUser);
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(refreshedUser));
          } catch (refreshError) {
            console.warn('Could not refresh user:', refreshError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      // Clear all session memory storage
      memoryStorage.clearAll();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if server logout fails
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      memoryStorage.clearAll();
    }
  };

  const refreshUser = async (): Promise<AuthenticatedUser> => {
    try {
      const refreshedUser = await authService.refreshUser();
      setUser(refreshedUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(refreshedUser));
      return refreshedUser;
    } catch (error) {
      console.error('Refresh error:', error);
      // If refresh fails, logout
      await logout();
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isLoading: Boolean(isLoading),
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

