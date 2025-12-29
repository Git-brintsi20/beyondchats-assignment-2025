/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 29, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import logger from '../utils/logger.js';
import {
  BEYONDCHATS_BLOG_URL,
  SCRAPER_USER_AGENT,
  DEFAULT_SCRAPER_DELAY,
  MAX_RETRY_ATTEMPTS,
  ARTICLES_TO_SCRAPE
} from '../config/constants.js';

class BlogScraper {
  constructor() {
    this.baseUrl = BEYONDCHATS_BLOG_URL;
    this.delay = parseInt(process.env.SCRAPER_DELAY) || DEFAULT_SCRAPER_DELAY;
    this.maxRetries = parseInt(process.env.SCRAPER_MAX_RETRIES) || MAX_RETRY_ATTEMPTS;
  }

  /**
   * Sleep for specified milliseconds
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry a function with exponential backoff
   */
  async retryWithBackoff(fn, retries = this.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
        logger.warn(`Attempt ${i + 1} failed, retrying in ${waitTime}ms...`);
        await this.sleep(waitTime);
      }
    }
  }

  /**
   * Navigate to the last page of the blog
   */
  async navigateToLastPage(page) {
    try {
      await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.sleep(2000); // Wait for dynamic content
      
      // Look for pagination elements
      const paginationSelectors = [
        '.pagination a:last-child',
        'nav[aria-label*="pagination"] a:last-child',
        '.pagination-list li:last-child a',
        '[data-testid="pagination"] button:last-child'
      ];

      let lastPageUrl = null;
      
      for (const selector of paginationSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            lastPageUrl = await page.evaluate(el => {
              // Find the actual last page number/link
              const links = Array.from(document.querySelectorAll('a[href*="page"]'));
              if (links.length > 0) {
                const pageNumbers = links
                  .map(link => {
                    const match = link.href.match(/page[=/](\d+)/i);
                    return match ? parseInt(match[1]) : 0;
                  })
                  .filter(num => num > 0);
                
                if (pageNumbers.length > 0) {
                  const maxPage = Math.max(...pageNumbers);
                  const lastLink = links.find(link => link.href.includes(`page=${maxPage}`) || link.href.includes(`page/${maxPage}`));
                  return lastLink ? lastLink.href : null;
                }
              }
              return null;
            }, element);
            
            if (lastPageUrl) break;
          }
        } catch (err) {
          continue;
        }
      }

      if (lastPageUrl) {
        logger.info(`Navigating to last page: ${lastPageUrl}`);
        await page.goto(lastPageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await this.sleep(2000);
      } else {
        logger.info('No pagination found, using first page');
      }

      return await page.content();
    } catch (error) {
      logger.error('Error navigating to last page:', error);
      throw error;
    }
  }

  /**
   * Parse article data from HTML
   */
  parseArticles(html) {
    const $ = cheerio.load(html);
    const articles = [];

    // Common article selectors
    const articleSelectors = [
      'article',
      '.blog-card',
      '.article-item',
      '.post-card',
      '[data-article]',
      '.blog-post',
      '.entry'
    ];

    let articleElements = null;
    
    for (const selector of articleSelectors) {
      articleElements = $(selector);
      if (articleElements.length > 0) {
        logger.info(`Found ${articleElements.length} articles using selector: ${selector}`);
        break;
      }
    }

    if (!articleElements || articleElements.length === 0) {
      logger.warn('No articles found with common selectors');
      return articles;
    }

    articleElements.each((index, element) => {
      try {
        const $article = $(element);
        
        // Extract title (try multiple selectors)
        let title = null;
        const titleSelectors = ['h2', 'h3', '.title', '.article-title', '.post-title', 'h1'];
        for (const sel of titleSelectors) {
          title = $article.find(sel).first().text().trim();
          if (title) break;
        }

        // Extract URL
        let url = null;
        const linkSelectors = ['a[href]', '.read-more', '.article-link', '.post-link'];
        for (const sel of linkSelectors) {
          const link = $article.find(sel).first();
          if (link.length) {
            url = link.attr('href');
            if (url) {
              // Make absolute URL
              if (url.startsWith('/')) {
                url = new URL(url, this.baseUrl).href;
              }
              break;
            }
          }
        }

        // Extract excerpt
        let excerpt = null;
        const excerptSelectors = ['p', '.excerpt', '.description', '.summary'];
        for (const sel of excerptSelectors) {
          excerpt = $article.find(sel).first().text().trim();
          if (excerpt && excerpt.length > 20) break;
        }
        if (excerpt && excerpt.length > 500) {
          excerpt = excerpt.substring(0, 500) + '...';
        }

        // Extract author
        let author = null;
        const authorSelectors = ['.author', '.by-author', '[rel="author"]', '.post-author'];
        for (const sel of authorSelectors) {
          author = $article.find(sel).first().text().trim();
          if (author) break;
        }

        // Extract date
        let publishedDate = null;
        const dateSelectors = ['time', '.date', '.publish-date', '.post-date'];
        for (const sel of dateSelectors) {
          const dateEl = $article.find(sel).first();
          publishedDate = dateEl.attr('datetime') || dateEl.text().trim();
          if (publishedDate) break;
        }

        // Extract thumbnail
        let thumbnail = null;
        const imgSelectors = ['img', '.thumbnail', '.featured-image'];
        for (const sel of imgSelectors) {
          const img = $article.find(sel).first();
          if (img.length) {
            thumbnail = img.attr('src') || img.attr('data-src');
            if (thumbnail && thumbnail.startsWith('/')) {
              thumbnail = new URL(thumbnail, this.baseUrl).href;
            }
            if (thumbnail) break;
          }
        }

        // Extract tags
        const tags = [];
        const tagSelectors = ['.tag', '.category', '.label', '[rel="tag"]'];
        for (const sel of tagSelectors) {
          $article.find(sel).each((i, tag) => {
            const tagText = $(tag).text().trim();
            if (tagText && !tags.includes(tagText)) {
              tags.push(tagText);
            }
          });
          if (tags.length > 0) break;
        }

        // Only add if we have required fields
        if (title && url) {
          articles.push({
            title,
            url,
            excerpt: excerpt || undefined,
            author: author || undefined,
            publishedDate: publishedDate || undefined,
            thumbnail: thumbnail || undefined,
            tags: tags.length > 0 ? tags : undefined,
            scrapedAt: new Date()
          });
        }
      } catch (error) {
        logger.error(`Error parsing article at index ${index}:`, error);
      }
    });

    return articles;
  }

  /**
   * Main scraping function - scrapes 5 oldest articles from the last page
   */
  async scrapeArticles() {
    let browser = null;
    
    try {
      logger.info('Starting blog scraper...');
      logger.info(`Target: ${this.baseUrl}`);
      
      if (process.env.DEMO_MODE === 'true') {
        logger.warn('⚠️  Running in DEMO MODE - Limited functionality');
      }

      // Launch browser
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      
      // Set user agent
      await page.setUserAgent(SCRAPER_USER_AGENT);
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to last page and get HTML
      const html = await this.retryWithBackoff(() => this.navigateToLastPage(page));

      // Parse articles
      const allArticles = this.parseArticles(html);
      
      if (allArticles.length === 0) {
        logger.warn('No articles found on the page');
        return [];
      }

      logger.info(`Found ${allArticles.length} total articles`);

      // Take the first 5 articles (oldest on last page)
      const articles = allArticles.slice(0, Math.min(ARTICLES_TO_SCRAPE, allArticles.length));
      
      logger.info(`Returning ${articles.length} oldest articles`);
      
      return articles;

    } catch (error) {
      logger.error('Scraping failed:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

export default BlogScraper;
