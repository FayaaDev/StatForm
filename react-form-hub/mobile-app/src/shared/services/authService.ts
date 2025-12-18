// Authentication service for mobile app
import { apiClient, TokenManager } from './apiClient';
import {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
} from '../types';

export const authService = {
  // Authenticate user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      // Store token
      await TokenManager.setToken(response.token);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await TokenManager.removeToken();
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await TokenManager.getToken();
    return !!token;
  },

  // Refresh user data
  async refreshUser(): Promise<AuthenticatedUser> {
    try {
      const userData = await apiClient.get<AuthenticatedUser>('/auth/me');
      return userData;
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  },

  // Check user permission for a specific disease
  hasPermissionForDisease(
    user: AuthenticatedUser,
    disease: string,
    requiredPermission: 'view' | 'edit' = 'view'
  ): boolean {
    if (!user) return false;
    
    // Check if user has the disease assigned
    if (!user.assigned_diseases.includes(disease)) return false;
    
    // Check specific disease permission
    const diseasePermission = user.disease_permissions[disease] || user.global_permission;
    
    if (requiredPermission === 'view') {
      return ['view', 'edit'].includes(diseasePermission);
    } else {
      return diseasePermission === 'edit';
    }
  },

  // Check user permission for their city
  hasPermissionForCity(
    user: AuthenticatedUser,
    requiredPermission: 'view' | 'edit' = 'view'
  ): boolean {
    if (!user) return false;
    
    if (requiredPermission === 'view') {
      return ['view', 'edit'].includes(user.global_permission);
    } else {
      return user.global_permission === 'edit';
    }
  }
};

