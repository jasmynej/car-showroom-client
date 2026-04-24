import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CarInventory from './CarInventory';
import { AppProvider } from '../../context/AppContext';
import api from '../../api/axios';
import type { Car } from '../../types';

jest.mock('../../api/axios');
const mockedApi = api as jest.Mocked<typeof api>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Test suite for CarInventory component
 * Tests car inventory management including viewing, adding, updating, and deleting cars
 */
describe('CarInventory', () => {
  const mockCars: Car[] = [
    {
      vin: 'VIN123',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 25000,
      color: 'Blue',
      mileage: 15000,
      availabilityStatus: 'AVAILABLE',
      lastServiceDate: '2024-01-15',
      ownerId: null,
      lastUpdated: '2024-01-20',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    // Mock window.confirm
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();
  });

  /**
   * Helper function to render CarInventory with router context
   */
  const renderCarInventory = () => {
    return render(
      <MemoryRouter>
        <AppProvider>
          <CarInventory />
        </AppProvider>
      </MemoryRouter>
    );
  };

  /**
   * Test rendering page title and sections
   * Scenario: Staff visits car inventory page
   * Expected: Should display title, table, and add car form
   */
  it('should render page title and sections', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByText('Car Inventory')).toBeInTheDocument();
      expect(screen.getByText('Add New Car')).toBeInTheDocument();
    });
  });

  /**
   * Test loading state
   * Scenario: API is fetching car data
   * Expected: Should display loading message
   */
  it('should display loading state', () => {
    mockedApi.get.mockImplementation(() => new Promise(() => {}));
    renderCarInventory();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  /**
   * Test successful car data fetch
   * Scenario: API returns car inventory
   * Expected: Should display car table with data
   */
  it('should display cars after successful fetch', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
      expect(screen.getByText('Toyota')).toBeInTheDocument();
      expect(screen.getByText('Camry')).toBeInTheDocument();
    });
  });

  /**
   * Test API endpoint call
   * Scenario: Component mounts
   * Expected: Should call correct API endpoint
   */
  it('should call API with correct endpoint', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderCarInventory();
    
    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/cars');
    });
  });

  /**
   * Test error handling on fetch
   * Scenario: API request fails
   * Expected: Should display error message
   */
  it('should display error message on fetch failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load inventory.')).toBeInTheDocument();
    });
  });

  /**
   * Test Update button navigation
   * Scenario: Staff clicks Update for a car
   * Expected: Should navigate to update page with VIN
   */
  it('should navigate to update page on Update button click', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
    });
    
    const updateButton = screen.getByText('Update');
    await user.click(updateButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/staff/inventory/update/VIN123');
  });

  /**
   * Test Delete button with confirmation
   * Scenario: Staff clicks Delete and confirms
   * Expected: Should call delete API and refresh list
   */
  it('should delete car when confirmed', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    mockedApi.delete.mockResolvedValueOnce({ data: {} });
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(global.confirm).toHaveBeenCalledWith('Delete car VIN123?');
    
    await waitFor(() => {
      expect(mockedApi.delete).toHaveBeenCalledWith('/cars/VIN123');
      expect(mockedApi.get).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * Test Delete button cancellation
   * Scenario: Staff clicks Delete but cancels
   * Expected: Should not call delete API
   */
  it('should not delete car when cancelled', async () => {
    const user = userEvent.setup();
    (global.confirm as jest.Mock).mockReturnValueOnce(false);
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(mockedApi.delete).not.toHaveBeenCalled();
  });

  /**
   * Test delete error handling
   * Scenario: Delete API fails
   * Expected: Should show alert with error message
   */
  it('should show alert on delete failure', async () => {
    const user = userEvent.setup();
    const errorResponse = {
      response: {
        data: {
          error: 'Cannot delete car with active orders',
        },
      },
    };
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    mockedApi.delete.mockRejectedValueOnce(errorResponse);
    
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Cannot delete car with active orders');
    });
  });

  /**
   * Test add car form rendering
   * Scenario: Page loads successfully
   * Expected: Should display all form fields
   */
  it('should render add car form with all fields', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByLabelText('VIN')).toBeInTheDocument();
      expect(screen.getByLabelText('Make')).toBeInTheDocument();
      expect(screen.getByLabelText('Model')).toBeInTheDocument();
      expect(screen.getByLabelText('Year')).toBeInTheDocument();
      expect(screen.getByLabelText('Color')).toBeInTheDocument();
      expect(screen.getByLabelText('Mileage')).toBeInTheDocument();
      expect(screen.getByLabelText('Price ($)')).toBeInTheDocument();
      expect(screen.getByLabelText('Status')).toBeInTheDocument();
    });
  });

  /**
   * Test successful car addition
   * Scenario: Staff submits valid car data
   * Expected: Should call API and refresh list
   */
  it('should add new car successfully', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockResolvedValueOnce({ data: {} });
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByLabelText('VIN')).toBeInTheDocument();
    });
    
    await user.type(screen.getByLabelText('VIN'), 'VIN789');
    await user.type(screen.getByLabelText('Make'), 'Ford');
    await user.type(screen.getByLabelText('Model'), 'Mustang');
    await user.type(screen.getByLabelText('Year'), '2024');
    await user.type(screen.getByLabelText('Color'), 'Black');
    await user.type(screen.getByLabelText('Mileage'), '5000');
    await user.type(screen.getByLabelText('Price ($)'), '45000');
    await user.click(screen.getByRole('button', { name: 'Add Car' }));
    
    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/cars', {
        vin: 'VIN789',
        make: 'Ford',
        model: 'Mustang',
        year: 2024,
        color: 'Black',
        mileage: 5000,
        price: 45000,
        availabilityStatus: 'AVAILABLE',
        lastServiceDate: null,
      });
      expect(mockedApi.get).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * Test form reset after successful addition
   * Scenario: Car is added successfully
   * Expected: Form fields should be cleared
   */
  it('should clear form after successful car addition', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockResolvedValueOnce({ data: {} });
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByLabelText('VIN')).toBeInTheDocument();
    });
    
    const vinInput = screen.getByLabelText('VIN') as HTMLInputElement;
    await user.type(vinInput, 'VIN789');
    await user.type(screen.getByLabelText('Make'), 'Ford');
    await user.type(screen.getByLabelText('Model'), 'Mustang');
    await user.type(screen.getByLabelText('Year'), '2024');
    await user.type(screen.getByLabelText('Color'), 'Black');
    await user.type(screen.getByLabelText('Mileage'), '5000');
    await user.type(screen.getByLabelText('Price ($)'), '45000');
    await user.click(screen.getByRole('button', { name: 'Add Car' }));
    
    await waitFor(() => {
      expect(vinInput.value).toBe('');
    });
  });

  /**
   * Test add car error handling
   * Scenario: Add car API fails
   * Expected: Should display error message
   */
  it('should display error on add car failure', async () => {
    const user = userEvent.setup();
    const errorResponse = {
      response: {
        data: {
          error: 'VIN already exists',
        },
      },
    };
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockRejectedValueOnce(errorResponse);
    
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByLabelText('VIN')).toBeInTheDocument();
    });
    
    await user.type(screen.getByLabelText('VIN'), 'VIN123');
    await user.type(screen.getByLabelText('Make'), 'Toyota');
    await user.type(screen.getByLabelText('Model'), 'Camry');
    await user.type(screen.getByLabelText('Year'), '2023');
    await user.type(screen.getByLabelText('Color'), 'Blue');
    await user.type(screen.getByLabelText('Mileage'), '15000');
    await user.type(screen.getByLabelText('Price ($)'), '25000');
    await user.click(screen.getByRole('button', { name: 'Add Car' }));
    
    await waitFor(() => {
      expect(screen.getByText('VIN already exists')).toBeInTheDocument();
    });
  });

  /**
   * Test loading state during car addition
   * Scenario: Form is being submitted
   * Expected: Should show loading text and disable button
   */
  it('should show loading state during car addition', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockImplementation(() => new Promise(() => {}));
    
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByLabelText('VIN')).toBeInTheDocument();
    });
    
    await user.type(screen.getByLabelText('VIN'), 'VIN789');
    await user.type(screen.getByLabelText('Make'), 'Ford');
    await user.type(screen.getByLabelText('Model'), 'Mustang');
    await user.type(screen.getByLabelText('Year'), '2024');
    await user.type(screen.getByLabelText('Color'), 'Black');
    await user.type(screen.getByLabelText('Mileage'), '5000');
    await user.type(screen.getByLabelText('Price ($)'), '45000');
    await user.click(screen.getByRole('button', { name: 'Add Car' }));
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'Adding...' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  /**
   * Test status dropdown options
   * Scenario: Staff views add car form
   * Expected: Should display all availability status options
   */
  it('should render all status options in dropdown', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByText('Reserved')).toBeInTheDocument();
      expect(screen.getByText('Sold')).toBeInTheDocument();
    });
  });

  /**
   * Test form input types
   * Scenario: Form is rendered
   * Expected: Numeric fields should have correct input types
   */
  it('should use correct input types for numeric fields', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    renderCarInventory();
    
    await waitFor(() => {
      expect(screen.getByLabelText('Year')).toHaveAttribute('type', 'number');
      expect(screen.getByLabelText('Mileage')).toHaveAttribute('type', 'number');
      expect(screen.getByLabelText('Price ($)')).toHaveAttribute('type', 'number');
    });
  });
});
