import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';

interface SignupRequest {
  userId: string;
  name: string;
  password: string;
  role?: string;
}

interface SignupResponse {
  id: number;
  userId: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function SignUp() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER' as Role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent&lt;HTMLInputElement | HTMLSelectElement&gt;) =&gt; {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) =&gt; {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length &lt; 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const requestData: SignupRequest = {
        userId: formData.userId,
        name: formData.name,
        password: formData.password,
        role: formData.role
      };

      const response = await axios.post&lt;SignupResponse&gt;(
        'http://localhost:8080/api/auth/signup',
        requestData
      );

      // Set context with user data from response
      const userData = response.data;
      setUser(userData.userId, userData.role as Role, userData.name);

      // Route based on role (fixes legacy bug)
      const roleHomeMap: Record&lt;string, string&gt; = {
        'CUSTOMER': '/customer/home',
        'STAFF': '/staff/home',
        'MANAGER': '/manager/home'
      };
      navigate(roleHomeMap[userData.role] || '/customer/home');

    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || 'Signup failed');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    &lt;div className="auth-page"&gt;
      &lt;form className="auth-form" onSubmit={handleSubmit}&gt;
        &lt;h1&gt;Sign Up&lt;/h1&gt;
        {error &amp;&amp; &lt;p className="error-text"&gt;{error}&lt;/p&gt;}

        &lt;label htmlFor="userId"&gt;User ID&lt;/label&gt;
        &lt;input
          id="userId"
          name="userId"
          type="text"
          value={formData.userId}
          onChange={handleChange}
          placeholder="Choose a user ID"
          minLength={3}
          maxLength={50}
          required
        /&gt;

        &lt;label htmlFor="name"&gt;Name&lt;/label&gt;
        &lt;input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          maxLength={100}
          required
        /&gt;

        &lt;label htmlFor="password"&gt;Password&lt;/label&gt;
        &lt;input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          minLength={8}
          required
        /&gt;

        &lt;label htmlFor="confirmPassword"&gt;Confirm Password&lt;/label&gt;
        &lt;input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
          required
        /&gt;

        &lt;label htmlFor="role"&gt;Role&lt;/label&gt;
        &lt;select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        &gt;
          &lt;option value="CUSTOMER"&gt;Customer&lt;/option&gt;
          &lt;option value="STAFF"&gt;Staff&lt;/option&gt;
          &lt;option value="MANAGER"&gt;Manager&lt;/option&gt;
        &lt;/select&gt;

        &lt;button type="submit" className="btn btn-primary btn-full" disabled={loading}&gt;
          {loading ? 'Signing up...' : 'Sign Up'}
        &lt;/button&gt;
        &lt;p className="auth-link"&gt;Already have an account? &lt;Link to="/login"&gt;Login&lt;/Link&gt;&lt;/p&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
}
