import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AdminSidebar from '../modules/admin/components/AdminSidebar';
import Topbar from '../componenets/Topbar';
import { mainSectionStyles } from '../styles/dashboardStyles';
import Footer from './Footer';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);
  const path = useParams()
  return (
    <div className="flex h-screen bg-gray-100 animate__backInDown animate__animated animate__delay-.5s">
      <AdminSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      {/* flex-col, flex-grow, and full height */}
      <div className="flex w-full overflow-auto flex-col flex-grow h-full">
        <Topbar />
        {/* main fills remaining height, scrolls internally */}
        <main className={mainSectionStyles.container}>
          {path["*"] !== "profile" && <p className="mb-4 ">/admin/{path["*"]}</p>} 
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;
