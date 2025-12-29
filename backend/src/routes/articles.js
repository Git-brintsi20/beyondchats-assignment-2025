/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 29, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import * as articleController from '../controllers/articleController.js';
import {
  validateCreateArticle,
  validateUpdateArticle,
  validateArticleId,
  validateQueryParams
} from '../middleware/validateRequest.js';

const router = express.Router();

// Rate limiter for scraping endpoint (more restrictive)
const scrapeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 scraping requests per hour
  message: 'Too many scraping requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/articles/stats - Get statistics
router.get('/stats', articleController.getStatistics);

// POST /api/articles/scrape - Trigger scraping
router.post('/scrape', scrapeLimiter, articleController.triggerScraping);

// POST /api/articles - Create new article
router.post('/', validateCreateArticle, articleController.createArticle);

// GET /api/articles - Get all articles (with pagination, search, filters)
router.get('/', validateQueryParams, articleController.getAllArticles);

// GET /api/articles/:id - Get single article
router.get('/:id', validateArticleId, articleController.getArticleById);

// PUT /api/articles/:id - Update article
router.put('/:id', validateUpdateArticle, articleController.updateArticle);

// DELETE /api/articles/:id - Delete article
router.delete('/:id', validateArticleId, articleController.deleteArticle);

export default router;
