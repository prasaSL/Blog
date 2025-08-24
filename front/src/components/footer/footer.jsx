import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Divider
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import './footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box component="footer" className="footer">
      <Container maxWidth={false} disableGutters className="footer-container">
        <div className="footer-content-wrapper">
          <Grid container spacing={4}>
            {/* Logo & Description */}
            <Grid item xs={12} md={4}>
              <Typography variant="h5" component="h2" className="footer-logo">
                My Blog
              </Typography>
              <Typography variant="body2" className="footer-description">
                Sharing thoughts, ideas, and discoveries about web development, 
                technology trends, and programming best practices.
              </Typography>
            </Grid>
            
            {/* Quick Links */}
            <Grid item xs={6} md={2}>
              <Typography variant="h6" component="h3" className="footer-heading">
                Quick Links
              </Typography>
              <List dense disablePadding>
                {['Home', 'About', 'Contact', 'Blog'].map((item) => (
                  <ListItem key={item} disablePadding className="footer-list-item">
                    <ListItemText 
                      primary={
                        <Link 
                          to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                          className="footer-link"
                        >
                          {item}
                        </Link>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            {/* Resources */}
            <Grid item xs={6} md={2}>
              <Typography variant="h6" component="h3" className="footer-heading">
                Resources
              </Typography>
              <List dense disablePadding>
                {['Tutorials', 'Resources', 'FAQ', 'Privacy'].map((item) => (
                  <ListItem key={item} disablePadding className="footer-list-item">
                    <ListItemText 
                      primary={
                        <Link 
                          to={`/${item.toLowerCase()}`}
                          className="footer-link"
                        >
                          {item}
                        </Link>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            {/* Contact */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3" className="footer-heading">
                Contact
              </Typography>
              <Typography variant="body2" className="contact-text">
                Email: contact@myblog.com
              </Typography>
              <Typography variant="body2" className="contact-text">
                Location: New York, NY
              </Typography>
              
              {/* Social Media */}
              <Box className="social-icons">
                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon, GitHubIcon].map((Icon, index) => (
                  <IconButton key={index} className="social-icon">
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>
          
          <Divider className="footer-divider" />
          
          {/* Copyright */}
          <Box className="copyright-container">
            <Typography variant="body2">
              © {currentYear} My Blog. All rights reserved.
            </Typography>
            <Typography variant="body2">
              Designed with ❤️ by You
            </Typography>
          </Box>
        </div>
      </Container>
    </Box>
  );
}