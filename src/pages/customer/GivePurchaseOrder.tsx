import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { useApp } from '../../context/AppContext';

export default function GivePurchaseOrder() {
  const { vin } = useParams<{ vin: string }>();
  const { userId } = useApp();
  const navigate = useNavigate();

  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/orders', { customerId: userId, vin, comments });
      navigate(`/customer/payment/${vin}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Failed to submit order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar role="CUSTOMER" />
      <div className="page-content">
        <div className="form-card">
          <h1>Purchase Order</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <label>VIN</label>
            <input type="text" value={vin ?? ''} readOnly className="input-readonly" />

            <label>Customer ID</label>
            <input type="text" value={userId ?? ''} readOnly className="input-readonly" />

            <label>Comments</label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={4}
              placeholder="Any comments about your purchase..."
            />

            <label>Status</label>
            <input type="text" value="PENDING" readOnly className="input-readonly" />

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Purchase Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
