import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { useApp } from '../../context/AppContext';
import type { PaymentMethod } from '../../types';

export default function MakePayment() {
  const { vin } = useParams<{ vin: string }>();
  const { userId } = useApp();

  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('CREDIT_CARD');

  // Credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');

  // Cash fields
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [bank, setBank] = useState('');

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const base = {
      invoiceId: Number(invoiceId),
      customerId: userId,
      vin,
      amount: Number(amount),
      paymentMethod: method,
    };

    const body = method === 'CREDIT_CARD'
      ? { ...base, creditCardNumber: cardNumber, cvvCode: cvv }
      : { ...base, accountNumber, pin, bank };

    try {
      await api.post('/payments', body);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Payment failed. Please try again.');
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
            <h2>Payment Successful!</h2>
            <p>Your payment for VIN <strong>{vin}</strong> has been processed. The car is now yours!</p>
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
          <h1>Make Payment</h1>
          <p className="hint">Enter the Invoice ID provided by the dealership after your order is approved.</p>
          <form onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <label>VIN</label>
            <input type="text" value={vin ?? ''} readOnly className="input-readonly" />

            <label>Customer ID</label>
            <input type="text" value={userId ?? ''} readOnly className="input-readonly" />

            <label>Invoice ID</label>
            <input
              type="number"
              value={invoiceId}
              onChange={e => setInvoiceId(e.target.value)}
              placeholder="Invoice ID from dealership"
              required
            />

            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />

            <label>Payment Method</label>
            <select value={method} onChange={e => setMethod(e.target.value as PaymentMethod)}>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="CASH">Cash</option>
            </select>

            {method === 'CREDIT_CARD' && (
              <>
                <label>Card Number</label>
                <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required placeholder="1234 5678 9012 3456" />
                <label>CVV</label>
                <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} required placeholder="123" maxLength={4} />
              </>
            )}

            {method === 'CASH' && (
              <>
                <label>Account Number</label>
                <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
                <label>PIN</label>
                <input type="password" value={pin} onChange={e => setPin(e.target.value)} required maxLength={6} />
                <label>Bank</label>
                <input type="text" value={bank} onChange={e => setBank(e.target.value)} required placeholder="e.g. TD Bank" />
              </>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
