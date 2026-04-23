import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-card">
        <h1>Car Showroom</h1>
        <p>Welcome! Please sign up or log in to continue.</p>
        <div className="landing-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}
