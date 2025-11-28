import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../componenets/Topbar';
import { mainSectionStyles } from '../styles/dashboardStyles';
import Footer from './Footer';
import OwnerSidebar from '../modules/owner/components/OwnerSidebar';

const OwnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);
  return (
    <div className="flex h-screen bg-gray-100 animate__backInDown animate__animated animate__delay-.5s">
      <OwnerSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      {/* flex-col, flex-grow, and full height */}
      <div className="flex w-full overflow-auto flex-col flex-grow h-full">
        <Topbar />
        {/* main fills remaining height, scrolls internally */}
        <main className={mainSectionStyles.container}>
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};


export default OwnerLayout;
