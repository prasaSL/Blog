import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Use effect to delay rendering until auth state is stable
  useEffect(() => {
    // Check if localStorage has a user
    const storedUser = localStorage.getItem('user');
    
    // Set a small timeout to allow auth state to stabilize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  console.log('ProtectedRoute - Loading:', isLoading, 'Auth:', isAuthenticated);

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Now we can safely check authentication after loading
  if (!isAuthenticated) {
    return <Navigate to="/user-login" />;
  }

  // Check if user object exists
  if (!user) {
    return <Navigate to="/user-login" />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;