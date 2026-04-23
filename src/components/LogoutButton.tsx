import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Logout button component.
 * Clears user context and redirects to landing page.
 */
export default function LogoutButton() {
  const navigate = useNavigate();
  const { clearUser } = useApp();

  const handleLogout = () =&gt; {
    clearUser();
    navigate('/');
  };

  return (
    &lt;button onClick={handleLogout} className="btn btn-secondary"&gt;
      Log Out
    &lt;/button&gt;
  );
}
