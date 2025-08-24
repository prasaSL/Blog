import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Paper,
  Input, 
  Grid,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './gallery.css';
import GalleryCard from '../../components/blogGallery/galleryCard';

export default function Gallery() {
  return (
    <>
      <AppBar 
        position="static" 
        className="gallery-app-bar"
        sx={{ 
          backgroundColor: '#FAFAF9 !important',
          boxShadow: 1,
          color: 'var(--text-color)'
        }}
      >
        <Toolbar className='gallery-toolbar'>
          <Typography variant="h6">Gallery</Typography>
          <Paper elevation={3} className='gallery-Search-bar'>
            <SearchIcon className='gallery-Search-icon' />
            <Input placeholder="Search..." className='gallery-Search-input'/>
          </Paper>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className='gallery-container'>
        <Grid container spacing={3}>
          {Array(6).fill().map((_, index) => (
            <Grid size={{ xs: 6, md: 4 ,sm:12}} key={index}>
              <GalleryCard />
            </Grid>
          ))}
        </Grid>
        <Pagination count={10} variant="outlined" shape="rounded" className='gallery-pagination'/>
      </Container>
    </>
  );
}