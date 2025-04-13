import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import LoadingScreen from '@/shared/components/LoadingScreen';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    // Redirect to home if not logged in, but save the location they tried to access
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  if (adminOnly && !user.app_metadata?.roles?.includes('admin')) {
    // Redirect non-admin users
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;