import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { useApp } from '../../context/AppContext';

export default function ScheduleTestDrive() {
  const { vin } = useParams<{ vin: string }>();
  const { userId } = useApp();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [comments, setComments] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/test-drives', {
        vin,
        customerId: userId,
        date,
        time,
        comments,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Failed to schedule test drive.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <Navbar role="CUSTOMER" />
        <div className="page-content">
          <div className="success-card">
            <h2>Test Drive Scheduled!</h2>
            <p>Your test drive for VIN <strong>{vin}</strong> has been scheduled for {date} at {time}.</p>
            <Link to="/customer/cars" className="btn btn-primary">Back to Cars</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar role="CUSTOMER" />
      <div className="page-content">
        <div className="form-card">
          <h1>Schedule Test Drive</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <label>VIN</label>
            <input type="text" value={vin ?? ''} readOnly className="input-readonly" />

            <label>Customer ID</label>
            <input type="text" value={userId ?? ''} readOnly className="input-readonly" />

            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

            <label>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} required />

            <label>Comments</label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={3}
              placeholder="Any notes..."
            />

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Test Drive'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
