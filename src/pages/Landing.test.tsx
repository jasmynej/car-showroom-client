import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from './Landing';

describe('Landing Page E2E Test', () => {
  it('should render the landing page with welcome message and action buttons', () => {
    // Arrange: Render the Landing component wrapped in BrowserRouter
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    // Assert: Check that the main heading is present
    const heading = screen.getByRole('heading', { name: /car showroom/i });
    expect(heading).toBeInTheDocument();

    // Assert: Check that the welcome message is displayed
    const welcomeMessage = screen.getByText(/welcome! please sign up or log in to continue/i);
    expect(welcomeMessage).toBeInTheDocument();

    // Assert: Check that Sign Up button is present
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveClass('btn-primary');

    // Assert: Check that Login button is present
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveClass('btn-outline');
  });
});
