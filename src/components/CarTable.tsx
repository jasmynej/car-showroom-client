import type { Car } from '../types';
import StatusBadge from './StatusBadge';

interface Action {
  label: string;
  onClick: (car: Car) => void;
}

interface CarTableProps {
  cars: Car[];
  actions: Action[];
}

export default function CarTable({ cars, actions }: CarTableProps) {
  if (cars.length === 0) {
    return <p className="empty-msg">No cars found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="car-table">
        <thead>
          <tr>
            <th>VIN</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Color</th>
            <th>Mileage</th>
            <th>Last Service</th>
            <th>Price</th>
            <th>Status</th>
            {actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car.vin}>
              <td className="mono">{car.vin}</td>
              <td>{car.make}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>{car.color}</td>
              <td>{car.mileage.toLocaleString()} km</td>
              <td>{car.lastServiceDate ?? '—'}</td>
              <td>${car.price.toLocaleString()}</td>
              <td><StatusBadge status={car.availabilityStatus} /></td>
              {actions.length > 0 && (
                <td className="actions-cell">
                  {actions.map(action => (
                    <button
                      key={action.label}
                      className="btn btn-sm"
                      onClick={() => action.onClick(car)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
