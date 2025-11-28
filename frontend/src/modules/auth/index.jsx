// src/modules/auth/index.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AuthLayout from '../../layouts/AuthLayout';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OwnerLogin from './pages/OwnerLogin';
import NotFoundPage from '../common/404';

const AuthModule = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="owner/login" element={<OwnerLogin />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* Add more auth routes like register, forgot password here */}
      </Route>
        <Route path="*" element={<NotFoundPage />} />
      {/* <Route path="*" element={<Navigate to="login" replace />} /> */}
    </Routes>
  );
};

export default AuthModule;
