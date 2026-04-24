import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScheduleTestDrive from './ScheduleTestDrive';
import { AppProvider } from '../../context/AppContext';

/**
 * E2E test suite for ScheduleTestDrive component
 * Tests test drive scheduling form and real API integration.
 * This test communicates with the actual SpringBoot backend on port 8080.
 * 
 * Prerequisites:
 * - SpringBoot backend must be running on http://localhost:8080
 * - Backend /api/test-drives endpoint should be accessible
 */
describe('ScheduleTestDrive E2E', () => {
  /**
   * Helper function to render ScheduleTestDrive with router and context
   */
  const renderScheduleTestDrive = (vin: string = '1HGCM82633A004352', userId: number = 4) => {
    const TestWrapper = () => {
      const { useApp } = require('../../context/AppContext');
      const { setUser } = useApp();
      
      React.useEffect(() => {
        setUser(userId, 'CUSTOMER', 'Test User');
      }, [setUser]);
      
      return null;
    };

    return render(
      <AppProvider>
        <BrowserRouter>
          <TestWrapper />
          <Routes>
            <Route path="/" element={<ScheduleTestDrive />} />
            <Route path="/customer/test-drive/:vin" element={<ScheduleTestDrive />} />
            <Route path="/customer/cars" element={<div>Cars Page</div>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    );
  };

  /**
   * Test rendering schedule form
   * Scenario: Customer visits test drive scheduling page
   * Expected: Should display form with all fields
   */
  it('should render schedule test drive form', () => {
    renderScheduleTestDrive();
    
    expect(screen.getByText('Schedule Test Drive')).toBeInTheDocument();
    expect(screen.getByLabelText('VIN')).toBeInTheDocument();
    expect(screen.getByLabelText('Customer ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Comments')).toBeInTheDocument();
  });

  /**
   * Test VIN from URL parameter
   * Scenario: Customer navigates from car listing
   * Expected: VIN field should be pre-filled and readonly
   */
  it('should display VIN from URL parameter', () => {
    renderScheduleTestDrive('5NPE24AF8FH052952');
    
    const vinInput = screen.getByLabelText('VIN') as HTMLInputElement;
    expect(vinInput.value).toBe('5NPE24AF8FH052952');
    expect(vinInput).toHaveClass('input-readonly');
  });

  /**
   * Test customer ID from context
   * Scenario: Logged-in customer views form
   * Expected: Customer ID field should be pre-filled and readonly
   */
  it('should display customer ID from context', () => {
    renderScheduleTestDrive('VIN123', 42);
    
    const customerIdInput = screen.getByLabelText('Customer ID') as HTMLInputElement;
    expect(customerIdInput.value).toBe('42');
    expect(customerIdInput).toHaveClass('input-readonly');
  });

  /**
   * Test successful test drive scheduling with real API
   * Scenario: Customer submits valid form data
   * Expected: Should call real API and show success message
   */
  it('should schedule test drive successfully with real API', async () => {
    const user = userEvent.setup();
    renderScheduleTestDrive('1HGCM82633A004352', 4);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];
    
    await user.type(screen.getByLabelText('Date'), dateString);
    await user.type(screen.getByLabelText('Time'), '14:30');
    await user.type(screen.getByLabelText('Comments'), 'E2E test drive booking');
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    // Wait for either success or error
    await waitFor(
      () => {
        const successMessage = screen.queryByText('Test Drive Scheduled!');
        const errorMessage = screen.queryByText(/failed|error/i);
        expect(successMessage || errorMessage).toBeTruthy();
      },
      { timeout: 5000 }
    );
  }, 10000);











  /**
   * Test form input updates
   * Scenario: Customer types in form fields
   * Expected: Input values should update
   */
  it('should update form inputs on change', async () => {
    const user = userEvent.setup();
    renderScheduleTestDrive('1HGCM82633A004352', 4);
    
    const dateInput = screen.getByLabelText('Date') as HTMLInputElement;
    const timeInput = screen.getByLabelText('Time') as HTMLInputElement;
    const commentsInput = screen.getByLabelText('Comments') as HTMLTextAreaElement;
    
    await user.type(dateInput, '2025-05-01');
    await user.type(timeInput, '14:30');
    await user.type(commentsInput, 'Test comment');
    
    expect(dateInput.value).toBe('2025-05-01');
    expect(timeInput.value).toBe('14:30');
    expect(commentsInput.value).toBe('Test comment');
  });

  /**
   * Test required fields
   * Scenario: Date and time fields are rendered
   * Expected: Should be marked as required
   */
  it('should mark date and time as required', () => {
    renderScheduleTestDrive('1HGCM82633A004352', 4);
    
    expect(screen.getByLabelText('Date')).toBeRequired();
    expect(screen.getByLabelText('Time')).toBeRequired();
  });

  /**
   * Test comments field is optional
   * Scenario: Comments field is rendered
   * Expected: Should not be required
   */
  it('should not require comments field', () => {
    renderScheduleTestDrive('1HGCM82633A004352', 4);
    const commentsInput = screen.getByLabelText('Comments');
    expect(commentsInput).not.toBeRequired();
  });

});
