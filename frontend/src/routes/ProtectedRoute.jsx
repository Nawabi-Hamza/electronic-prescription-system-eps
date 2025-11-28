import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/auth/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // User role does not match any allowed role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
