import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Protected Pages
import Dashboard from './pages/dashboard/Dashboard';
import OrderDashboard from './pages/orders/OrderDashboard';
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import TrackingDashboard from './pages/tracking/TrackingDashboard';
import ReportsDashboard from './pages/reports/ReportsDashboard';
import UserManagement from './pages/users/UserManagement';
import Profile from './pages/users/Profile';
import Settings from './pages/users/Settings';

// Styles
import './styles/variables.css';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/orders" element={<OrderDashboard />} />
                    <Route path="/inventory" element={<InventoryDashboard />} />
                    <Route path="/tracking" element={<TrackingDashboard />} />
                    <Route path="/reports" element={<ReportsDashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute roles="admin">
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
