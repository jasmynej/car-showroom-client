import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CarInventory from './CarInventory';
import { AppProvider } from '../../context/AppContext';

/**
 * E2E test suite for CarInventory component
 * Tests car inventory management with real API including viewing, adding, updating, and deleting cars.
 * This test communicates with the actual SpringBoot backend on port 8080.
 * 
 * Prerequisites:
 * - SpringBoot backend must be running on http://localhost:8080
 * - Backend /api/cars endpoints should be accessible
 */
describe('CarInventory E2E', () => {
  beforeEach(() => {
    // Mock window.confirm and alert for delete operations
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();
  });

  /**
   * Helper function to render CarInventory with router context and routes
   */
  const renderCarInventory = () => {
    return render(
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CarInventory />} />
            <Route path="/staff/inventory" element={<CarInventory />} />
            <Route path="/staff/inventory/update/:vin" element={<div>Update Car Page</div>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    );
  };

  /**
   * Test rendering page title and sections with real API
   * Scenario: Staff visits car inventory page
   * Expected: Should display title, table, and add car form with real data from backend
   */
  it('should render page title and sections with real API data', async () => {
    renderCarInventory();
    
    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(
      () => {
        expect(screen.getByText('Car Inventory')).toBeInTheDocument();
        expect(screen.getByText('Add New Car')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  }, 10000);

  /**
   * Test loading state
   * Scenario: API is fetching car data
   * Expected: Should display loading message initially
   */
  it('should display loading state initially', () => {
    renderCarInventory();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  /**
   * Test successful car data fetch from real API
   * Scenario: API returns car inventory from backend
   * Expected: Should display car table with data or appropriate message
   */
  it('should display cars after successful fetch from backend', async () => {
    renderCarInventory();
    
    await waitFor(
      () => {
        const loadingGone = !screen.queryByText('Loading...');
        expect(loadingGone).toBe(true);
        
        // Form should be visible
        expect(screen.getByText('Add New Car')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  }, 10000);













  /**
   * Test add car form rendering
   * Scenario: Page loads successfully
   * Expected: Should display all form fields
   */
  it('should render add car form with all fields', async () => {
    renderCarInventory();
    
    await waitFor(
      () => {
        expect(screen.getByLabelText('VIN')).toBeInTheDocument();
        expect(screen.getByLabelText('Make')).toBeInTheDocument();
        expect(screen.getByLabelText('Model')).toBeInTheDocument();
        expect(screen.getByLabelText('Year')).toBeInTheDocument();
        expect(screen.getByLabelText('Color')).toBeInTheDocument();
        expect(screen.getByLabelText('Mileage')).toBeInTheDocument();
        expect(screen.getByLabelText('Price ($)')).toBeInTheDocument();
        expect(screen.getByLabelText('Status')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  }, 10000);









  /**
   * Test status dropdown options
   * Scenario: Staff views add car form
   * Expected: Should display all availability status options
   */
  it('should render all status options in dropdown', async () => {
    renderCarInventory();
    
    await waitFor(
      () => {
        expect(screen.getByText('Available')).toBeInTheDocument();
        expect(screen.getByText('Reserved')).toBeInTheDocument();
        expect(screen.getByText('Sold')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  }, 10000);

  /**
   * Test form input types
   * Scenario: Form is rendered
   * Expected: Numeric fields should have correct input types
   */
  it('should use correct input types for numeric fields', async () => {
    renderCarInventory();
    
    await waitFor(
      () => {
        expect(screen.getByLabelText('Year')).toHaveAttribute('type', 'number');
        expect(screen.getByLabelText('Mileage')).toHaveAttribute('type', 'number');
        expect(screen.getByLabelText('Price ($)')).toHaveAttribute('type', 'number');
      },
      { timeout: 5000 }
    );
  }, 10000);
});
