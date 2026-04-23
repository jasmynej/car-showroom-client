import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CarTable from '../../components/CarTable';
import api from '../../api/axios';
import type { Car, AvailabilityStatus } from '../../types';

const emptyForm = {
  vin: '', make: '', model: '', year: '', color: '',
  mileage: '', price: '', availabilityStatus: 'AVAILABLE' as AvailabilityStatus,
};

export default function CarInventory() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCars = () => {
    setLoading(true);
    api.get<Car[]>('/cars')
      .then(r => setCars(r.data))
      .catch(() => setError('Failed to load inventory.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCars(); }, []);

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      await api.post('/cars', {
        vin: form.vin,
        make: form.make,
        model: form.model,
        year: Number(form.year),
        color: form.color,
        mileage: Number(form.mileage),
        price: Number(form.price),
        availabilityStatus: form.availabilityStatus,
        lastServiceDate: null,
      });
      setForm(emptyForm);
      fetchCars();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setFormError(msg ?? 'Failed to add car.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (car: Car) => {
    if (!window.confirm(`Delete car ${car.vin}?`)) return;
    try {
      await api.delete(`/cars/${car.vin}`);
      fetchCars();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      alert(msg ?? 'Failed to delete car.');
    }
  };

  const actions = [
    { label: 'Update', onClick: (car: Car) => navigate(`/staff/inventory/update/${car.vin}`) },
    { label: 'Delete', onClick: handleDelete },
  ];

  return (
    <div className="page">
      <Navbar role="STAFF" />
      <div className="page-content">
        <h1>Car Inventory</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && <CarTable cars={cars} actions={actions} />}

        <div className="panel form-card" style={{ marginTop: '2rem' }}>
          <h2>Add New Car</h2>
          <form onSubmit={handleAdd}>
            {formError && <p className="error-text">{formError}</p>}
            <div className="form-grid">
              <div>
                <label>VIN</label>
                <input value={form.vin} onChange={e => set('vin', e.target.value)} required />
              </div>
              <div>
                <label>Make</label>
                <input value={form.make} onChange={e => set('make', e.target.value)} required />
              </div>
              <div>
                <label>Model</label>
                <input value={form.model} onChange={e => set('model', e.target.value)} required />
              </div>
              <div>
                <label>Year</label>
                <input type="number" value={form.year} onChange={e => set('year', e.target.value)} required />
              </div>
              <div>
                <label>Color</label>
                <input value={form.color} onChange={e => set('color', e.target.value)} required />
              </div>
              <div>
                <label>Mileage</label>
                <input type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} required />
              </div>
              <div>
                <label>Price ($)</label>
                <input type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required />
              </div>
              <div>
                <label>Status</label>
                <select value={form.availabilityStatus} onChange={e => set('availabilityStatus', e.target.value)}>
                  <option value="AVAILABLE">Available</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="SOLD">Sold</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Adding...' : 'Add Car'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
