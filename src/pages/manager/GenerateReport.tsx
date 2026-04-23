import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import type { Sale } from '../../types';

export default function GenerateReport() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Sale[]>('/sales')
      .then(r => setSales(r.data))
      .catch(() => setError('Failed to load sales data.'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = sales.map(s => ({
    name: `#${s.saleId}`,
    sales: 1,
    vin: s.vin,
    date: s.saleDate,
  }));

  const colors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'];

  return (
    <div className="page">
      <Navbar role="MANAGER" />
      <div className="page-content">
        <h1>Sales Report</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && sales.length === 0 && (
          <p className="empty-msg">No sales recorded yet.</p>
        )}

        {!loading && !error && sales.length > 0 && (
          <>
            <div className="panel" style={{ marginBottom: '1.5rem' }}>
              <h2>Sales by ID</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const d = payload[0].payload as { vin: string; date: string };
                      return (
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>
                          <p><strong>VIN:</strong> {d.vin}</p>
                          <p><strong>Date:</strong> {d.date}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {chartData.map((_entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel">
              <h2>Sales Summary</h2>
              <div className="table-wrapper">
                <table className="car-table">
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>Date</th>
                      <th>VIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(s => (
                      <tr key={s.saleId}>
                        <td>{s.saleId}</td>
                        <td>{s.saleDate}</td>
                        <td className="mono">{s.vin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="report-total">Total Sales: <strong>{sales.length}</strong></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
