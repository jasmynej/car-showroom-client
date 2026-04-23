import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';

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
      const response = await login({ email, password, role });
      
      // Set user context
      setUser(response.userId, response.role, response.name);
      
      // Redirect based on role
      const roleHomeMap: Record&lt;Role, string&gt; = {
        CUSTOMER: '/customer/home',
        STAFF: '/staff/home',
        MANAGER: '/manager/home',
      };
      
      navigate(roleHomeMap[response.role] || '/customer/home');
    } catch (err: unknown) {
      // Show inline error - DO NOT redirect
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Login failed. Please check your credentials.');
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
