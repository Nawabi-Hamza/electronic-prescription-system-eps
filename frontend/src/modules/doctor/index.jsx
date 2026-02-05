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
import Payments from './pages/Payments';
import PrescriptionPage from './pages/PrescriptionPage';
import Appoinment from './pages/Appoinment';
import PrescriptionSettings from './pages/PrescriptionSettings';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';


const DoctorModule = () => {
  const [payments, setPayments] = useState({})
  useEffect(() => { getPaymentsDetails({ seter: setPayments }) }, [])
  return (
    <Routes>
            {/* Payment redirect pages */}
      <Route
        element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DoctorDashboard />} />
        <Route path="dashboard" element={<DoctorDashboard />} />

        <Route path="medicine" element={<Medicine />} />
        <Route path="payments" element={<Payments payments={payments} />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />


        <Route path="prescription" element={<PrescriptionPage />} />
        <Route path="prescription/settings" element={<PrescriptionSettings />} />
        <Route path="appoinment" element={<Appoinment payments={payments} />} />
       

        <Route path="profile" element={<Profile title="Doctor Profile" />} />
        <Route path="ai-mode" element={<AiMode />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
    </Routes>
  );
};

export default DoctorModule;
