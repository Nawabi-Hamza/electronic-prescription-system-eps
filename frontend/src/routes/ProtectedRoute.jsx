import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // 1️⃣ Wait until AuthProvider finishes loading (API or cache)
  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  // 2️⃣ If no user after loading → redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 3️⃣ Role-based check (optional)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ All checks passed → render protected content
  return children;
};

export default ProtectedRoute;



// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// const ProtectedRoute = ({ children, roles }) => {
//   const { user } = useAuth();

//   if (!user) {
//     // Not logged in
//     return <Navigate to="/auth/login" replace />;
//   }

//   if (roles && !roles.includes(user.role)) {
//     // User role does not match any allowed role
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
