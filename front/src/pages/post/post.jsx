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
          <Typography variant="body2" color="text.secondary" fontSize="1.5rem" className='post-content'>
            {post.content}
          </Typography>
          
          {post.tags && post.tags.length > 0 && (
            <Box mt={4}>
              <Typography variant="subtitle2">Tags:</Typography>
              <Box display="flex" gap={1} mt={1}>
                {post.tags.map((tag, index) => (
                  <Typography key={index} variant="body2" className="post-tag">
                    #{tag}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}