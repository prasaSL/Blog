// filepath: d:\web\BLOG\app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
const userRoutes = require('./routes/User.route');
const postRoutes = require('./routes/Post.route');

const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();
// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable CORS
app.use(cors());
app.use(cookieParser());


// Security headers
app.use(helmet());

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true,
  abortOnLimit: true,
}));

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder for uploads and public assets
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes


// API health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;