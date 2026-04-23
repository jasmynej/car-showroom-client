import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import './SignupPage.css';

const SignupPage = () =&gt; {
  const navigate = useNavigate();
  const { login } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER', // Default to CUSTOMER
    contactInfo: '',
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

    const result = await authService.register(formData);
    
    setLoading(false);

    if (result.success) {
      // Set context with returned user data
      login(result.data);
      
      // Route based on role (fix for original bug)
      const roleHomeMap = {
        CUSTOMER: '/customer/home',
        STAFF: '/staff/home',
        MANAGER: '/manager/home',
      };
      navigate(roleHomeMap[result.data.role] || '/customer/home');
    } else {
      setError(result.error);
    }
  };

  return (
    &lt;div className="signup-container"&gt;
      &lt;div className="signup-card"&gt;
        &lt;h2&gt;Sign Up&lt;/h2&gt;
        &lt;form onSubmit={handleSubmit}&gt;
          &lt;div className="form-group"&gt;
            &lt;label htmlFor="name"&gt;Name&lt;/label&gt;
            &lt;input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            /&gt;
          &lt;/div&gt;

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
            &lt;label htmlFor="contactInfo"&gt;Contact Info (Optional)&lt;/label&gt;
            &lt;input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
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
            {loading ? 'Signing up...' : 'Sign Up'}
          &lt;/button&gt;
        &lt;/form&gt;

        &lt;div className="signup-footer"&gt;
          Already have an account? &lt;a href="/login"&gt;Log in&lt;/a&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default SignupPage;
