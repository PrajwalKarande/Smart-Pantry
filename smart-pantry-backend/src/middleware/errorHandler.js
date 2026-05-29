/**
 * Global error handling middleware.
 * Catches all errors thrown in routes/services and sends a clean JSON response.
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const fieldErrors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'Input validation failed',
      fieldErrors,
    });
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      status: 409,
      error: 'Conflict',
      message: 'A record with this value already exists',
    });
  }

  // Custom status errors (e.g., 404 Not Found)
  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(status).json({
    status,
    error: status === 404 ? 'Not Found'
         : status === 400 ? 'Bad Request'
         : status === 503 ? 'Service Unavailable'
         : 'Internal Server Error',
    message,
    timestamp: new Date().toISOString(),
  });
}

module.exports = errorHandler;