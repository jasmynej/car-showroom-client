import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { getRoleHomeRoute } from '../utils/roleRoutes';
import type { Role } from '../types';

export default function Login() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState&lt;Role&gt;('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) =&gt; {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const id = Number(userId);
      if (isNaN(id) || id &lt;= 0) {
        setError('User ID must be a positive number.');
        return;
      }

      const response = await authService.login({
        userId: id,
        password,
        role
      });

      // Set context with user data
      setUser(response.userId, response.role as Role, response.name);

      // Navigate to role-appropriate home
      const homeRoute = getRoleHomeRoute(response.role as Role);
      navigate(homeRoute, { replace: true });
    } catch (err: any) {
      // Display inline error, DO NOT redirect to signup
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    &lt;div className="auth-page"&gt;
      &lt;form className="auth-form" onSubmit={handleSubmit}&gt;
        &lt;h1&gt;Login&lt;/h1&gt;
        {error &amp;&amp; &lt;p className="error-text"&gt;{error}&lt;/p&gt;}

        &lt;label&gt;User ID&lt;/label&gt;
        &lt;input
          type="number"
          value={userId}
          onChange={e =&gt; setUserId(e.target.value)}
          placeholder="Enter your user ID"
          required
          disabled={loading}
        /&gt;

        &lt;label&gt;Password&lt;/label&gt;
        &lt;input
          type="password"
          value={password}
          onChange={e =&gt; setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={loading}
        /&gt;

        &lt;label&gt;Role&lt;/label&gt;
        &lt;select value={role} onChange={e =&gt; setRole(e.target.value as Role)} disabled={loading}&gt;
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
