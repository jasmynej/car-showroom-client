import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AppProvider } from '../context/AppContext';
import type { Role } from '../types';

/**
 * Test suite for ProtectedRoute component
 * Tests route protection based on user authentication and role
 */
describe('ProtectedRoute', () => {
  /**
   * Mock component for testing protected content
   */
  const ProtectedContent = () => <div>Protected Content</div>;
  const LoginPage = () => <div>Login Page</div>;

  /**
   * Helper function to render ProtectedRoute with context
   */
  const renderWithRouter = (allowedRoles: string[], userRole: Role | null = null, userId: number | null = null) => {
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <AppProvider>
          <MockAppContext role={userRole} userId={userId}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                <Route path="/protected" element={<ProtectedContent />} />
              </Route>
            </Routes>
          </MockAppContext>
        </AppProvider>
      </MemoryRouter>
    );
  };

  /**
   * Mock context wrapper to set user state
   */
  const MockAppContext = ({ children, role, userId }: { children: React.ReactNode; role: Role | null; userId: number | null }) => {
    const { useApp } = require('../context/AppContext');
    const { setUser } = useApp();
    
    React.useEffect(() => {
      if (role && userId) {
        setUser(userId, role, 'Test User');
      }
    }, [role, userId, setUser]);
    
    return <>{children}</>;
  };

  /**
   * Test redirect to login when user is not authenticated
   * Scenario: User tries to access protected route without logging in
   * Expected: Should redirect to login page
   */
  it('should redirect to login when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/protected" element={<ProtectedContent />} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  /**
   * Test redirect to login when user role is not allowed
   * Scenario: User with STAFF role tries to access CUSTOMER-only route
   * Expected: Should redirect to login page
   */
  it('should redirect to login when user role is not allowed', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/protected" element={<ProtectedContent />} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  /**
   * Test allowing access with correct role
   * Scenario: User with CUSTOMER role accesses CUSTOMER-allowed route
   * Expected: Should render protected content
   */
  it('should allow access when user has correct role', () => {
    const { useApp } = require('../context/AppContext');
    const TestWrapper = () => {
      const { setUser } = useApp();
      React.useEffect(() => {
        setUser(1, 'CUSTOMER', 'Test User');
      }, [setUser]);
      return null;
    };

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AppProvider>
          <TestWrapper />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/protected" element={<ProtectedContent />} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  /**
   * Test allowing multiple roles
   * Scenario: Route allows both STAFF and MANAGER roles
   * Expected: Both roles should have access
   */
  it('should allow access when user role is in allowed roles list', () => {
    const { useApp } = require('../context/AppContext');
    const TestWrapper = () => {
      const { setUser } = useApp();
      React.useEffect(() => {
        setUser(2, 'STAFF', 'Staff User');
      }, [setUser]);
      return null;
    };

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AppProvider>
          <TestWrapper />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute allowedRoles={['STAFF', 'MANAGER']} />}>
              <Route path="/protected" element={<ProtectedContent />} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  /**
   * Test rendering Outlet for nested routes
   * Scenario: Protected route has nested child routes
   * Expected: Should render child routes via Outlet
   */
  it('should render Outlet for nested routes', () => {
    const { useApp } = require('../context/AppContext');
    const NestedContent = () => <div>Nested Route Content</div>;
    const TestWrapper = () => {
      const { setUser } = useApp();
      React.useEffect(() => {
        setUser(1, 'MANAGER', 'Manager User');
      }, [setUser]);
      return null;
    };

    render(
      <MemoryRouter initialEntries={['/protected/nested']}>
        <AppProvider>
          <TestWrapper />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
              <Route path="/protected/nested" element={<NestedContent />} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Nested Route Content')).toBeInTheDocument();
  });
});
