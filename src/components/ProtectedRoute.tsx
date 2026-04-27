import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { role, isAuthenticated } = useApp();

  // Not authenticated - redirect to login
  if (!isAuthenticated()) {
    return &lt;Navigate to="/login" replace /&gt;;
  }

  // Authenticated but wrong role - redirect to correct home
  if (role &amp;&amp; !allowedRoles.includes(role)) {
    const roleHomeMap: Record&lt;Role, string&gt; = {
      'CUSTOMER': '/customer/home',
      'STAFF': '/staff/home',
      'MANAGER': '/manager/home'
    };
    return &lt;Navigate to={roleHomeMap[role] || '/login'} replace /&gt;;
  }

  // Authenticated and correct role
  return &lt;Outlet /&gt;;
}
