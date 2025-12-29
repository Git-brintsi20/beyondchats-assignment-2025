/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 29, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

// Application constants
export const APP_NAME = 'BeyondChats Article Scraper';
export const APP_VERSION = '1.0.0';
export const API_PREFIX = '/api';

// Scraper constants
export const BEYONDCHATS_BLOG_URL = 'https://beyondchats.com/blogs/';
export const SCRAPER_USER_AGENT = 'BeyondChats Assignment Bot/1.0 (Demo)';
export const DEFAULT_SCRAPER_DELAY = 2000; // milliseconds
export const MAX_RETRY_ATTEMPTS = 3;
export const ARTICLES_TO_SCRAPE = 5;

// Pagination constants
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
export const ERRORS = {
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  DUPLICATE_URL: 'Article with this URL already exists',
  SCRAPER_FAILED: 'Failed to scrape articles',
  DATABASE_ERROR: 'Database operation failed'
};
