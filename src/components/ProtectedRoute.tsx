import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { role } = useApp();

  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return <Outlet />;
}
