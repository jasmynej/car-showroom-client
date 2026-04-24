import type { Role } from '../types';

export const ROLE_ROUTES: Record&lt;Role, string&gt; = {
  CUSTOMER: '/customer/home',
  STAFF: '/staff/home',
  MANAGER: '/manager/home'
};

export const getRoleHomeRoute = (role: Role): string =&gt; {
  return ROLE_ROUTES[role] || '/customer/home';
};
