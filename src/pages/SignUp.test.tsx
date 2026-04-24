import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignUp from './SignUp';
import { AppProvider } from '../context/AppContext';
import api from '../api/axios';
import type { User } from '../types';

jest.mock('../api/axios');
const mockedApi = api as jest.Mocked<typeof api>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Test suite for SignUp component
 * Tests user registration form, validation, and API integration
 */
describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  /**
   * Helper function to render SignUp with router context
   */
  const renderSignUp = () => {
    return render(
      <MemoryRouter>
        <AppProvider>
          <SignUp />
        </AppProvider>
      </MemoryRouter>
    );
  };

  /**
   * Test rendering signup form
   * Scenario: User visits signup page
   * Expected: Should display signup form with all fields
   */
  it('should render signup form', () => {
    renderSignUp();
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact Information')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  /**
   * Test rendering login link
   * Scenario: User already has an account
   * Expected: Should display link to login page
   */
  it('should render login link', () => {
    renderSignUp();
    const loginLink = screen.getByText('Login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  /**
   * Test rendering terms and conditions checkbox
   * Scenario: User views signup form
   * Expected: Should display terms checkbox
   */
  it('should render terms and conditions checkbox', () => {
    renderSignUp();
    expect(screen.getByText(/I agree to the Terms/)).toBeInTheDocument();
  });

  /**
   * Test successful signup
   * Scenario: User submits valid registration data
   * Expected: Should create user and navigate to customer home
   */
  it('should handle successful signup', async () => {
    const user = userEvent.setup();
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
    
    mockedApi.post.mockResolvedValueOnce({ data: mockUser });
    renderSignUp();
    
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.type(screen.getByLabelText('Contact Information'), '+1234567890');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/users', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        contactInfo: '+1234567890',
        role: 'CUSTOMER',
        department: null,
        designation: null,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/customer/home');
    });
  });

  /**
   * Test password mismatch validation
   * Scenario: User enters different passwords
   * Expected: Should display error message
   */
  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderSignUp();
    
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password456');
    await user.type(screen.getByLabelText('Contact Information'), '+1234567890');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
    
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  /**
   * Test terms acceptance validation
   * Scenario: User submits without accepting terms
   * Expected: Should display error message
   */
  it('should show error when terms not accepted', async () => {
    const user = userEvent.setup();
    renderSignUp();
    
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.type(screen.getByLabelText('Contact Information'), '+1234567890');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(screen.getByText('You must accept the Terms & Conditions.')).toBeInTheDocument();
    });
    
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  /**
   * Test API error handling
   * Scenario: API returns error response
   * Expected: Should display error message from API
   */
  it('should display API error message on failure', async () => {
    const user = userEvent.setup();
    const errorResponse = {
      response: {
        data: {
          error: 'Email already exists',
        },
      },
    };
    
    mockedApi.post.mockRejectedValueOnce(errorResponse);
    renderSignUp();
    
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.type(screen.getByLabelText('Contact Information'), '+1234567890');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  /**
   * Test generic error handling
   * Scenario: API fails without specific error message
   * Expected: Should display generic error message
   */
  it('should display generic error when API error has no message', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockRejectedValueOnce(new Error('Network error'));
    renderSignUp();
    
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.type(screen.getByLabelText('Contact Information'), '+1234567890');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
    });
  });

  /**
   * Test loading state during signup
   * Scenario: User submits form and API is processing
   * Expected: Should show loading text and disable button
   */
  it('should show loading state during signup', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockImplementation(() => new Promise(() => {}));
    renderSignUp();
    
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.type(screen.getByLabelText('Contact Information'), '+1234567890');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'Creating account...' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  /**
   * Test form input updates
   * Scenario: User types in form fields
   * Expected: Input values should update
   */
  it('should update form inputs on change', async () => {
    const user = userEvent.setup();
    renderSignUp();
    
    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const confirmInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;
    const contactInput = screen.getByLabelText('Contact Information') as HTMLTextAreaElement;
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmInput, 'password123');
    await user.type(contactInput, '+1234567890');
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmInput.value).toBe('password123');
    expect(contactInput.value).toBe('+1234567890');
  });

  /**
   * Test checkbox toggle
   * Scenario: User clicks terms checkbox
   * Expected: Checkbox state should toggle
   */
  it('should toggle terms checkbox', async () => {
    const user = userEvent.setup();
    renderSignUp();
    
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    
    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
    
    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  /**
   * Test password field type
   * Scenario: Password fields are rendered
   * Expected: Should be of type password for security
   */
  it('should render password fields with type password', () => {
    renderSignUp();
    
    const passwordInput = screen.getByLabelText('Password');
    const confirmInput = screen.getByLabelText('Confirm Password');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');
  });

  /**
   * Test email field type
   * Scenario: Email field is rendered
   * Expected: Should be of type email for validation
   */
  it('should render email field with type email', () => {
    renderSignUp();
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  /**
   * Test required fields
   * Scenario: Form fields are rendered
   * Expected: All input fields should be required
   */
  it('should mark all fields as required', () => {
    renderSignUp();
    
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Email')).toBeRequired();
    expect(screen.getByLabelText('Password')).toBeRequired();
    expect(screen.getByLabelText('Confirm Password')).toBeRequired();
    expect(screen.getByLabelText('Contact Information')).toBeRequired();
  });

  /**
   * Test error clearing on new submission
   * Scenario: User fixes error and resubmits
   * Expected: Previous error should be cleared
   */
  it('should clear error on new submission', async () => {
    const user = userEvent.setup();
    renderSignUp();
    
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password456');
    await user.type(screen.getByLabelText('Contact Information'), '+1234567890');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
    
    const confirmInput = screen.getByLabelText('Confirm Password');
    await user.clear(confirmInput);
    await user.type(confirmInput, 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));
    
    expect(screen.queryByText('Passwords do not match.')).not.toBeInTheDocument();
  });
});
