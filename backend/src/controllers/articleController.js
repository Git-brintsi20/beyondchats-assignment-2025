/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 29, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import Article from '../models/Article.js';
import BlogScraper from '../scrapers/blogScraper.js';
import logger from '../utils/logger.js';
import { HTTP_STATUS, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../config/constants.js';

// CREATE - Add new article
export const createArticle = async (req, res, next) => {
  try {
    const articleData = req.body;
    
    // Check for duplicate URL
    const existingArticle = await Article.findOne({ url: articleData.url });
    if (existingArticle) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: 'Article with this URL already exists',
        code: 'DUPLICATE_URL'
      });
    }

    const article = new Article(articleData);
    await article.save();

    logger.info(`Article created: ${article.title}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// READ ALL - Get all articles with pagination, search, and filters
export const getAllArticles = async (req, res, next) => {
  try {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      search,
      sort = '-publishedDate',
      sourceType,
      dateFrom,
      dateTo
    } = req.query;

    // Validate and sanitize pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(Math.max(1, parseInt(limit)), MAX_LIMIT);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};

    // Full-text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by source type
    if (sourceType) {
      query['metadata.sourceType'] = sourceType;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.publishedDate = {};
      if (dateFrom) query.publishedDate.$gte = new Date(dateFrom);
      if (dateTo) query.publishedDate.$lte = new Date(dateTo);
    }

    // Execute query with pagination
    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Article.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: articles,
      pagination: {
        total,
        pages: totalPages,
        current: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// READ SINGLE - Get article by ID
export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Article not found',
        code: 'NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE - Update article by ID
export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if URL is being updated and if it conflicts
    if (updates.url) {
      const existingArticle = await Article.findOne({
        url: updates.url,
        _id: { $ne: id }
      });
      
      if (existingArticle) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          error: 'Another article with this URL already exists',
          code: 'DUPLICATE_URL'
        });
      }
    }

    const article = await Article.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Article not found',
        code: 'NOT_FOUND'
      });
    }

    logger.info(`Article updated: ${article.title}`);

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete article by ID
export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Article not found',
        code: 'NOT_FOUND'
      });
    }

    logger.info(`Article deleted: ${article.title}`);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

// SCRAPE - Trigger scraping manually
export const triggerScraping = async (req, res, next) => {
  try {
    logger.info('Manual scraping triggered');

    const scraper = new BlogScraper();
    const scrapedArticles = await scraper.scrapeArticles();

    if (scrapedArticles.length === 0) {
      return res.json({
        success: true,
        message: 'Scraping completed but no articles found',
        data: { created: 0, duplicates: 0 }
      });
    }

    // Insert articles, handling duplicates
    let created = 0;
    let duplicates = 0;

    for (const articleData of scrapedArticles) {
      try {
        const existingArticle = await Article.findOne({ url: articleData.url });
        
        if (!existingArticle) {
          await Article.create(articleData);
          created++;
        } else {
          duplicates++;
        }
      } catch (error) {
        logger.error(`Failed to insert article: ${articleData.title}`, error);
      }
    }

    logger.info(`Scraping complete: ${created} created, ${duplicates} duplicates`);

    res.json({
      success: true,
      message: 'Scraping completed successfully',
      data: {
        created,
        duplicates,
        total: scrapedArticles.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// STATS - Get statistics
export const getStatistics = async (req, res, next) => {
  try {
    const [
      total,
      aiGenerated,
      latest,
      oldest
    ] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ 'metadata.isAIGenerated': true }),
      Article.findOne().sort('-publishedDate').select('title publishedDate'),
      Article.findOne().sort('publishedDate').select('title publishedDate')
    ]);

    res.json({
      success: true,
      data: {
        total,
        aiGenerated,
        original: total - aiGenerated,
        latest: latest || null,
        oldest: oldest || null
      }
    });
  } catch (error) {
    next(error);
  }
};
