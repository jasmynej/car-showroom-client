import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { User } from '../types';

interface ProfilePanelProps {
  userId: string;
}

export default function ProfilePanel({ userId }: ProfilePanelProps) {
  const [user, setUser] = useState&lt;User | null&gt;(null);
  const [password, setPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() =&gt; {
    // Note: The backend uses numeric IDs, but we're storing userId as string
    // We need to fetch by the numeric ID from the user object
    // For now, we'll skip the profile fetch since we don't have the numeric ID
    // This would need to be enhanced to store the numeric ID as well
    setError('Profile loading not yet implemented for userId-based auth');
  }, [userId]);

  const handlePasswordChange = async () =&gt; {
    if (!password.trim()) return;
    try {
      // This would need the numeric ID
      setPwMsg('Password update not yet implemented for userId-based auth');
      setPassword('');
    } catch {
      setPwMsg('Failed to update password.');
    }
  };

  if (error) return &lt;div className="panel error-text"&gt;{error}&lt;/div&gt;;
  if (!user) return &lt;div className="panel"&gt;Loading profile...&lt;/div&gt;;

  return (
    &lt;div className="panel profile-panel"&gt;
      &lt;h2&gt;Profile&lt;/h2&gt;
      &lt;div className="profile-grid"&gt;
        &lt;span className="label"&gt;User ID&lt;/span&gt;&lt;span&gt;{user.userId}&lt;/span&gt;
        &lt;span className="label"&gt;Name&lt;/span&gt;&lt;span&gt;{user.name}&lt;/span&gt;
        &lt;span className="label"&gt;Email&lt;/span&gt;&lt;span&gt;{user.email}&lt;/span&gt;
        &lt;span className="label"&gt;Contact&lt;/span&gt;&lt;span&gt;{user.contactInfo}&lt;/span&gt;
        &lt;span className="label"&gt;Role&lt;/span&gt;&lt;span&gt;{user.role}&lt;/span&gt;
      &lt;/div&gt;
      &lt;div className="password-section"&gt;
        &lt;h3&gt;Change Password&lt;/h3&gt;
        &lt;div className="inline-form"&gt;
          &lt;input
            type="password"
            value={password}
            onChange={e =&gt; setPassword(e.target.value)}
            placeholder="New password"
          /&gt;
          &lt;button className="btn btn-primary" onClick={handlePasswordChange}&gt;Update&lt;/button&gt;
        &lt;/div&gt;
        {pwMsg &amp;&amp; &lt;p className="form-msg"&gt;{pwMsg}&lt;/p&gt;}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
