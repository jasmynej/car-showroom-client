import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import type { PurchaseOrder, Car, Invoice } from '../../types';

export default function CreateInvoice() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selected, setSelected] = useState<PurchaseOrder | null>(null);
  const [carPrice, setCarPrice] = useState<number | null>(null);
  const [tax, setTax] = useState('');
  const [terms, setTerms] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Invoice | null>(null);

  useEffect(() => {
    api.get<PurchaseOrder[]>('/orders')
      .then(r => setOrders(r.data.filter(o => o.status === 'APPROVED')))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (order: PurchaseOrder) => {
    setSelected(order);
    setCarPrice(null);
    setFormError('');
    setResult(null);
    try {
      const res = await api.get<Car>(`/cars/${order.vin}`);
      setCarPrice(res.data.price);
    } catch {
      setFormError('Failed to fetch car price.');
    }
  };

  const totalAmount = carPrice != null && tax !== ''
    ? carPrice + carPrice * Number(tax) / 100
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || carPrice == null) return;
    setFormError('');
    setSubmitting(true);
    try {
      const res = await api.post<Invoice>('/invoices', {
        orderId: selected.orderId,
        customerId: selected.customerId,
        price: carPrice,
        tax: Number(tax),
        termsAndConditions: terms,
      });
      setResult(res.data);
      setSelected(null);
      setCarPrice(null);
      setTax('');
      setTerms('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setFormError(msg ?? 'Failed to create invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <Navbar role="MANAGER" />
      <div className="page-content">
        <h1>Create Invoice</h1>

        {result && (
          <div className="success-card">
            <h2>Invoice Created!</h2>
            <p>Invoice ID: <strong>{result.invoiceId}</strong> — Total: <strong>${result.totalAmount.toLocaleString()}</strong></p>
            <button className="btn btn-outline" onClick={() => setResult(null)}>Create Another</button>
          </div>
        )}

        {!result && (
          <>
            <div className="panel">
              <h2>Approved Orders</h2>
              {loading && <p>Loading...</p>}
              {error && <p className="error-text">{error}</p>}
              {!loading && !error && orders.length === 0 && <p className="empty-msg">No approved orders.</p>}
              {!loading && !error && orders.length > 0 && (
                <div className="table-wrapper">
                  <table className="car-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer ID</th>
                        <th>VIN</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.orderId} className={selected?.orderId === o.orderId ? 'row-selected' : ''}>
                          <td>{o.orderId}</td>
                          <td>{o.customerId}</td>
                          <td className="mono">{o.vin}</td>
                          <td>{o.date}</td>
                          <td><StatusBadge status={o.status} /></td>
                          <td>
                            <button className="btn btn-sm" onClick={() => handleSelect(o)}>Select</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selected && (
              <div className="form-card" style={{ marginTop: '1.5rem' }}>
                <h2>Invoice Details</h2>
                <form onSubmit={handleSubmit}>
                  {formError && <p className="error-text">{formError}</p>}

                  <label>Order ID</label>
                  <input type="text" value={selected.orderId} readOnly className="input-readonly" />

                  <label>Customer ID</label>
                  <input type="text" value={selected.customerId} readOnly className="input-readonly" />

                  <label>Price ($)</label>
                  <input type="text" value={carPrice != null ? carPrice.toLocaleString() : 'Loading...'} readOnly className="input-readonly" />

                  <label>Tax (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={tax}
                    onChange={e => setTax(e.target.value)}
                    placeholder="e.g. 13"
                    required
                  />

                  <label>Total Amount ($)</label>
                  <input
                    type="text"
                    value={totalAmount != null ? totalAmount.toFixed(2) : '—'}
                    readOnly
                    className="input-readonly"
                  />

                  <label>Terms &amp; Conditions</label>
                  <textarea
                    value={terms}
                    onChange={e => setTerms(e.target.value)}
                    rows={4}
                    placeholder="Payment due within 7 days..."
                    required
                  />

                  <button type="submit" className="btn btn-primary" disabled={submitting || carPrice == null}>
                    {submitting ? 'Creating...' : 'Create Invoice'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
