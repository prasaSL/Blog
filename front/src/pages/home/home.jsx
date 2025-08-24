import React from 'react'
import { Box, Paper, Typography, Button, Divider } from '@mui/material'
import './home.css'

export default function Home() {
  return (
    <Box className="home-container">
      <Paper elevation={3} className='main-paper'>
        <Typography variant="h4" component="h1" className="paper-title">
          Welcome to My Blog
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" className="paper-subtitle">
          Insights and perspectives on web development and technology
        </Typography>
        
        <Divider className="paper-divider" />
        
        <Typography variant="body1" paragraph className="paper-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. 
          Cras porttitor metus justo, vitae fringilla nibh mattis id. Sed vel blandit massa, vel tincidunt erat. 
          Proin suscipit, ligula ut rhoncus ultrices, ipsum dui laoreet est, non efficitur nisi tellus at diam.
        </Typography>
        
        <Typography variant="body1" paragraph className="paper-content">
          Fusce non hendrerit ante. Curabitur in libero neque. Donec at tristique nisi. Etiam vel diam viverra, 
          pulvinar nulla in, imperdiet nisl. Vestibulum interdum nisl id nulla sollicitudin feugiat.
          Cras ac placerat magna, at volutpat eros.
        </Typography>
        
        <Box className="paper-actions">
          <Button variant="contained" color="primary">
            Read More
          </Button>
          <Button variant="outlined" color="secondary" sx={{ ml: 2 }}>
            Subscribe
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}