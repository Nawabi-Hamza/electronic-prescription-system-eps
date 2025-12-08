// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthModule from '../modules/auth';
import Unauthorized from '../modules/common/Unauthorized'; 
import OwnerModule from '../modules/owner';
import DoctorModule from '../modules/doctor';
import WebModule from '../modules/website';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/*" element={<WebModule />} />
      <Route path="auth/*" element={<AuthModule />} />
      
      {/* Owner routes */}
      <Route path="owner/*" element={<OwnerModule />} />
      <Route path="doctor/*" element={<DoctorModule />} />

      

      {/* Unauthorized page */}
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* Default redirect to auth login */}
      {/* <Route path="*" element={<Navigate to="/auth" replace />} /> */}
    </Routes>
  );
};

export default AppRoutes;
