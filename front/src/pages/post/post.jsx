import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './post.css';
import { Box, Typography, Container, Card, CardMedia, CardContent, CircularProgress, Alert } from '@mui/material';
import api from '../../utils/api';

export default function Post() {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset states when ID changes
    setLoading(true);
    setError(null);
    setPost(null);
    
    // Fetch post data
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        
        if (response.data.success) {
          setPost(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load post');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]); // Re-fetch when ID changes

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Alert severity="info">Post not found</Alert>
      </Box>
    );
  }

  return (
    <Box className='post-container'>
      <Card className='post-card'>
        <Typography variant="h3" component="h2" className='post-title'>
          {post.title}
        </Typography>
        
        <Box className="post-meta" mb={2}>
          <Typography variant="subtitle1" color="text.secondary">
            By {post.User?.name || 'Unknown'} • {formatDate(post.publishedAt || post.createdAt)}
          </Typography>
        </Box>

        {post.imageData && (
          <CardMedia
            component="img"
            alt={post.title}
            height="400"
            image={`data:${post.imageData.contentType};base64,${post.imageData.data}`}
            title={post.title}
            className='image'
          />
        )}

        <CardContent>
            <Typography 
    variant="body1" 
    className='post-content'
    sx={{
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
      fontSize: "1.5rem",
      color: "text.secondary"
    }}
  >
    {post.content}
  </Typography>
          

        </CardContent>
      </Card>
    </Box>
  );
}