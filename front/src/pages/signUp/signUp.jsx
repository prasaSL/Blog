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
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import './signUp.css';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value
    });
    
    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword || formData.confirmPassword === '');
      } else {
        setPasswordMatch(value === formData.password);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    console.log('Sign up attempted with:', formData);
    // Add your registration logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container className="signup-container">
      <Card className="signup-card">
        <CardContent className="signup-card-content">
          <Typography variant="h4" className="signup-title">
            Create an Account
          </Typography>
          <Typography variant="body2" className="signup-subtitle">
            Join our community and start sharing your content
          </Typography>

          <form onSubmit={handleSubmit} className="signup-form">
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="signup-input"
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
              className="signup-input"
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
            
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="signup-input"
              error={!passwordMatch}
              helperText={!passwordMatch ? "Passwords don't match" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  color="primary"
                  required
                />
              }
              label={
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="terms-link">
                    Privacy Policy
                  </Link>
                </span>
              }
              className="terms-checkbox"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="signup-button"
              disabled={!passwordMatch || !formData.agreeTerms}
            >
              Sign Up
            </Button>
          </form>

          <Divider className="signup-divider">
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Divider>

          <div className="social-signup">
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

          <Typography variant="body2" className="login-prompt">
            Already have an account?{' '}
            <Link to="/user-login" className="login-link">
              Log in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}