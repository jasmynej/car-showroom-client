import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CarTable from '../../components/CarTable';
import api from '../../api/axios';
import type { Car } from '../../types';

export default function ViewCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get<Car[]>('/cars/available')
      .then(r => setCars(r.data))
      .catch(() => setError('Failed to load cars.'))
      .finally(() => setLoading(false));
  }, []);

  const actions = [
    { label: 'Purchase Order', onClick: (car: Car) => navigate(`/customer/purchase/${car.vin}`) },
    { label: 'Test Drive', onClick: (car: Car) => navigate(`/customer/test-drive/${car.vin}`) },
  ];

  return (
    <div className="page">
      <Navbar role="CUSTOMER" />
      <div className="page-content">
        <h1>Available Cars</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && <CarTable cars={cars} actions={actions} />}
      </div>
    </div>
  );
}
