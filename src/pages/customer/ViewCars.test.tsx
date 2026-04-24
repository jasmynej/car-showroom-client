import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ViewCars from './ViewCars';
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
 * Test suite for ViewCars component
 * Tests displaying available cars and navigation to purchase/test drive
 */
describe('ViewCars', () => {
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
    {
      vin: 'VIN456',
      make: 'Honda',
      model: 'Accord',
      year: 2022,
      price: 28000,
      color: 'Red',
      mileage: 20000,
      availabilityStatus: 'AVAILABLE',
      lastServiceDate: null,
      ownerId: null,
      lastUpdated: '2024-02-10',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  /**
   * Helper function to render ViewCars with router context
   */
  const renderViewCars = () => {
    return render(
      <MemoryRouter>
        <AppProvider>
          <ViewCars />
        </AppProvider>
      </MemoryRouter>
    );
  };

  /**
   * Test rendering page title and navbar
   * Scenario: Customer visits view cars page
   * Expected: Should display page title and navbar
   */
  it('should render page title and navbar', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderViewCars();
    
    await waitFor(() => {
      expect(screen.getByText('Available Cars')).toBeInTheDocument();
      expect(screen.getByText('Car Showroom')).toBeInTheDocument();
    });
  });

  /**
   * Test loading state
   * Scenario: API is fetching car data
   * Expected: Should display loading message
   */
  it('should display loading state', () => {
    mockedApi.get.mockImplementation(() => new Promise(() => {}));
    renderViewCars();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  /**
   * Test successful car data fetch
   * Scenario: API returns available cars
   * Expected: Should display car table with data
   */
  it('should display cars after successful fetch', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderViewCars();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
      expect(screen.getByText('Toyota')).toBeInTheDocument();
      expect(screen.getByText('Camry')).toBeInTheDocument();
      expect(screen.getByText('VIN456')).toBeInTheDocument();
      expect(screen.getByText('Honda')).toBeInTheDocument();
      expect(screen.getByText('Accord')).toBeInTheDocument();
    });
  });

  /**
   * Test API endpoint call
   * Scenario: Component mounts
   * Expected: Should call correct API endpoint for available cars
   */
  it('should call API with correct endpoint', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderViewCars();
    
    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/cars/available');
    });
  });

  /**
   * Test error handling
   * Scenario: API request fails
   * Expected: Should display error message
   */
  it('should display error message on fetch failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
    renderViewCars();
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load cars.')).toBeInTheDocument();
    });
  });

  /**
   * Test Purchase Order button navigation
   * Scenario: Customer clicks Purchase Order for a car
   * Expected: Should navigate to purchase order page with VIN
   */
  it('should navigate to purchase order page on button click', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderViewCars();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
    });
    
    const purchaseButtons = screen.getAllByText('Purchase Order');
    await user.click(purchaseButtons[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith('/customer/purchase/VIN123');
  });

  /**
   * Test Test Drive button navigation
   * Scenario: Customer clicks Test Drive for a car
   * Expected: Should navigate to test drive page with VIN
   */
  it('should navigate to test drive page on button click', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderViewCars();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
    });
    
    const testDriveButtons = screen.getAllByText('Test Drive');
    await user.click(testDriveButtons[1]);
    
    expect(mockNavigate).toHaveBeenCalledWith('/customer/test-drive/VIN456');
  });

  /**
   * Test action buttons rendered for each car
   * Scenario: Cars are displayed
   * Expected: Each car should have Purchase Order and Test Drive buttons
   */
  it('should render action buttons for each car', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderViewCars();
    
    await waitFor(() => {
      const purchaseButtons = screen.getAllByText('Purchase Order');
      const testDriveButtons = screen.getAllByText('Test Drive');
      
      expect(purchaseButtons).toHaveLength(2);
      expect(testDriveButtons).toHaveLength(2);
    });
  });

  /**
   * Test empty cars list
   * Scenario: API returns empty array
   * Expected: Should display no cars found message
   */
  it('should display empty message when no cars available', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    renderViewCars();
    
    await waitFor(() => {
      expect(screen.getByText('No cars found.')).toBeInTheDocument();
    });
  });

  /**
   * Test loading state clears after data fetch
   * Scenario: API returns data successfully
   * Expected: Loading message should disappear
   */
  it('should clear loading state after data fetch', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderViewCars();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  /**
   * Test loading state clears after error
   * Scenario: API request fails
   * Expected: Loading message should disappear and error shown
   */
  it('should clear loading state after error', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
    renderViewCars();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Failed to load cars.')).toBeInTheDocument();
    });
  });

  /**
   * Test no error or loading when data displayed
   * Scenario: Cars are successfully loaded
   * Expected: Should not show error or loading messages
   */
  it('should not show error or loading when data is displayed', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockCars });
    renderViewCars();
    
    await waitFor(() => {
      expect(screen.getByText('VIN123')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed to load cars.')).not.toBeInTheDocument();
  });
});
