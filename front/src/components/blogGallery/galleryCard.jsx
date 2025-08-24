import React from 'react';
import './galleryCard.css';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GalleryCard({ post, imageData }) {
  const navigate = useNavigate();

  // Handle missing post data gracefully
  if (!post) {
    return null;
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Create excerpt from content
  const createExcerpt = (content, maxLength = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <Card className='gallery-card' onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" className="gallery-card-title">
          {post.title || 'Untitled Post'}
        </Typography>

        {post.User && (
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
              {post.User.name ? post.User.name.charAt(0) : 'U'}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {post.User.name || 'Unknown'} • {formatDate(post.publishedAt || post.createdAt)}
            </Typography>
          </Box>
        )}
      </CardContent>

      {(imageData || post.imageData) && (
        <CardMedia
          component="img"
          alt={post.title || "Post image"}
          height="180"
          image={
            imageData?.data 
              ? `data:${imageData.contentType || 'image/jpeg'};base64,${imageData.data}`
              : post.imageData?.data 
                ? `data:${post.imageData.contentType || 'image/jpeg'};base64,${post.imageData.data}`
                : "https://via.placeholder.com/300x180?text=No+Image"
          }
        />
      )}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {createExcerpt(post.content) || 'No content available'}
        </Typography>
        
        <Box mt={2} display="flex" justifyContent="space-between">
          <Chip 
            size="small" 
            label={`${post.viewCount || 0} views`} 
            variant="outlined" 
          />
          
          {post.tags && post.tags.length > 0 && (
            <Chip 
              size="small"
              label={post.tags[0]}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}