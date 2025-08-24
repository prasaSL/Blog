import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Paper,
  Input, 
  Grid,
  Pagination,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './gallery.css';
import GalleryCard from '../../components/blogGallery/galleryCard';
import api from '../../utils/api';

export default function Gallery() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch posts when component mounts or when page/search changes
  useEffect(() => {
    setPage(1); // Reset to page 1 when search changes
    fetchPosts(1, debouncedSearchTerm);
  }, [debouncedSearchTerm]); // Re-fetch when search changes

  // Handle page changes
  useEffect(() => {
    if (debouncedSearchTerm === searchTerm) { // Only fetch if search term isn't being typed
      fetchPosts(page, debouncedSearchTerm);
    }
  }, [page]);

  const fetchPosts = async (currentPage, search) => {
    try {
      setLoading(true);
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (search) {
        params.append('search', search);
      }
      
      // Make API request
      const response = await api.get(`/posts/posts?${params.toString()}`);
      
      if (response.data.success) {
        setPosts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        console.error('Failed to fetch posts:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
            <Input 
              placeholder="Search..." 
              className='gallery-Search-input'
              value={searchTerm}
              onChange={handleSearchChange}
              // No need for keyPress handler with real-time search
            />
          </Paper>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className='gallery-container'>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {posts.length > 0 ? posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <GalleryCard 
                  post={post} 
                  imageData={post.imageData} 
                />
              </Grid>
            )) : (
              <Box width="100%" textAlign="center" py={4}>
                <Typography>No posts found</Typography>
              </Box>
            )}
          </Grid>
        )}
        
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              variant="outlined" 
              shape="rounded" 
              className='gallery-pagination'
            />
          </Box>
        )}
      </Container>
    </>
  );
}