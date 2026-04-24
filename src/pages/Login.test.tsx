import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AppProvider } from '../context/AppContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Test suite for Login component
 * Tests user authentication form and validation
 */
describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  /**
   * Helper function to render Login with router context
   */
  const renderLogin = () => {
    return render(
      <MemoryRouter>
        <AppProvider>
          <Login />
        </AppProvider>
      </MemoryRouter>
    );
  };

  /**
   * Test rendering login form
   * Scenario: User visits login page
   * Expected: Should display login form with all fields
   */
  it('should render login form', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your user ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your display name')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  /**
   * Test rendering signup link
   * Scenario: User doesn't have an account
   * Expected: Should display link to signup page
   */
  it('should render signup link', () => {
    renderLogin();
    const signupLink = screen.getByText('Sign Up');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  /**
   * Test role dropdown options
   * Scenario: User views role selection
   * Expected: Should display all role options
   */
  it('should render all role options', () => {
    renderLogin();
    
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  /**
   * Test successful login with CUSTOMER role
   * Scenario: User submits valid credentials as customer
   * Expected: Should set user context and navigate to customer home
   */
  it('should handle successful login for CUSTOMER', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const nameInput = screen.getByLabelText('Name');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, '123');
    await user.type(nameInput, 'John Doe');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/customer/home');
    });
  });

  /**
   * Test successful login with STAFF role
   * Scenario: User submits valid credentials as staff
   * Expected: Should navigate to staff home
   */
  it('should handle successful login for STAFF', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const nameInput = screen.getByLabelText('Name');
    const roleSelect = screen.getByLabelText('Role');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, '456');
    await user.type(nameInput, 'Jane Smith');
    await user.selectOptions(roleSelect, 'STAFF');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/staff/home');
    });
  });

  /**
   * Test successful login with MANAGER role
   * Scenario: User submits valid credentials as manager
   * Expected: Should navigate to manager home
   */
  it('should handle successful login for MANAGER', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const nameInput = screen.getByLabelText('Name');
    const roleSelect = screen.getByLabelText('Role');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, '789');
    await user.type(nameInput, 'Admin User');
    await user.selectOptions(roleSelect, 'MANAGER');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/manager/home');
    });
  });

  /**
   * Test validation for empty userId
   * Scenario: User submits form without userId
   * Expected: Should display error message
   */
  it('should show error for empty userId', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const nameInput = screen.getByLabelText('Name');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(nameInput, 'John Doe');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('User ID must be a positive number.')).toBeInTheDocument();
    });
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Test validation for invalid userId (non-numeric)
   * Scenario: User enters non-numeric userId
   * Expected: Should display error message
   */
  it('should show error for non-numeric userId', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const nameInput = screen.getByLabelText('Name');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, 'abc');
    await user.type(nameInput, 'John Doe');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('User ID must be a positive number.')).toBeInTheDocument();
    });
  });

  /**
   * Test validation for negative userId
   * Scenario: User enters negative userId
   * Expected: Should display error message
   */
  it('should show error for negative userId', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const nameInput = screen.getByLabelText('Name');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, '-5');
    await user.type(nameInput, 'John Doe');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('User ID must be a positive number.')).toBeInTheDocument();
    });
  });

  /**
   * Test validation for zero userId
   * Scenario: User enters zero as userId
   * Expected: Should display error message
   */
  it('should show error for zero userId', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const nameInput = screen.getByLabelText('Name');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, '0');
    await user.type(nameInput, 'John Doe');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('User ID must be a positive number.')).toBeInTheDocument();
    });
  });

  /**
   * Test validation for empty name
   * Scenario: User submits form without name
   * Expected: Should display error message
   */
  it('should show error for empty name', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, '123');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
    });
  });

  /**
   * Test validation for whitespace-only name
   * Scenario: User enters only whitespace in name field
   * Expected: Should display error message
   */
  it('should show error for whitespace-only name', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const nameInput = screen.getByLabelText('Name');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, '123');
    await user.type(nameInput, '   ');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
    });
  });

  /**
   * Test name trimming
   * Scenario: User enters name with leading/trailing whitespace
   * Expected: Should trim whitespace before setting user
   */
  it('should trim name whitespace on submit', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByLabelText('User ID');
    const nameInput = screen.getByLabelText('Name');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(userIdInput, '123');
    await user.type(nameInput, '  John Doe  ');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/customer/home');
    });
  });

  /**
   * Test form submission prevention
   * Scenario: User submits form
   * Expected: Should prevent default form submission
   */
  it('should prevent default form submission', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const userIdInput = screen.getByPlaceholderText('Enter your user ID');
    const nameInput = screen.getByPlaceholderText('Your display name');
    const form = screen.getByRole('button', { name: 'Login' }).closest('form')!;
    
    const submitHandler = jest.fn((e) => e.preventDefault());
    form.onsubmit = submitHandler;
    
    await user.type(userIdInput, '123');
    await user.type(nameInput, 'John Doe');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(submitHandler).toHaveBeenCalled();
  });

  /**
   * Test input placeholders
   * Scenario: User views empty form
   * Expected: Should display helpful placeholders
   */
  it('should display input placeholders', () => {
    renderLogin();
    
    expect(screen.getByPlaceholderText('Enter your user ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your display name')).toBeInTheDocument();
  });
});
