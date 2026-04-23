import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import EventForm from './components/EventForm';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Protected Internal Routes */}
              <Route 
                path="/bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/new" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <EventForm />
                  </ProtectedRoute>
                } 
              />

              {/* Redirect any unknown route to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-gray-100 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-gray-400 text-sm font-inter">
                © 2026 Eventify Inc. Secure Event Management. <br/>
                <span className="text-xs mt-2 inline-block font-medium">Built with React, JWT, and Bcrypt.</span>
              </p>
            </div>
          </footer>
        </div>
      </Router>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
