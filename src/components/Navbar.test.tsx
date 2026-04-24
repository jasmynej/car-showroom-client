import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AppProvider } from '../context/AppContext';

/**
 * Mock useNavigate from react-router-dom
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Test suite for Navbar component
 * Tests navigation links and logout functionality for different user roles
 */
describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  /**
   * Helper function to render Navbar with router context
   */
  const renderNavbar = (role: string) => {
    return render(
      <MemoryRouter>
        <AppProvider>
          <Navbar role={role} />
        </AppProvider>
      </MemoryRouter>
    );
  };

  /**
   * Test rendering navbar brand
   * Scenario: Navbar is rendered for any role
   * Expected: Should display "Car Showroom" brand
   */
  it('should render Car Showroom brand', () => {
    renderNavbar('CUSTOMER');
    expect(screen.getByText('Car Showroom')).toBeInTheDocument();
  });

  /**
   * Test rendering logout button
   * Scenario: Navbar is rendered for any role
   * Expected: Should display logout button
   */
  it('should render logout button for all roles', () => {
    renderNavbar('CUSTOMER');
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  /**
   * Test CUSTOMER role navigation links
   * Scenario: User with CUSTOMER role views navbar
   * Expected: Should display Home and View Cars links
   */
  it('should render CUSTOMER navigation links', () => {
    renderNavbar('CUSTOMER');
    expect(screen.getByText('Home')).toHaveAttribute('href', '/customer/home');
    expect(screen.getByText('View Cars')).toHaveAttribute('href', '/customer/cars');
  });

  /**
   * Test STAFF role navigation links
   * Scenario: User with STAFF role views navbar
   * Expected: Should display Home, Car Services, and Inventory links
   */
  it('should render STAFF navigation links', () => {
    renderNavbar('STAFF');
    expect(screen.getByText('Home')).toHaveAttribute('href', '/staff/home');
    expect(screen.getByText('Car Services')).toHaveAttribute('href', '/staff/services');
    expect(screen.getByText('Inventory')).toHaveAttribute('href', '/staff/inventory');
  });

  /**
   * Test MANAGER role navigation links
   * Scenario: User with MANAGER role views navbar
   * Expected: Should display Home, Report, and Invoices links
   */
  it('should render MANAGER navigation links', () => {
    renderNavbar('MANAGER');
    expect(screen.getByText('Home')).toHaveAttribute('href', '/manager/home');
    expect(screen.getByText('Report')).toHaveAttribute('href', '/manager/report');
    expect(screen.getByText('Invoices')).toHaveAttribute('href', '/manager/invoice');
  });

  /**
   * Test logout button click
   * Scenario: User clicks logout button
   * Expected: Should clear user context and navigate to home
   */
  it('should handle logout click', async () => {
    const user = userEvent.setup();
    renderNavbar('CUSTOMER');
    
    const logoutButton = screen.getByText('Log Out');
    await user.click(logoutButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  /**
   * Test no other role links shown for CUSTOMER
   * Scenario: CUSTOMER user views navbar
   * Expected: Should not see STAFF or MANAGER links
   */
  it('should not render other role links for CUSTOMER', () => {
    renderNavbar('CUSTOMER');
    expect(screen.queryByText('Car Services')).not.toBeInTheDocument();
    expect(screen.queryByText('Inventory')).not.toBeInTheDocument();
    expect(screen.queryByText('Report')).not.toBeInTheDocument();
    expect(screen.queryByText('Invoices')).not.toBeInTheDocument();
  });

  /**
   * Test no other role links shown for STAFF
   * Scenario: STAFF user views navbar
   * Expected: Should not see CUSTOMER or MANAGER specific links
   */
  it('should not render other role links for STAFF', () => {
    renderNavbar('STAFF');
    expect(screen.queryByText('View Cars')).not.toBeInTheDocument();
    expect(screen.queryByText('Report')).not.toBeInTheDocument();
    expect(screen.queryByText('Invoices')).not.toBeInTheDocument();
  });

  /**
   * Test no other role links shown for MANAGER
   * Scenario: MANAGER user views navbar
   * Expected: Should not see CUSTOMER or STAFF specific links
   */
  it('should not render other role links for MANAGER', () => {
    renderNavbar('MANAGER');
    expect(screen.queryByText('View Cars')).not.toBeInTheDocument();
    expect(screen.queryByText('Car Services')).not.toBeInTheDocument();
    expect(screen.queryByText('Inventory')).not.toBeInTheDocument();
  });

  /**
   * Test navbar structure
   * Scenario: Navbar is rendered
   * Expected: Should have correct CSS classes
   */
  it('should have correct navbar structure and classes', () => {
    const { container } = renderNavbar('CUSTOMER');
    const navbar = container.querySelector('.navbar');
    const brand = container.querySelector('.navbar-brand');
    const links = container.querySelector('.navbar-links');
    
    expect(navbar).toBeInTheDocument();
    expect(brand).toBeInTheDocument();
    expect(links).toBeInTheDocument();
  });

  /**
   * Test logout button styling
   * Scenario: Logout button is rendered
   * Expected: Should have btn and btn-outline classes
   */
  it('should have correct logout button styling', () => {
    renderNavbar('CUSTOMER');
    const logoutButton = screen.getByText('Log Out');
    expect(logoutButton).toHaveClass('btn', 'btn-outline');
  });
});
