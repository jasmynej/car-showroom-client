import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ViewCars from './ViewCars';
import { AppProvider } from '../../context/AppContext';

/**
 * E2E test suite for ViewCars component
 * Tests displaying available cars from real API and navigation to purchase/test drive.
 * This test communicates with the actual SpringBoot backend on port 8080.
 * 
 * Prerequisites:
 * - SpringBoot backend must be running on http://localhost:8080
 * - Backend /api/cars/available endpoint should be accessible
 */
describe('ViewCars E2E', () => {
  /**
   * Helper function to render ViewCars with router context and routes
   */
  const renderViewCars = () => {
    return render(
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ViewCars />} />
            <Route path="/customer/cars" element={<ViewCars />} />
            <Route path="/customer/purchase/:vin" element={<div>Purchase Order Page</div>} />
            <Route path="/customer/test-drive/:vin" element={<div>Test Drive Page</div>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    );
  };

  /**
   * Test rendering page title and navbar with real API
   * Scenario: Customer visits view cars page
   * Expected: Should display page title and navbar, and fetch cars from backend
   */
  it('should render page title and navbar with real API data', async () => {
    renderViewCars();
    
    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(
      () => {
        expect(screen.getByText('Available Cars')).toBeInTheDocument();
        expect(screen.getByText('Car Showroom')).toBeInTheDocument();
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
    renderViewCars();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  /**
   * Test successful car data fetch from real API
   * Scenario: API returns available cars from backend
   * Expected: Should display car table with data or appropriate message
   */
  it('should display cars after successful fetch from backend', async () => {
    renderViewCars();
    
    await waitFor(
      () => {
        // Either cars are displayed or "No cars found" message
        const loadingGone = !screen.queryByText('Loading...');
        expect(loadingGone).toBe(true);
        
        // Check if either car data or empty message is shown
        const hasContent = screen.queryByText(/VIN/i) || screen.queryByText('No cars found.');
        expect(hasContent).toBeTruthy();
      },
      { timeout: 5000 }
    );
  }, 10000);













  /**
   * Test loading state clears after data fetch
   * Scenario: API returns data successfully from backend
   * Expected: Loading message should disappear
   */
  it('should clear loading state after data fetch', async () => {
    renderViewCars();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(
      () => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  }, 10000);



});
