import { apiRequest } from './queryClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminLoginCredentials extends LoginCredentials {
  securityKey: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  adminRole: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Authentication utility functions
export const auth = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/login', credentials);
    return await response.json();
  },

  async adminLogin(credentials: AdminLoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/admin/login', credentials);
    return await response.json();
  },

  async register(data: RegisterData): Promise<void> {
    await apiRequest('POST', '/api/register', {
      ...data,
      passwordHash: data.password
    });
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuth(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.adminRole === 'standard_admin' || user?.adminRole === 'main_admin';
  },

  isMainAdmin(): boolean {
    const user = this.getUser();
    return user?.adminRole === 'main_admin';
  }
};

// JWT token utilities
export const tokenUtils = {
  isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },

  getPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
};

// Error handling for authentication
export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authErrors = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_SECURITY_KEY: 'Invalid security key',
  TOKEN_EXPIRED: 'Session expired, please log in again',
  ACCESS_DENIED: 'Access denied',
  USER_NOT_FOUND: 'User not found',
  EMAIL_EXISTS: 'An account with this email already exists'
};
