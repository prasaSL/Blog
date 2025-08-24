import React from 'react'
import './post.css'
import { Box, Typography, Container ,Card ,CardMedia,CardContent} from '@mui/material';

export default function Post() {
  return (
    <Box className='post-container'>
    
      <Card className='post-card'>
       <Typography variant="h3" component="h2" className='post-title'>
         Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio 
       </Typography>
        <CardMedia
          component="img"
          alt="Post Image"
          height="140"
          image="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
          title="Post Image"
          className='image'
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary" fontSize="1.5rem" className='post-content'>
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, quo quasi recusandae iste dolores inventore facere vitae dicta eveniet quibusdam totam nobis alias facilis fugiat consectetur illo necessitatibus deserunt perferendis!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
