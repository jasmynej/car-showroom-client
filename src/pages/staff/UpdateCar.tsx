import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import type { Car, AvailabilityStatus } from '../../types';

export default function UpdateCar() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    make: '', model: '', year: '', color: '',
    mileage: '', price: '', availabilityStatus: 'AVAILABLE' as AvailabilityStatus,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Car>(`/cars/${vin}`)
      .then(r => {
        const c = r.data;
        setForm({
          make: c.make,
          model: c.model,
          year: String(c.year),
          color: c.color,
          mileage: String(c.mileage),
          price: String(c.price),
          availabilityStatus: c.availabilityStatus,
        });
      })
      .catch(() => setError('Failed to load car.'))
      .finally(() => setLoading(false));
  }, [vin]);

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.put(`/cars/${vin}`, {
        make: form.make,
        model: form.model,
        year: Number(form.year),
        color: form.color,
        mileage: Number(form.mileage),
        price: Number(form.price),
        availabilityStatus: form.availabilityStatus,
      });
      navigate('/staff/inventory');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Failed to update car.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <Navbar role="STAFF" />
      <div className="page-content">
        <div className="form-card">
          <h1>Update Car</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && (
            <form onSubmit={handleSubmit}>
              <label>VIN</label>
              <input type="text" value={vin ?? ''} readOnly className="input-readonly" />

              <div className="form-grid">
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

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/staff/inventory')}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
