import React from 'react';
import { useAppContext } from '../../context/AppContext';
import LogoutButton from '../../components/LogoutButton';
import './StaffHome.css';

const StaffHome = () =&gt; {
  const { user } = useAppContext();

  return (
    &lt;div className="staff-home"&gt;
      &lt;header className="home-header"&gt;
        &lt;h1&gt;Staff Dashboard&lt;/h1&gt;
        &lt;LogoutButton /&gt;
      &lt;/header&gt;
      &lt;div className="home-content"&gt;
        &lt;h2&gt;Welcome, {user?.name}!&lt;/h2&gt;
        &lt;p&gt;Email: {user?.email}&lt;/p&gt;
        &lt;p&gt;Role: {user?.role}&lt;/p&gt;
        &lt;div className="info-box"&gt;
          &lt;h3&gt;Staff Features&lt;/h3&gt;
          &lt;ul&gt;
            &lt;li&gt;Manage car inventory&lt;/li&gt;
            &lt;li&gt;Process customer orders&lt;/li&gt;
            &lt;li&gt;Schedule service appointments&lt;/li&gt;
            &lt;li&gt;Update vehicle information&lt;/li&gt;
          &lt;/ul&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default StaffHome;
