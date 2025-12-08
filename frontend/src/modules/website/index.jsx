import { Route, Routes, Navigate } from 'react-router-dom';
import NotFoundPage from '../common/404';
import WebLayout from '../../layouts/WebLayout';
import HomePage from './pages/HomePage';
import Features from './pages/Features';
import Appoinment from './pages/Appoinment';
import Contact from './pages/Contact';


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
        <Route path="/home" element={<HomePage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/appointment" element={<Appoinment />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

        <Route path="*" element={<NotFoundPage />} />
      {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
    </Routes>
  );
};

export default WebModule;
