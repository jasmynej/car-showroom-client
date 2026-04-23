import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';

export default function SignUp() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactInfo: '',
    role: 'CUSTOMER' as Role,
    terms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string | boolean) =&gt;
    setForm(prev =&gt; ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) =&gt; {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.terms) {
      setError('You must accept the Terms &amp; Conditions.');
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        contactInfo: form.contactInfo,
        role: form.role,
      });
      
      // Set user context
      setUser(response.userId, response.role, response.name);
      
      // Redirect to customer home (default role)
      navigate('/customer/home');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    &lt;div className="auth-page"&gt;
      &lt;form className="auth-form" onSubmit={handleSubmit}&gt;
        &lt;h1&gt;Sign Up&lt;/h1&gt;
        {error &amp;&amp; &lt;p className="error-text"&gt;{error}&lt;/p&gt;}

        &lt;label&gt;Name&lt;/label&gt;
        &lt;input type="text" value={form.name} onChange={e =&gt; set('name', e.target.value)} required /&gt;

        &lt;label&gt;Email&lt;/label&gt;
        &lt;input type="email" value={form.email} onChange={e =&gt; set('email', e.target.value)} required /&gt;

        &lt;label&gt;Password&lt;/label&gt;
        &lt;input type="password" value={form.password} onChange={e =&gt; set('password', e.target.value)} required /&gt;

        &lt;label&gt;Confirm Password&lt;/label&gt;
        &lt;input type="password" value={form.confirmPassword} onChange={e =&gt; set('confirmPassword', e.target.value)} required /&gt;

        &lt;label&gt;Contact Information&lt;/label&gt;
        &lt;textarea value={form.contactInfo} onChange={e =&gt; set('contactInfo', e.target.value)} rows={3} /&gt;

        &lt;label&gt;Role&lt;/label&gt;
        &lt;select value={form.role} onChange={e =&gt; set('role', e.target.value)}&gt;
          &lt;option value="CUSTOMER"&gt;Customer&lt;/option&gt;
          &lt;option value="STAFF"&gt;Staff&lt;/option&gt;
          &lt;option value="MANAGER"&gt;Manager&lt;/option&gt;
        &lt;/select&gt;

        &lt;label className="checkbox-label"&gt;
          &lt;input type="checkbox" checked={form.terms} onChange={e =&gt; set('terms', e.target.checked)} /&gt;
          I agree to the Terms &amp; Conditions
        &lt;/label&gt;

        &lt;button type="submit" className="btn btn-primary btn-full" disabled={loading}&gt;
          {loading ? 'Creating account...' : 'Sign Up'}
        &lt;/button&gt;
        &lt;p className="auth-link"&gt;Already have an account? &lt;Link to="/login"&gt;Login&lt;/Link&gt;&lt;/p&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  );
}
