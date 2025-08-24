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
  Divider, 
  IconButton,
  InputAdornment,
  Snackbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import './userLogin.css';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function UserLogin() {
 const { login, showError } = useAuth();

 const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(import.meta.env.VITE_API_URL + '/api/users/login', {
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    }, { withCredentials: true })
    .then(response => {
      console.log('Login successful:', response.data);
      login(response.data.user); 
       navigate('/gallery');
    })
    .catch(error => {
      console.error('Login failed:', error);
      showError('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="login-container">
      <Card className="login-card">
        <CardContent className="login-card-content">
          <Typography variant="h4" className="login-title">
            Welcome Back
          </Typography>
          <Typography variant="body2" className="login-subtitle">
            Enter your credentials to access your account
          </Typography>

          <form onSubmit={handleSubmit} className="login-form">
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input"
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
              className="login-input"
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
              }}
            />

            <div className="login-options">
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="login-button"
            >
              Log In
            </Button>
          </form>

          <Divider className="login-divider">
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Divider>

          <div className="social-login">
            <IconButton className="social-button google">
              <GoogleIcon />
            </IconButton>
            <IconButton className="social-button facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton className="social-button github">
              <GitHubIcon />
            </IconButton>
          </div>

          <Typography variant="body2" className="signup-prompt">
            Don't have an account?{' '}
            <Link to="/register" className="signup-link">
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}