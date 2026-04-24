import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

/**
 * Test suite for StatusBadge component
 * Tests the rendering of status badges with appropriate styling
 */
describe('StatusBadge', () => {
  /**
   * Test rendering AVAILABLE status
   * Scenario: Car is available for purchase
   * Expected: Badge displays with green styling
   */
  it('should render AVAILABLE status with green badge', () => {
    render(<StatusBadge status="AVAILABLE" />);
    const badge = screen.getByText('AVAILABLE');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('status-badge', 'badge-green');
  });

  /**
   * Test rendering APPROVED status
   * Scenario: Order or request is approved
   * Expected: Badge displays with green styling
   */
  it('should render APPROVED status with green badge', () => {
    render(<StatusBadge status="APPROVED" />);
    const badge = screen.getByText('APPROVED');
    expect(badge).toHaveClass('badge-green');
  });

  /**
   * Test rendering COMPLETED status
   * Scenario: Task or order is completed
   * Expected: Badge displays with grey styling
   */
  it('should render COMPLETED status with grey badge', () => {
    render(<StatusBadge status="COMPLETED" />);
    const badge = screen.getByText('COMPLETED');
    expect(badge).toHaveClass('badge-grey');
  });

  /**
   * Test rendering RESERVED status
   * Scenario: Car is reserved but not sold
   * Expected: Badge displays with yellow styling
   */
  it('should render RESERVED status with yellow badge', () => {
    render(<StatusBadge status="RESERVED" />);
    const badge = screen.getByText('RESERVED');
    expect(badge).toHaveClass('badge-yellow');
  });

  /**
   * Test rendering PENDING status
   * Scenario: Order is awaiting approval
   * Expected: Badge displays with orange styling
   */
  it('should render PENDING status with orange badge', () => {
    render(<StatusBadge status="PENDING" />);
    const badge = screen.getByText('PENDING');
    expect(badge).toHaveClass('badge-orange');
  });

  /**
   * Test rendering SCHEDULED status
   * Scenario: Service or test drive is scheduled
   * Expected: Badge displays with blue styling
   */
  it('should render SCHEDULED status with blue badge', () => {
    render(<StatusBadge status="SCHEDULED" />);
    const badge = screen.getByText('SCHEDULED');
    expect(badge).toHaveClass('badge-blue');
  });

  /**
   * Test rendering SOLD status
   * Scenario: Car has been sold
   * Expected: Badge displays with red styling
   */
  it('should render SOLD status with red badge', () => {
    render(<StatusBadge status="SOLD" />);
    const badge = screen.getByText('SOLD');
    expect(badge).toHaveClass('badge-red');
  });

  /**
   * Test rendering CANCELLED status
   * Scenario: Order or appointment is cancelled
   * Expected: Badge displays with red styling
   */
  it('should render CANCELLED status with red badge', () => {
    render(<StatusBadge status="CANCELLED" />);
    const badge = screen.getByText('CANCELLED');
    expect(badge).toHaveClass('badge-red');
  });

  /**
   * Test rendering REJECTED status
   * Scenario: Order or request is rejected
   * Expected: Badge displays with red styling
   */
  it('should render REJECTED status with red badge', () => {
    render(<StatusBadge status="REJECTED" />);
    const badge = screen.getByText('REJECTED');
    expect(badge).toHaveClass('badge-red');
  });

  /**
   * Test rendering PAID status
   * Scenario: Payment has been completed
   * Expected: Badge displays with green styling
   */
  it('should render PAID status with green badge', () => {
    render(<StatusBadge status="PAID" />);
    const badge = screen.getByText('PAID');
    expect(badge).toHaveClass('badge-green');
  });

  /**
   * Test rendering UNPAID status
   * Scenario: Payment is pending
   * Expected: Badge displays with red styling
   */
  it('should render UNPAID status with red badge', () => {
    render(<StatusBadge status="UNPAID" />);
    const badge = screen.getByText('UNPAID');
    expect(badge).toHaveClass('badge-red');
  });

  /**
   * Test rendering unknown status
   * Scenario: Status is not in predefined list
   * Expected: Badge displays with default grey styling
   */
  it('should render unknown status with default grey badge', () => {
    render(<StatusBadge status="UNKNOWN_STATUS" />);
    const badge = screen.getByText('UNKNOWN_STATUS');
    expect(badge).toHaveClass('badge-grey');
  });

  /**
   * Test badge always has base status-badge class
   * Scenario: Any status is rendered
   * Expected: All badges should have the base status-badge class
   */
  it('should always include status-badge base class', () => {
    const statuses = ['AVAILABLE', 'SOLD', 'PENDING', 'UNKNOWN'];
    
    statuses.forEach(status => {
      const { container } = render(<StatusBadge status={status} />);
      const badge = container.querySelector('.status-badge');
      expect(badge).toBeInTheDocument();
    });
  });
});
