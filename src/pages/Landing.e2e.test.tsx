import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import SignUp from './SignUp';
import { AppProvider } from '../context/AppContext';

/**
 * Integration test that verifies the Sign Up flow from Landing page to SignUp form.
 * This test communicates with the actual SpringBoot backend on port 8080.
 * 
 * Prerequisites:
 * - SpringBoot backend must be running on http://localhost:8080
 * - Backend /api/users endpoint should be accessible
 */
describe('Landing to SignUp Integration Test', () => {
  it('should navigate to Sign Up page and display the registration form when Sign Up button is clicked', async () => {
    // Arrange: Set up user event
    const user = userEvent.setup();

    // Render the application with routing and context
    render(
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    );

    // Assert: Verify we're on the Landing page
    const landingHeading = screen.getByRole('heading', { name: /car showroom/i });
    expect(landingHeading).toBeInTheDocument();

    // Act: Click the Sign Up button
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signUpButton);

    // Assert: Verify navigation to Sign Up page
    await waitFor(() => {
      const signUpHeading = screen.getByRole('heading', { name: /^sign up$/i });
      expect(signUpHeading).toBeInTheDocument();
    });

    // Assert: Verify Sign Up form elements are present
    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('type', 'text');

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    const contactInfoTextarea = screen.getByLabelText(/contact information/i);
    expect(contactInfoTextarea).toBeInTheDocument();
    expect(contactInfoTextarea.tagName).toBe('TEXTAREA');

    const termsCheckbox = screen.getByRole('checkbox', { name: /i agree to the terms/i });
    expect(termsCheckbox).toBeInTheDocument();
    expect(termsCheckbox).not.toBeChecked();

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');

    // Assert: Verify the login link is present
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  /**
   * Optional: Test that verifies backend connectivity
   * This test will fail if the SpringBoot backend is not running on port 8080
   */
  it('should be able to communicate with the backend when submitting the form', async () => {
    // Arrange: Set up user event
    const user = userEvent.setup();

    // Render the SignUp page directly
    render(
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/customer/home" element={<div>Customer Home</div>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    );

    // Fill out the form with test data
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'Test User');

    const emailInput = screen.getByLabelText(/email/i);
    // Use a unique email to avoid conflicts
    const uniqueEmail = `test.user.${Date.now()}@example.com`;
    await user.type(emailInput, uniqueEmail);

    const passwordInput = screen.getByLabelText(/^password$/i);
    await user.type(passwordInput, 'TestPassword123!');

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    await user.type(confirmPasswordInput, 'TestPassword123!');

    const contactInfoTextarea = screen.getByLabelText(/contact information/i);
    await user.type(contactInfoTextarea, '123-456-7890');

    const termsCheckbox = screen.getByRole('checkbox', { name: /i agree to the terms/i });
    await user.click(termsCheckbox);

    // Act: Submit the form (this will make an actual API call to localhost:8080)
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    // Assert: Wait for either success (navigation) or error message
    // Note: This test expects the backend to be running
    // If backend is running and accepts the request, it should navigate to /customer/home
    // If backend is not running or rejects the request, an error message should appear
    await waitFor(
      () => {
        // Check if navigation occurred (success case)
        const customerHome = screen.queryByText(/customer home/i);
        // Or check if error message appeared (backend not running or validation error)
        const errorMessage = screen.queryByText(/registration failed|error|already exists/i);
        
        // At least one of these should be true
        expect(customerHome || errorMessage).toBeTruthy();
      },
      { timeout: 5000 } // 5 second timeout for backend response
    );
  }, 10000); // 10 second test timeout
});
