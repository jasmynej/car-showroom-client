import React from 'react';
import { useAppContext } from '../../context/AppContext';
import LogoutButton from '../../components/LogoutButton';
import './ManagerHome.css';

const ManagerHome = () =&gt; {
  const { user } = useAppContext();

  return (
    &lt;div className="manager-home"&gt;
      &lt;header className="home-header"&gt;
        &lt;h1&gt;Manager Dashboard&lt;/h1&gt;
        &lt;LogoutButton /&gt;
      &lt;/header&gt;
      &lt;div className="home-content"&gt;
        &lt;h2&gt;Welcome, {user?.name}!&lt;/h2&gt;
        &lt;p&gt;Email: {user?.email}&lt;/p&gt;
        &lt;p&gt;Role: {user?.role}&lt;/p&gt;
        &lt;div className="info-box"&gt;
          &lt;h3&gt;Manager Features&lt;/h3&gt;
          &lt;ul&gt;
            &lt;li&gt;View sales reports&lt;/li&gt;
            &lt;li&gt;Manage inventory&lt;/li&gt;
            &lt;li&gt;Approve transactions&lt;/li&gt;
            &lt;li&gt;Manage staff&lt;/li&gt;
            &lt;li&gt;Generate analytics&lt;/li&gt;
          &lt;/ul&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default ManagerHome;
