import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { User } from '../types';

interface ProfilePanelProps {
  userId: number;
}

export default function ProfilePanel({ userId }: ProfilePanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<User>(`/users/${userId}`)
      .then(r => setUser(r.data))
      .catch(() => setError('Failed to load profile.'));
  }, [userId]);

  const handlePasswordChange = async () => {
    if (!password.trim()) return;
    try {
      await api.put(`/users/${userId}/password`, { password });
      setPwMsg('Password updated.');
      setPassword('');
    } catch {
      setPwMsg('Failed to update password.');
    }
  };

  if (error) return <div className="panel error-text">{error}</div>;
  if (!user) return <div className="panel">Loading profile...</div>;

  return (
    <div className="panel profile-panel">
      <h2>Profile</h2>
      <div className="profile-grid">
        <span className="label">User ID</span><span>{user.userId}</span>
        <span className="label">Name</span><span>{user.name}</span>
        <span className="label">Email</span><span>{user.email}</span>
        <span className="label">Contact</span><span>{user.contactInfo}</span>
        <span className="label">Role</span><span>{user.role}</span>
      </div>
      <div className="password-section">
        <h3>Change Password</h3>
        <div className="inline-form">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="New password"
          />
          <button className="btn btn-primary" onClick={handlePasswordChange}>Update</button>
        </div>
        {pwMsg && <p className="form-msg">{pwMsg}</p>}
      </div>
    </div>
  );
}
