import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { useApp } from '../../context/AppContext';

export default function ScheduleService() {
  const { vin } = useParams<{ vin: string }>();
  const { userId } = useApp();

  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/services', {
        vin,
        serviceType,
        date,
        comments,
        staffId: userId,
      });
      setSuccess(true);
      setServiceType('');
      setDate('');
      setComments('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Failed to schedule service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar role="STAFF" />
      <div className="page-content">
        <div className="form-card">
          <h1>Schedule Service</h1>
          {success && <p className="success-text">Service scheduled successfully!</p>}
          <form onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <label>VIN</label>
            <input type="text" value={vin ?? ''} readOnly className="input-readonly" />

            <label>Service Type</label>
            <input
              type="text"
              value={serviceType}
              onChange={e => setServiceType(e.target.value)}
              placeholder="e.g. Oil Change, Tire Rotation"
              required
            />

            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

            <label>Comments</label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={3}
              placeholder="Any notes..."
            />

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Service'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
