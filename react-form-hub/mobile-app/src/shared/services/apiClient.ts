// API Client for mobile app
import * as SecureStore from 'expo-secure-store';

// Configuration
// For physical devices, use your computer's IP address instead of localhost
// Find your IP: Mac: System Settings > Network, or run: ipconfig getifaddr en0
// Available development IPs (uncomment the one that matches your current network):
//const DEV_IP = '192.168.100.46'; // Home network
 const DEV_IP = '192.168.0.205'; // Alternative network

const API_BASE_URL = __DEV__ 
  ? `http://${DEV_IP}:3001/api`
  : 'https://vazhs.com/api'; // Production server

// Token management
export const TokenManager = {
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
};

// API Client
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(preventCache: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Prevent caching for GET requests
    if (preventCache) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    const token = await TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add cache-busting timestamp parameter to ensure unique URL for each request
    url.searchParams.append('_t', Date.now().toString());
    
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(true), // Prevent caching with headers
    } as RequestInit);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

