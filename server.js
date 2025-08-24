const app = require('./app');
const { sequelize } = require('./config/database');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5000;

// Sync database
const syncDatabase = async () => {
  try {
    
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synced');
    
    const server = app.listen(
      PORT, 
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    );
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

// Initialize database and start server
syncDatabase();