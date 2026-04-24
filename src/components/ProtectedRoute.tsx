import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const roleHomeMap: Record&lt;Role, string&gt; = {
  CUSTOMER: '/customer/home',
  STAFF: '/staff/home',
  MANAGER: '/manager/home',
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { role } = useApp();

  // Not authenticated
  if (!role) {
    return &lt;Navigate to="/login" replace /&gt;;
  }

  // Wrong role - redirect to correct home
  if (!allowedRoles.includes(role)) {
    return &lt;Navigate to={roleHomeMap[role]} replace /&gt;;
  }

  return &lt;Outlet /&gt;;
}
