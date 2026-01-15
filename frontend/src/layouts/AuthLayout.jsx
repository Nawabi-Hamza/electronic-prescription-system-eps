// src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { appConfig } from '../utils/appConfig.js';
import Footer from './Footer';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-24 bg-gray-100 px-4" >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-sky-700">
          {appConfig.name}</h1>
      </div>
      <div className="w-full max-w-md p-8 bg-white rounded shadow" id='container-of-svg'>
        <Outlet />
      </div>
      <div className='bg-white text-slate-400 p-4 mt-4 rounded-md flex flex-col w-full shadow max-w-md justify-center items-center'>
          <p>Developed By: <a className='text-sky-300' href="https://paikarsoft.netlify.app/">Paikar-ICT</a></p>
          <p>&copy; 2024 - {new Date().getFullYear()} | All rights reserved by</p>
      </div>
      {/* <p className='mt-2'>Developed By <a className='text-sky-400' href="https://paikarsoft.netlify.app/">PaikarSoft</a></p> */}
    </div>
  );
};

export default AuthLayout;
