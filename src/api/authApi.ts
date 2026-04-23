import axios from './axios';
import type { Role } from '../types';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
  contactInfo?: string;
  department?: string;
  designation?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  userId: number;
  name: string;
  email: string;
  role: Role;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise&lt;AuthResponse&gt; =&gt; {
  const response = await axios.post&lt;AuthResponse&gt;('/auth/register', data);
  return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise&lt;AuthResponse&gt; =&gt; {
  const response = await axios.post&lt;AuthResponse&gt;('/auth/login', data);
  return response.data;
};
