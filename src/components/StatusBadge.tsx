interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  AVAILABLE: 'badge-green',
  APPROVED: 'badge-green',
  COMPLETED: 'badge-grey',
  RESERVED: 'badge-yellow',
  PENDING: 'badge-orange',
  SCHEDULED: 'badge-blue',
  SOLD: 'badge-red',
  CANCELLED: 'badge-red',
  REJECTED: 'badge-red',
  PAID: 'badge-green',
  UNPAID: 'badge-red',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cls = statusColors[status] ?? 'badge-grey';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}
