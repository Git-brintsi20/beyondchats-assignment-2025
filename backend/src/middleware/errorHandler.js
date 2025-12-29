/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 29, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import logger from '../utils/logger.js';
import { HTTP_STATUS } from '../config/constants.js';

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      error: `Duplicate ${field}`,
      code: 'DUPLICATE_ERROR'
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Invalid ID format',
      code: 'INVALID_ID'
    });
  }

  // Default error
  res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'SERVER_ERROR'
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
};

export { errorHandler, notFoundHandler };
