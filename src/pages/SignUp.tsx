import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useApp } from '../context/AppContext';
import type { User } from '../types';

export default function SignUp() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactInfo: '',
    terms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.terms) {
      setError('You must accept the Terms & Conditions.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<User>('/users', {
        name: form.name,
        email: form.email,
        password: form.password,
        contactInfo: form.contactInfo,
        role: 'CUSTOMER',
        department: null,
        designation: null,
      });
      const user = res.data;
      setUser(user.userId, user.role, user.name);
      navigate('/customer/home');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {error && <p className="error-text">{error}</p>}

        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={form.name} onChange={e => set('name', e.target.value)} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={form.password} onChange={e => set('password', e.target.value)} required />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />

        <label htmlFor="contactInfo">Contact Information</label>
        <textarea id="contactInfo" value={form.contactInfo} onChange={e => set('contactInfo', e.target.value)} rows={3} required />

        <label className="checkbox-label">
          <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} />
          I agree to the Terms &amp; Conditions
        </label>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
