import { Route, Routes, Navigate } from 'react-router-dom';
import NotFoundPage from '../common/404';
import WebLayout from '../../layouts/WebLayout';
import HomePage from './pages/HomePage';


const WebModule = () => {

  return (
    <Routes>
      <Route
        element={
          // <ProtectedRoute roles={['owner']}>
            <WebLayout />
          // </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        {/* <Route path="" element={<OwnerDashboard />} /> */}
        {/* <Route path="doctors" element={<Doctors />} /> */}
        {/* <Route path="payments" element={<Payments />} /> */}

        {/* <Route path="profile" element={<Profile title="Owner Profile" />} /> */}
        {/* <Route path="ai-mode" element={<AiMode />} /> */}
      </Route>

        <Route path="*" element={<NotFoundPage />} />
      {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
    </Routes>
  );
};

export default WebModule;
