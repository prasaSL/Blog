import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';


// Create the context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false
  });



  // Notification states
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' // 'success', 'error', 'warning', 'info'
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true
        });
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
        localStorage.removeItem('user');
        showError('Failed to restore session');
      }
    }
  }, []);

  // Show success notification
  const showSuccess = (message) => {
    setNotification({
      open: true,
      message,
      severity: 'success'
    });
  };

  // Show error notification
  const showError = (message) => {
    setNotification({
      open: true,
      message,
      severity: 'error'
    });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Login function - store user data
  const login = (userData) => {
    try {
      console.log('Logging in user:', userData);
      
      if (!userData || !userData.id || !userData.email) {
        showError('Invalid user data received');
        return null;
      }

      // Extract only needed user information
      const userInfo = {
        id: userData.id,
        name: userData.name || '',
        email: userData.email,
        role: userData.role
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // Update state
      setAuthState({
        user: userInfo,
        isAuthenticated: true
      });
      
      showSuccess('Successfully logged in');
      return userInfo; // Return user info for immediate use
    } catch (error) {
      console.error('Login error:', error);
      showError('Login failed: ' + (error.message || 'Unknown error'));
      return null;
    }
  };

  // Logout function - clear storage
  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
      
      // Reset state
      setAuthState({
        user: null,
        isAuthenticated: false
      });
      window.location.href = '/user-login';
      // showSuccess('Successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      showError('Logout failed: ' + (error.message || 'Unknown error'));
    }
  };

  // Get user properties
  const getName = () => authState.user?.name || '';
  const getEmail = () => authState.user?.email || '';
  const getRole = () => authState.user?.role || '';
  const getUserDetails = () => authState.user || {};

  // Context value object
  const contextValue = {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    
    // User details getters
    getName,
    getEmail,
    getRole,
    getUserDetails,
    
    // Actions
    login,
    logout,
    
    // Notification helpers
    showSuccess,
    showError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Default export for convenience
export default AuthProvider;