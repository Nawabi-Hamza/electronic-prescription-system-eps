import { Route, Routes, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import NotFoundPage from '../common/404';
import AiMode from './pages/AiMode';
import ProtectedRoute from '../../routes/ProtectedRoute';
import DoctorDashboard from './pages/Dashboard';
import DoctorLayout from '../../layouts/DoctorLayout';
import Medicine from './pages/Medicine';
import { useEffect, useState } from 'react';
import { getPaymentsDetails } from '../../api/me';


const DoctorModule = () => {
  const [payments, setPayments] = useState({})
  useEffect(() => { getPaymentsDetails({ seter: setPayments }) }, [])
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DoctorDashboard payments={payments}/>} />
        <Route path="dashboard" element={<DoctorDashboard />} />

        <Route path="medicine" element={<Medicine payments={payments} />} />
       

        <Route path="profile" element={<Profile title="Doctor Profile" />} />
        <Route path="ai-mode" element={<AiMode />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
    </Routes>
  );
};

export default DoctorModule;
