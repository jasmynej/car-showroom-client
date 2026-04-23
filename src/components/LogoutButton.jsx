import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './LogoutButton.css';

const LogoutButton = () =&gt; {
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const handleLogout = () =&gt; {
    logout();
    navigate('/');
  };

  return (
    &lt;button className="logout-button" onClick={handleLogout}&gt;
      Log Out
    &lt;/button&gt;
  );
};

export default LogoutButton;
