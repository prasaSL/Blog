const errorHandler = (err, req, res, next) => {
  // Log error for developers
  console.error(err.stack);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // Handle Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'A record with that data already exists';
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Cannot delete or update a parent row (foreign key constraint)';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;