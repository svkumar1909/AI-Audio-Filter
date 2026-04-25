// Custom error class for API errors
export class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Determine error status code
  const statusCode = err.statusCode || 500;
  
  // Prepare error response
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  };
  
  // Add error details in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = err.details || null;
  }
  
  // Log specific errors for monitoring
  if (statusCode === 500) {
    // Could integrate with a monitoring service here
    console.error('SERVER ERROR:', err);
  }
  
  return res.status(statusCode).json(errorResponse);
};