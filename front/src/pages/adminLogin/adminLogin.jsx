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
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './adminLogin.css';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }
    
    console.log('Admin login attempted with:', formData);
    // Add your admin authentication logic here
    
    // For demo, show error (you would replace this with actual auth)
    setError('Invalid administrator credentials');
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
                label="Username"
                variant="outlined"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="admin-input"
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
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
              >
                Secure Login
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