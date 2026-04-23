import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import './LoginPage.css';

const LoginPage = () =&gt; {
  const navigate = useNavigate();
  const { login } = useAppContext();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =&gt; {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) =&gt; {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await authService.login(formData);
    
    setLoading(false);

    if (result.success) {
      // Set context with returned user data
      login(result.data);
      
      // Route based on role
      const roleHomeMap = {
        CUSTOMER: '/customer/home',
        STAFF: '/staff/home',
        MANAGER: '/manager/home',
      };
      navigate(roleHomeMap[result.data.role] || '/customer/home');
    } else {
      // Show inline error (fix for original bug - don't redirect to signup)
      setError(result.error);
    }
  };

  return (
    &lt;div className="login-container"&gt;
      &lt;div className="login-card"&gt;
        &lt;h2&gt;Log In&lt;/h2&gt;
        &lt;form onSubmit={handleSubmit}&gt;
          &lt;div className="form-group"&gt;
            &lt;label htmlFor="email"&gt;Email&lt;/label&gt;
            &lt;input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            /&gt;
          &lt;/div&gt;

          &lt;div className="form-group"&gt;
            &lt;label htmlFor="password"&gt;Password&lt;/label&gt;
            &lt;input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            /&gt;
          &lt;/div&gt;

          &lt;div className="form-group"&gt;
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
          &lt;/div&gt;

          {error &amp;&amp; &lt;div className="error-message"&gt;{error}&lt;/div&gt;}

          &lt;button type="submit" disabled={loading}&gt;
            {loading ? 'Logging in...' : 'Log In'}
          &lt;/button&gt;
        &lt;/form&gt;

        &lt;div className="login-footer"&gt;
          Don't have an account? &lt;a href="/signup"&gt;Sign up&lt;/a&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default LoginPage;
