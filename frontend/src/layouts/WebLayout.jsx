import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../modules/website/components/Navbar';
import Footer from '../modules/website/components/Footer';

const WebLayout = () => {

  return (
    <div className="w-full  overflow-x-hidden  relative antialiased animate__fadeIn animate__animated animate__delay-.5s">
      <>
        <Navbar  />
      </>
          <Outlet />
        <Footer />

    </div>
  );
};


export default WebLayout;
