import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import type { Role } from '../types';

interface LoginRequest {
  userId: string;
  password: string;
  role: string;
}

interface LoginResponse {
  userId: string;
  name: string;
  role: string;
}

export default function Login() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
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
    setLoading(true);

    try {
      const response = await axios.post&lt;LoginResponse&gt;(
        'http://localhost:8080/api/auth/login',
        formData as LoginRequest
      );

      // Set context with user data
      const userData = response.data;
      setUser(userData.userId, userData.role as Role, userData.name);

      // Route based on role
      const roleHomeMap: Record&lt;string, string&gt; = {
        'CUSTOMER': '/customer/home',
        'STAFF': '/staff/home',
        'MANAGER': '/manager/home'
      };
      navigate(roleHomeMap[userData.role] || '/customer/home');

    } catch (err: any) {
      // Show inline error (fixes legacy bug - no redirect to signup)
      if (err.response &amp;&amp; err.response.status === 401) {
        setError('Invalid credentials or role mismatch');
      } else if (err.response) {
        setError(err.response.data.error || 'Login failed');
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
        &lt;h1&gt;Login&lt;/h1&gt;
        {error &amp;&amp; &lt;p className="error-text"&gt;{error}&lt;/p&gt;}

        &lt;label htmlFor="userId"&gt;User ID&lt;/label&gt;
        &lt;input
          type="text"
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          placeholder="Enter your user ID"
          required
        /&gt;

        &lt;label htmlFor="password"&gt;Password&lt;/label&gt;
        &lt;input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
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
          {loading ? 'Logging in...' : 'Login'}
        &lt;/button&gt;
        &lt;p className="auth-link"&gt;Don't have an account? &lt;Link to="/signup"&gt;Sign Up&lt;/Link&gt;&lt;/p&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
}
