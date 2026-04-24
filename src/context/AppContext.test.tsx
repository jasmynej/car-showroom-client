import { render, screen, renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from './AppContext';
import type { Role } from '../types';

/**
 * Test suite for AppContext
 * Tests the application context provider and hook for managing user state
 */
describe('AppContext', () => {
  /**
   * Test that AppProvider renders children correctly
   * Scenario: Provider wraps child components
   * Expected: Children are rendered without errors
   */
  it('should render children correctly', () => {
    render(
      <AppProvider>
        <div>Test Child</div>
      </AppProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  /**
   * Test initial state values
   * Scenario: Context is initialized without user data
   * Expected: All user fields should be null
   */
  it('should have null initial state', () => {
    const { result } = renderHook(() => useApp(), {
      wrapper: AppProvider,
    });

    expect(result.current.userId).toBeNull();
    expect(result.current.role).toBeNull();
    expect(result.current.userName).toBeNull();
  });

  /**
   * Test setUser functionality
   * Scenario: User logs in with valid credentials
   * Expected: Context state should update with user data
   */
  it('should set user data correctly', () => {
    const { result } = renderHook(() => useApp(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.setUser(123, 'CUSTOMER', 'John Doe');
    });

    expect(result.current.userId).toBe(123);
    expect(result.current.role).toBe('CUSTOMER');
    expect(result.current.userName).toBe('John Doe');
  });

  /**
   * Test setUser with different roles
   * Scenario: Users with different roles log in
   * Expected: Context should handle all role types correctly
   */
  it('should handle different user roles', () => {
    const { result } = renderHook(() => useApp(), {
      wrapper: AppProvider,
    });

    const roles: Role[] = ['CUSTOMER', 'STAFF', 'MANAGER'];

    roles.forEach((role, index) => {
      act(() => {
        result.current.setUser(index + 1, role, `User ${index}`);
      });

      expect(result.current.role).toBe(role);
    });
  });

  /**
   * Test clearUser functionality
   * Scenario: User logs out
   * Expected: Context state should reset to null values
   */
  it('should clear user data on logout', () => {
    const { result } = renderHook(() => useApp(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.setUser(456, 'STAFF', 'Jane Smith');
    });

    expect(result.current.userId).toBe(456);

    act(() => {
      result.current.clearUser();
    });

    expect(result.current.userId).toBeNull();
    expect(result.current.role).toBeNull();
    expect(result.current.userName).toBeNull();
  });

  /**
   * Test useApp hook outside provider
   * Scenario: Hook is used without AppProvider wrapper
   * Expected: Should throw an error
   */
  it('should throw error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useApp());
    }).toThrow('useApp must be used within AppProvider');

    consoleSpy.mockRestore();
  });

  /**
   * Test multiple setUser calls
   * Scenario: User data is updated multiple times
   * Expected: Context should reflect the latest user data
   */
  it('should update user data on multiple setUser calls', () => {
    const { result } = renderHook(() => useApp(), {
      wrapper: AppProvider,
    });

    act(() => {
      result.current.setUser(1, 'CUSTOMER', 'First User');
    });

    expect(result.current.userName).toBe('First User');

    act(() => {
      result.current.setUser(2, 'MANAGER', 'Second User');
    });

    expect(result.current.userId).toBe(2);
    expect(result.current.role).toBe('MANAGER');
    expect(result.current.userName).toBe('Second User');
  });
});
