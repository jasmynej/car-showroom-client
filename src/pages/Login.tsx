import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';

export default function Login() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(userId);
    if (!userId || isNaN(id) || id <= 0) {
      setError('User ID must be a positive number.');
      return;
    }
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    setUser(id, role, name.trim());
    navigate(`/${role.toLowerCase()}/home`);
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="error-text">{error}</p>}

        <label>User ID</label>
        <input
          type="number"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="Enter your user ID"
          required
        />

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your display name"
          required
        />

        <label>Role</label>
        <select value={role} onChange={e => setRole(e.target.value as Role)}>
          <option value="CUSTOMER">Customer</option>
          <option value="STAFF">Staff</option>
          <option value="MANAGER">Manager</option>
        </select>

        <button type="submit" className="btn btn-primary btn-full">Login</button>
        <p className="auth-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
}
