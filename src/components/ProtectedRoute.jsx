import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children, allowedRoles }) =&gt; {
  const { isAuthenticated, user } = useAppContext();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return &lt;Navigate to="/login" replace /&gt;;
  }

  // Authenticated but wrong role - redirect to correct home
  if (allowedRoles &amp;&amp; !allowedRoles.includes(user.role)) {
    const roleHomeMap = {
      CUSTOMER: '/customer/home',
      STAFF: '/staff/home',
      MANAGER: '/manager/home',
    };
    return &lt;Navigate to={roleHomeMap[user.role] || '/'} replace /&gt;;
  }

  // Authenticated and correct role - render children
  return children;
};

export default ProtectedRoute;
