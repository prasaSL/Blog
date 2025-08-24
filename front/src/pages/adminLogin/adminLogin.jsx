import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  IconButton,
  InputAdornment,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './adminLogin.css';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      
      // Make API request to admin login endpoint with email instead of username
      const response = await api.post('/users/admin/login', {
        email: formData.email,
        password: formData.password
      });
      
      if (response.status === 200) {
        // Store user data in context
        login(response.data.user);
  
        
        // Navigate to admin panel
        navigate('/admin-panel');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      
      if (err.response) {
        // Handle different status codes
        switch (err.response.status) {
          case 401:
            setError('Invalid email or password');
            break;
          case 403:
            setError('Your account doesn\'t have admin privileges');
            break;
          default:
            setError(err.response.data?.message || 'An error occurred during login');
        }
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="admin-login-container">
      <Box className="back-link-container">
        <Link to="/" className="back-link">
          <ArrowBackIcon fontSize="small" /> Return to main site
        </Link>
      </Box>
      
      <Paper elevation={4} className="admin-login-paper">
        <Box className="admin-header">
          <AdminPanelSettingsIcon className="admin-icon" />
          <Typography variant="h4" className="admin-title">
            Administrator Login
          </Typography>
        </Box>
        
        <Card className="admin-login-card">
          <CardContent className="admin-login-card-content">
            <Typography variant="body2" className="admin-login-subtitle">
              Please enter your admin credentials to continue
            </Typography>

            {error && (
              <Alert severity="error" className="admin-error-alert">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="admin-login-form">
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="admin-input"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon className="admin-email-icon" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                className="admin-input"
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="admin-lock-icon" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Remember this device"
                className="admin-remember"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="admin-login-button"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Secure Login'
                )}
              </Button>
            </form>

            <Typography variant="body2" className="admin-help-text">
              If you're having trouble accessing your admin account,
              please contact the system administrator
            </Typography>
          </CardContent>
        </Card>
        
        <Box className="admin-footer">
          <Typography variant="body2" color="textSecondary">
            Protected area - Unauthorized access is prohibited
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}