import api from '../api/axios';
import type { Role } from '../types';

export interface LoginRequest {
  userId: number;
  password: string;
  role: string;
}

export interface LoginResponse {
  userId: number;
  name: string;
  role: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  contactInfo?: string;
  department?: string;
  designation?: string;
}

export interface SignupResponse {
  userId: number;
  name: string;
  email: string;
  role: Role;
  contactInfo?: string;
  department?: string;
  designation?: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise&lt;LoginResponse&gt; {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async signup(userData: SignupRequest): Promise&lt;SignupResponse&gt; {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async updatePassword(userId: number, newPassword: string): Promise&lt;void&gt; {
    await api.put(`/users/${userId}/password`, { password: newPassword });
  }
};
