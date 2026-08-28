import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PetlyProvider, usePetly } from './context/PetlyContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PetProfile } from './pages/PetProfile';
import { PetCareServices } from './pages/PetCareServices';
import { BookService } from './pages/BookService';
import { MyBookings } from './pages/MyBookings';
import { PetHealth } from './pages/PetHealth';
import { EmergencyHelp } from './pages/EmergencyHelp';
import { ProfileSettings } from './pages/ProfileSettings';
import { PetMarketplace } from './pages/PetMarketplace';

// Route guard for pages requiring login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = usePetly();
  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <div className="app-container">
      <Navbar />
      <Toast />
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<PetCareServices />} />
          <Route path="/marketplace" element={<PetMarketplace />} />
          <Route path="/emergency" element={<EmergencyHelp />} />

          {/* Protected Member Pages */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pets" element={<ProtectedRoute><PetProfile /></ProtectedRoute>} />
          <Route path="/book" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/health" element={<ProtectedRoute><PetHealth /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <PetlyProvider>
      <AppRoutes />
    </PetlyProvider>
  );
}

export default App;
