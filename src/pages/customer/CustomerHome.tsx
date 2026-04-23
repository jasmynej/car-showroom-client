import Navbar from '../../components/Navbar';
import ProfilePanel from '../../components/ProfilePanel';
import { useApp } from '../../context/AppContext';

export default function CustomerHome() {
  const { userId } = useApp();

  return (
    <div className="page">
      <Navbar role="CUSTOMER" />
      <div className="page-content">
        <ProfilePanel userId={userId!} />
      </div>
    </div>
  );
}
