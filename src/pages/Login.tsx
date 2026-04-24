import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import type { Role } from '../types';
import { API_BASE_URL } from '../config/api';

const roleHomeMap: Record&lt;Role, string&gt; = {
  CUSTOMER: '/customer/home',
  STAFF: '/staff/home',
  MANAGER: '/manager/home',
};

export default function Login() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState&lt;Role&gt;('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) =&gt; {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
        role,
      });

      const userData = response.data;
      setUser(userData.userId, userData.role, userData.name, userData.email);
      navigate(roleHomeMap[userData.role as Role]);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid credentials or incorrect role. Please try again.');
      } else {
        setError('Login failed. Please try again.');
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

        &lt;label&gt;Email&lt;/label&gt;
        &lt;input
          type="email"
          value={email}
          onChange={e =&gt; setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        /&gt;

        &lt;label&gt;Password&lt;/label&gt;
        &lt;input
          type="password"
          value={password}
          onChange={e =&gt; setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        /&gt;

        &lt;label&gt;Role&lt;/label&gt;
        &lt;select value={role} onChange={e =&gt; setRole(e.target.value as Role)}&gt;
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
