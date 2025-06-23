import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BandDetails from './pages/BandDetails';
import RehearsalCalendar from './pages/RehearsalCalendar';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

import { checkAuth } from './redux/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated when app loads
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="bands/:bandId" element={
          <PrivateRoute>
            <BandDetails />
          </PrivateRoute>
        } />
        <Route path="calendar" element={
          <PrivateRoute>
            <RehearsalCalendar />
          </PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        {/* Catch all route */}
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default App;