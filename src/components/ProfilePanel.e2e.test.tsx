import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePanel from './ProfilePanel';
import api from '../api/axios';
import type { User } from '../types';

jest.mock('../api/axios');
const mockedApi = api as jest.Mocked<typeof api>;

/**
 * Test suite for ProfilePanel component
 * Tests user profile display and password update functionality
 */
describe('ProfilePanel', () => {
  const mockUser: User = {
    userId: 123,
    name: 'John Doe',
    email: 'john@example.com',
    contactInfo: '+1234567890',
    role: 'CUSTOMER',
    department: null,
    designation: null,
    ownedCars: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test loading state
   * Scenario: Component is mounted and fetching user data
   * Expected: Should display loading message
   */
  it('should display loading state initially', () => {
    mockedApi.get.mockImplementation(() => new Promise(() => {}));
    render(<ProfilePanel userId={123} />);
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  /**
   * Test successful user data fetch
   * Scenario: API returns user data successfully
   * Expected: Should display user profile information
   */
  it('should display user profile after successful fetch', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
    
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByText('CUSTOMER')).toBeInTheDocument();
  });

  /**
   * Test error handling on fetch failure
   * Scenario: API request fails
   * Expected: Should display error message
   */
  it('should display error message on fetch failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load profile.')).toBeInTheDocument();
    });
  });

  /**
   * Test API call with correct userId
   * Scenario: Component mounts with userId prop
   * Expected: Should call API with correct endpoint
   */
  it('should call API with correct userId', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    
    render(<ProfilePanel userId={456} />);
    
    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/users/456');
    });
  });

  /**
   * Test password input field
   * Scenario: User types in password field
   * Expected: Input value should update
   */
  it('should update password input on change', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
    
    const passwordInput = screen.getByPlaceholderText('New password') as HTMLInputElement;
    await user.type(passwordInput, 'newpassword123');
    
    expect(passwordInput.value).toBe('newpassword123');
  });

  /**
   * Test successful password update
   * Scenario: User submits new password
   * Expected: Should call API and display success message
   */
  it('should update password successfully', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    mockedApi.put.mockResolvedValueOnce({ data: {} });
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
    
    const passwordInput = screen.getByPlaceholderText('New password');
    const updateButton = screen.getByText('Update');
    
    await user.type(passwordInput, 'newpassword123');
    await user.click(updateButton);
    
    await waitFor(() => {
      expect(mockedApi.put).toHaveBeenCalledWith('/users/123/password', { password: 'newpassword123' });
      expect(screen.getByText('Password updated.')).toBeInTheDocument();
    });
  });

  /**
   * Test password update failure
   * Scenario: Password update API call fails
   * Expected: Should display error message
   */
  it('should display error on password update failure', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    mockedApi.put.mockRejectedValueOnce(new Error('Update failed'));
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
    
    const passwordInput = screen.getByPlaceholderText('New password');
    const updateButton = screen.getByText('Update');
    
    await user.type(passwordInput, 'newpassword123');
    await user.click(updateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to update password.')).toBeInTheDocument();
    });
  });

  /**
   * Test password input cleared after successful update
   * Scenario: Password is updated successfully
   * Expected: Password input should be cleared
   */
  it('should clear password input after successful update', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    mockedApi.put.mockResolvedValueOnce({ data: {} });
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
    
    const passwordInput = screen.getByPlaceholderText('New password') as HTMLInputElement;
    const updateButton = screen.getByText('Update');
    
    await user.type(passwordInput, 'newpassword123');
    await user.click(updateButton);
    
    await waitFor(() => {
      expect(passwordInput.value).toBe('');
    });
  });

  /**
   * Test no password update with empty input
   * Scenario: User clicks update with empty password
   * Expected: Should not call API
   */
  it('should not update password when input is empty', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
    
    const updateButton = screen.getByText('Update');
    await user.click(updateButton);
    
    expect(mockedApi.put).not.toHaveBeenCalled();
  });

  /**
   * Test no password update with whitespace-only input
   * Scenario: User enters only whitespace in password field
   * Expected: Should not call API
   */
  it('should not update password when input is only whitespace', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
    
    const passwordInput = screen.getByPlaceholderText('New password');
    const updateButton = screen.getByText('Update');
    
    await user.type(passwordInput, '   ');
    await user.click(updateButton);
    
    expect(mockedApi.put).not.toHaveBeenCalled();
  });

  /**
   * Test profile grid labels
   * Scenario: User profile is displayed
   * Expected: Should show all profile field labels
   */
  it('should display all profile field labels', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('User ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });
  });

  /**
   * Test Change Password section
   * Scenario: Profile is loaded
   * Expected: Should display password change section
   */
  it('should display Change Password section', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    
    render(<ProfilePanel userId={123} />);
    
    await waitFor(() => {
      expect(screen.getByText('Change Password')).toBeInTheDocument();
    });
  });
});
