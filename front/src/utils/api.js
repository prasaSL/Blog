import axios from 'axios';

// Create instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If the error is due to an unauthorized request (401)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access detected. Logging out...');
      
      // Clear user data from localStorage (logout)
      localStorage.removeItem('user');
      
      // You could also dispatch an event to notify the app
      const logoutEvent = new CustomEvent('user-logout');
      window.dispatchEvent(logoutEvent);
      
      // Redirect to login page
      window.location.href = '/user-login';
      
      // Return a rejected promise to stop further processing
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default api;