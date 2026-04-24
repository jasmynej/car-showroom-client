import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ScheduleTestDrive from './ScheduleTestDrive';
import { AppProvider } from '../../context/AppContext';
import api from '../../api/axios';

jest.mock('../../api/axios');
const mockedApi = api as jest.Mocked<typeof api>;

/**
 * Test suite for ScheduleTestDrive component
 * Tests test drive scheduling form and API integration
 */
describe('ScheduleTestDrive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Helper function to render ScheduleTestDrive with router and context
   */
  const renderScheduleTestDrive = (vin: string = 'VIN123', userId: number = 1) => {
    const TestWrapper = () => {
      const { useApp } = require('../../context/AppContext');
      const { setUser } = useApp();
      
      React.useEffect(() => {
        setUser(userId, 'CUSTOMER', 'Test User');
      }, [setUser]);
      
      return null;
    };

    return render(
      <MemoryRouter initialEntries={[`/customer/test-drive/${vin}`]}>
        <AppProvider>
          <TestWrapper />
          <Routes>
            <Route path="/customer/test-drive/:vin" element={<ScheduleTestDrive />} />
            <Route path="/customer/cars" element={<div>Cars Page</div>} />
          </Routes>
        </AppProvider>
      </MemoryRouter>
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
    renderScheduleTestDrive('VIN456');
    
    const vinInput = screen.getByLabelText('VIN') as HTMLInputElement;
    expect(vinInput.value).toBe('VIN456');
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
   * Test successful test drive scheduling
   * Scenario: Customer submits valid form data
   * Expected: Should call API and show success message
   */
  it('should schedule test drive successfully', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockResolvedValueOnce({ data: {} });
    renderScheduleTestDrive('VIN123', 1);
    
    await user.type(screen.getByLabelText('Date'), '2024-05-01');
    await user.type(screen.getByLabelText('Time'), '14:30');
    await user.type(screen.getByLabelText('Comments'), 'Looking forward to test drive');
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/test-drives', {
        vin: 'VIN123',
        customerId: 1,
        date: '2024-05-01',
        time: '14:30',
        comments: 'Looking forward to test drive',
      });
    });
  });

  /**
   * Test success screen display
   * Scenario: Test drive is scheduled successfully
   * Expected: Should show success message with details
   */
  it('should display success screen after scheduling', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockResolvedValueOnce({ data: {} });
    renderScheduleTestDrive('VIN123', 1);
    
    await user.type(screen.getByLabelText('Date'), '2024-05-01');
    await user.type(screen.getByLabelText('Time'), '14:30');
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    await waitFor(() => {
      expect(screen.getByText('Test Drive Scheduled!')).toBeInTheDocument();
      expect(screen.getByText(/VIN123/)).toBeInTheDocument();
      expect(screen.getByText(/2024-05-01/)).toBeInTheDocument();
      expect(screen.getByText(/14:30/)).toBeInTheDocument();
    });
  });

  /**
   * Test back to cars link on success
   * Scenario: Test drive scheduled successfully
   * Expected: Should display link back to cars page
   */
  it('should display back to cars link on success', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockResolvedValueOnce({ data: {} });
    renderScheduleTestDrive('VIN123', 1);
    
    await user.type(screen.getByLabelText('Date'), '2024-05-01');
    await user.type(screen.getByLabelText('Time'), '14:30');
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    await waitFor(() => {
      const backLink = screen.getByText('Back to Cars');
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/customer/cars');
    });
  });

  /**
   * Test API error handling
   * Scenario: API returns error response
   * Expected: Should display error message
   */
  it('should display error message on API failure', async () => {
    const user = userEvent.setup();
    const errorResponse = {
      response: {
        data: {
          error: 'Car not available for test drive',
        },
      },
    };
    mockedApi.post.mockRejectedValueOnce(errorResponse);
    renderScheduleTestDrive('VIN123', 1);
    
    await user.type(screen.getByLabelText('Date'), '2024-05-01');
    await user.type(screen.getByLabelText('Time'), '14:30');
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    await waitFor(() => {
      expect(screen.getByText('Car not available for test drive')).toBeInTheDocument();
    });
  });

  /**
   * Test generic error message
   * Scenario: API fails without specific error
   * Expected: Should display generic error message
   */
  it('should display generic error when API error has no message', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockRejectedValueOnce(new Error('Network error'));
    renderScheduleTestDrive('VIN123', 1);
    
    await user.type(screen.getByLabelText('Date'), '2024-05-01');
    await user.type(screen.getByLabelText('Time'), '14:30');
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to schedule test drive.')).toBeInTheDocument();
    });
  });

  /**
   * Test loading state during submission
   * Scenario: Form is being submitted
   * Expected: Should show loading text and disable button
   */
  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockImplementation(() => new Promise(() => {}));
    renderScheduleTestDrive('VIN123', 1);
    
    await user.type(screen.getByLabelText('Date'), '2024-05-01');
    await user.type(screen.getByLabelText('Time'), '14:30');
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'Scheduling...' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  /**
   * Test form input updates
   * Scenario: Customer types in form fields
   * Expected: Input values should update
   */
  it('should update form inputs on change', async () => {
    const user = userEvent.setup();
    renderScheduleTestDrive('VIN123', 1);
    
    const dateInput = screen.getByLabelText('Date') as HTMLInputElement;
    const timeInput = screen.getByLabelText('Time') as HTMLInputElement;
    const commentsInput = screen.getByLabelText('Comments') as HTMLTextAreaElement;
    
    await user.type(dateInput, '2024-05-01');
    await user.type(timeInput, '14:30');
    await user.type(commentsInput, 'Test comment');
    
    expect(dateInput.value).toBe('2024-05-01');
    expect(timeInput.value).toBe('14:30');
    expect(commentsInput.value).toBe('Test comment');
  });

  /**
   * Test required fields
   * Scenario: Date and time fields are rendered
   * Expected: Should be marked as required
   */
  it('should mark date and time as required', () => {
    renderScheduleTestDrive('VIN123', 1);
    
    expect(screen.getByLabelText('Date')).toBeRequired();
    expect(screen.getByLabelText('Time')).toBeRequired();
  });

  /**
   * Test comments field is optional
   * Scenario: Comments field is rendered
   * Expected: Should not be required
   */
  it('should not require comments field', () => {
    renderScheduleTestDrive('VIN123', 1);
    const commentsInput = screen.getByLabelText('Comments');
    expect(commentsInput).not.toBeRequired();
  });

  /**
   * Test error clearing on new submission
   * Scenario: Customer resubmits after error
   * Expected: Previous error should be cleared
   */
  it('should clear error on new submission', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockRejectedValueOnce(new Error('Network error'));
    renderScheduleTestDrive('VIN123', 1);
    
    await user.type(screen.getByLabelText('Date'), '2024-05-01');
    await user.type(screen.getByLabelText('Time'), '14:30');
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to schedule test drive.')).toBeInTheDocument();
    });
    
    mockedApi.post.mockResolvedValueOnce({ data: {} });
    await user.click(screen.getByRole('button', { name: 'Schedule Test Drive' }));
    
    await waitFor(() => {
      expect(screen.queryByText('Failed to schedule test drive.')).not.toBeInTheDocument();
    });
  });
});
