import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import { AppProvider } from '../context/AppContext';

/**
 * E2E test suite for Navbar component
 * Tests navigation links and logout functionality for different user roles with real routing.
 */
describe('Navbar E2E', () => {
  /**
   * Helper function to render Navbar with router context and routes
   */
  const renderNavbar = (role: string) => {
    return render(
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<><Navbar role={role} /><div>Home Page</div></>} />
            <Route path="/customer/home" element={<div>Customer Home</div>} />
            <Route path="/customer/cars" element={<div>View Cars Page</div>} />
            <Route path="/staff/home" element={<div>Staff Home</div>} />
            <Route path="/staff/services" element={<div>Car Services Page</div>} />
            <Route path="/staff/inventory" element={<div>Inventory Page</div>} />
            <Route path="/manager/home" element={<div>Manager Home</div>} />
            <Route path="/manager/report" element={<div>Report Page</div>} />
            <Route path="/manager/invoice" element={<div>Invoices Page</div>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
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
   * Test logout button click with real navigation
   * Scenario: User clicks logout button
   * Expected: Should clear user context and navigate to home page
   */
  it('should handle logout click and navigate to home', async () => {
    const user = userEvent.setup();
    renderNavbar('CUSTOMER');
    
    const logoutButton = screen.getByText('Log Out');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
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
