// middleware/errorHandler.js
import { ErrorResponse } from '../utils/error.js';

export const errorHandler = (err, req, res, next) => {
  // Log chi tiết cho developer với context
  console.error('Error Handler:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  let error = { ...err };
  error.message = err.message;

  // Xử lý ErrorResponse custom - giữ nguyên structure
  if (err instanceof ErrorResponse) {
    const response = {
      success: false,
      message: err.message,
      // Thêm error code dựa trên message
      code: getErrorCode(err.message),
    };

    // Thêm details nếu có (giả sử ErrorResponse đã có field details)
    if (err.details) {
      response.details = err.details;
    }

    // Chỉ thêm stack trace trong development
    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    return res.status(err.statusCode || 500).json(response);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ErrorResponse(message, 401);
  }

  // Response cuối cùng
  const response = {
    success: false,
    message: error.message || 'Server Error',
    code: getErrorCode(error.message),
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

// Helper function để map error message thành error code
function getErrorCode(message) {
  const errorMap = {
    'Email not verified': 'EMAIL_NOT_VERIFIED',
    'Invalid credentials': 'INVALID_CREDENTIALS',
    'Duplicate field value entered': 'DUPLICATE_ENTRY',
    'Resource not found': 'RESOURCE_NOT_FOUND',
    'Invalid token': 'INVALID_TOKEN',
    'Token expired': 'TOKEN_EXPIRED'
  };

  return errorMap[message] || 'INTERNAL_ERROR';
}