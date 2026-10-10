import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from './Loader';

export const ProtectedRoute = ({ children, requiresAdmin = false, requiresCitizen = false }) => {
  const { user, isAuthenticated, isAdmin, isCitizen, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/citizen/dashboard" replace />;
  }

  if (requiresCitizen && !isCitizen && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
