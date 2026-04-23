import Navbar from '../../components/Navbar';
import ProfilePanel from '../../components/ProfilePanel';
import { useApp } from '../../context/AppContext';

export default function StaffHome() {
  const { userId } = useApp();

  return (
    <div className="page">
      <Navbar role="STAFF" />
      <div className="page-content">
        <ProfilePanel userId={userId!} />
      </div>
    </div>
  );
}
