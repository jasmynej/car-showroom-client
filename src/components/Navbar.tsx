import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  role: string;
}

export default function Navbar({ role }: NavbarProps) {
  const { clearUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Car Showroom</div>
      <div className="navbar-links">
        {role === 'CUSTOMER' && (
          <>
            <Link to="/customer/home">Home</Link>
            <Link to="/customer/cars">View Cars</Link>
          </>
        )}
        {role === 'STAFF' && (
          <>
            <Link to="/staff/home">Home</Link>
            <Link to="/staff/services">Car Services</Link>
            <Link to="/staff/inventory">Inventory</Link>
          </>
        )}
        {role === 'MANAGER' && (
          <>
            <Link to="/manager/home">Home</Link>
            <Link to="/manager/report">Report</Link>
            <Link to="/manager/invoice">Invoices</Link>
          </>
        )}
        <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
}
