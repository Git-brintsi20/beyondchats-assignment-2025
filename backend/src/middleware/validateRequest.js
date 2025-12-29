/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 29, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import { body, param, query, validationResult } from 'express-validator';
import { HTTP_STATUS } from '../config/constants.js';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Validation rules for creating article
export const validateCreateArticle = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required')
    .isURL().withMessage('Invalid URL format'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Excerpt cannot exceed 1000 characters'),
  
  body('author')
    .optional()
    .trim(),
  
  body('publishedDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  body('thumbnail')
    .optional()
    .trim()
    .isURL().withMessage('Invalid thumbnail URL'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  validate
];

// Validation rules for updating article
export const validateUpdateArticle = [
  param('id')
    .isMongoId().withMessage('Invalid article ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  
  body('url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid URL format'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Excerpt cannot exceed 1000 characters'),
  
  validate
];

// Validation rules for getting article by ID
export const validateArticleId = [
  param('id')
    .isMongoId().withMessage('Invalid article ID'),
  
  validate
];

// Validation rules for query parameters
export const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isString(),
  
  query('search')
    .optional()
    .trim(),
  
  query('sourceType')
    .optional()
    .isIn(['original', 'competitive-analysis', 'enhanced']).withMessage('Invalid source type'),
  
  query('dateFrom')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  query('dateTo')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  validate
];
