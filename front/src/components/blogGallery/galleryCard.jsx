import React from 'react'
import './galleryCard.css'
import { Card, CardMedia, CardContent, Typography, CardHeader } from '@mui/material';

export default function GalleryCard() {
  return (
    <Card className='gallery-card'>
       <Typography gutterBottom variant="h4" component="div">
          Lizard
        </Typography>
      <CardMedia
        component="img"
        alt="Gallery Image"
        height="140"
        image="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
      />
      <CardContent>
        
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000 species
          found on every continent except Antarctica
        </Typography>
      </CardContent>
    </Card>
  )
}
