import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRoleHomeRoute } from '../utils/roleRoutes';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { role } = useApp();

  // Not authenticated - redirect to login
  if (!role) {
    return &lt;Navigate to="/login" replace /&gt;;
  }

  // Wrong role - redirect to correct home
  if (!allowedRoles.includes(role)) {
    const correctHome = getRoleHomeRoute(role);
    return &lt;Navigate to={correctHome} replace /&gt;;
  }

  // Authorized - render children
  return &lt;Outlet /&gt;;
}
