import React from 'react';
import { Outlet } from 'react-router-dom';

const WebLayout = () => {

  return (
    <div className="flex h-screen bg-gray-100 animate__backInDown animate__animated animate__delay-.5s">
      {/* flex-col, flex-grow, and full height */}
      <div className="flex w-full overflow-auto flex-col flex-grow h-full">
        {/* main fills remaining height, scrolls internally */}
        <main className={`max-w-8xl mx-auto overflow-auto h-full animate__fadeIn animate__animated animate__delay-.5s`}>
          <Outlet />
          {/* <Footer /> */}
        </main>
      </div>
    </div>
  );
};


export default WebLayout;
