import { Route, Routes, Navigate } from 'react-router-dom';
import Profile from '../common/Profile';
import NotFoundPage from '../common/404';
import AiMode from './pages/AiMode';
import OwnerLayout from '../../layouts/OwnerLayout';
import OwnerDashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import ProtectedRoute from '../../routes/ProtectedRoute';


const OwnerModule = () => {

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute roles={['owner']}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<OwnerDashboard />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="doctors" element={<Doctors />} />

        <Route path="profile" element={<Profile title="Owner Profile" />} />
        <Route path="ai-mode" element={<AiMode />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
    </Routes>
  );
};

export default OwnerModule;
