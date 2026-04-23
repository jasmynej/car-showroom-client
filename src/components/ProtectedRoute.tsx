import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

/**
 * Protected route component that enforces authentication and role-based access.
 * Redirects unauthenticated users to /login.
 * Redirects users with wrong role to their appropriate home page.
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { role, userId } = useApp();

  // Not authenticated - redirect to login
  if (!userId || !role) {
    return &lt;Navigate to="/login" replace /&gt;;
  }

  // Check if user has one of the allowed roles
  if (!allowedRoles.includes(role)) {
    // Redirect to user's correct home based on their role
    const roleHomeMap: Record&lt;Role, string&gt; = {
      CUSTOMER: '/customer/home',
      STAFF: '/staff/home',
      MANAGER: '/manager/home',
    };
    return &lt;Navigate to={roleHomeMap[role] || '/login'} replace /&gt;;
  }

  return &lt;Outlet /&gt;;
}
