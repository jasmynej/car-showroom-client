import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarTable from './CarTable';
import type { Car } from '../types';

/**
 * Test suite for CarTable component
 * Tests the rendering of car data in table format with actions
 */
describe('CarTable', () => {
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
      availabilityStatus: 'SOLD',
      lastServiceDate: null,
      ownerId: 5,
      lastUpdated: '2024-02-10',
    },
  ];

  /**
   * Test rendering empty state
   * Scenario: No cars are available to display
   * Expected: Should show empty message
   */
  it('should render empty message when no cars provided', () => {
    render(<CarTable cars={[]} actions={[]} />);
    expect(screen.getByText('No cars found.')).toBeInTheDocument();
  });

  /**
   * Test rendering table with car data
   * Scenario: Multiple cars are provided
   * Expected: Should display all car information in table
   */
  it('should render table with car data', () => {
    render(<CarTable cars={mockCars} actions={[]} />);
    
    expect(screen.getByText('VIN123')).toBeInTheDocument();
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Camry')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('15,000 km')).toBeInTheDocument();
    expect(screen.getByText('$25,000')).toBeInTheDocument();
  });

  /**
   * Test rendering table headers
   * Scenario: Table is rendered with data
   * Expected: Should display all column headers
   */
  it('should render all table headers', () => {
    render(<CarTable cars={mockCars} actions={[]} />);
    
    expect(screen.getByText('VIN')).toBeInTheDocument();
    expect(screen.getByText('Make')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Mileage')).toBeInTheDocument();
    expect(screen.getByText('Last Service')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  /**
   * Test rendering null lastServiceDate
   * Scenario: Car has no service history
   * Expected: Should display em dash for null service date
   */
  it('should render em dash for null lastServiceDate', () => {
    render(<CarTable cars={mockCars} actions={[]} />);
    const rows = screen.getAllByRole('row');
    expect(rows[2]).toHaveTextContent('—');
  });

  /**
   * Test rendering StatusBadge component
   * Scenario: Cars have different availability statuses
   * Expected: Should render StatusBadge for each car
   */
  it('should render StatusBadge for availability status', () => {
    render(<CarTable cars={mockCars} actions={[]} />);
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('SOLD')).toBeInTheDocument();
  });

  /**
   * Test rendering action buttons
   * Scenario: Actions are provided for cars
   * Expected: Should render action buttons for each car
   */
  it('should render action buttons when actions provided', () => {
    const mockAction = jest.fn();
    const actions = [
      { label: 'Edit', onClick: mockAction },
      { label: 'Delete', onClick: mockAction },
    ];

    render(<CarTable cars={mockCars} actions={actions} />);
    
    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');
    
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  /**
   * Test action button click handler
   * Scenario: User clicks an action button
   * Expected: Should call onClick with correct car data
   */
  it('should call action onClick with correct car', async () => {
    const user = userEvent.setup();
    const mockAction = jest.fn();
    const actions = [{ label: 'View', onClick: mockAction }];

    render(<CarTable cars={mockCars} actions={actions} />);
    
    const viewButtons = screen.getAllByText('View');
    await user.click(viewButtons[0]);
    
    expect(mockAction).toHaveBeenCalledWith(mockCars[0]);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  /**
   * Test multiple action buttons per row
   * Scenario: Multiple actions are available for each car
   * Expected: Each action should work independently
   */
  it('should handle multiple actions per car', async () => {
    const user = userEvent.setup();
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();
    const actions = [
      { label: 'Edit', onClick: mockEdit },
      { label: 'Delete', onClick: mockDelete },
    ];

    render(<CarTable cars={mockCars} actions={actions} />);
    
    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');
    
    await user.click(editButtons[1]);
    expect(mockEdit).toHaveBeenCalledWith(mockCars[1]);
    
    await user.click(deleteButtons[0]);
    expect(mockDelete).toHaveBeenCalledWith(mockCars[0]);
  });

  /**
   * Test no Actions column when no actions provided
   * Scenario: No actions are passed to component
   * Expected: Actions column header should not be rendered
   */
  it('should not render Actions column when no actions', () => {
    render(<CarTable cars={mockCars} actions={[]} />);
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  /**
   * Test Actions column header when actions provided
   * Scenario: Actions are passed to component
   * Expected: Actions column header should be rendered
   */
  it('should render Actions column header when actions provided', () => {
    const actions = [{ label: 'View', onClick: jest.fn() }];
    render(<CarTable cars={mockCars} actions={actions} />);
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  /**
   * Test number formatting for price
   * Scenario: Car has a price value
   * Expected: Price should be formatted with commas and dollar sign
   */
  it('should format price with locale string', () => {
    render(<CarTable cars={mockCars} actions={[]} />);
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('$28,000')).toBeInTheDocument();
  });

  /**
   * Test number formatting for mileage
   * Scenario: Car has a mileage value
   * Expected: Mileage should be formatted with commas and km unit
   */
  it('should format mileage with locale string and km unit', () => {
    render(<CarTable cars={mockCars} actions={[]} />);
    expect(screen.getByText('15,000 km')).toBeInTheDocument();
    expect(screen.getByText('20,000 km')).toBeInTheDocument();
  });

  /**
   * Test VIN has mono class for monospace font
   * Scenario: VIN is displayed in table
   * Expected: VIN cell should have mono class for better readability
   */
  it('should apply mono class to VIN cells', () => {
    const { container } = render(<CarTable cars={mockCars} actions={[]} />);
    const vinCells = container.querySelectorAll('.mono');
    expect(vinCells.length).toBeGreaterThan(0);
  });
});
