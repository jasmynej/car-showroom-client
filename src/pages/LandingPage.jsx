import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () =&gt; {
  const navigate = useNavigate();

  return (
    &lt;div className="landing-container"&gt;
      &lt;div className="landing-content"&gt;
        &lt;h1&gt;Welcome to Car Showroom&lt;/h1&gt;
        &lt;p&gt;Your premier destination for quality vehicles&lt;/p&gt;
        &lt;div className="button-group"&gt;
          &lt;button onClick={() =&gt; navigate('/login')} className="btn btn-primary"&gt;
            Log In
          &lt;/button&gt;
          &lt;button onClick={() =&gt; navigate('/signup')} className="btn btn-secondary"&gt;
            Sign Up
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default LandingPage;
