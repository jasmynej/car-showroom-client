/**
 * Authentication service for API communication.
 * Handles user signup, login, and password updates.
 */

const API_BASE_URL = 'http://localhost:8080/api';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  contactInfo?: string;
  role?: 'CUSTOMER' | 'STAFF' | 'MANAGER';
  department?: string;  // For MANAGER role
  designation?: string; // For STAFF role
}

export interface LoginRequest {
  userId: number;
  password: string;
  role: 'CUSTOMER' | 'STAFF' | 'MANAGER';
}

export interface AuthResponse {
  userId: number;
  name: string;
  role: 'CUSTOMER' | 'STAFF' | 'MANAGER';
}

export const authService = {
  /**
   * Register a new user.
   * Role defaults to CUSTOMER if not provided.
   *
   * @param data Signup request data
   * @returns AuthResponse with user details
   * @throws Error if signup fails
   */
  async signup(data: SignupRequest): Promise&lt;AuthResponse&gt; {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Email already registered');
      }
      throw new Error('Signup failed');
    }

    return response.json();
  },

  /**
   * Authenticate a user with their credentials and role.
   *
   * @param data Login request data
   * @returns AuthResponse with user details
   * @throws Error with specific message if login fails
   */
  async login(data: LoginRequest): Promise&lt;AuthResponse&gt; {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials or role mismatch');
      }
      throw new Error('Login failed');
    }

    return response.json();
  },

  /**
   * Update user password.
   *
   * @param userId User ID
   * @param newPassword New password
   * @throws Error if password update fails
   */
  async updatePassword(userId: number, newPassword: string): Promise&lt;void&gt; {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      throw new Error('Password update failed');
    }
  },
};
