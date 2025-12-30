/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import BlogScraper from './src/scrapers/blogScraper.js';
import logger from './src/utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function testScraper() {
  try {
    logger.info('Testing Blog Scraper...');
    
    const scraper = new BlogScraper();
    const articles = await scraper.scrapeArticles();
    
    logger.info(`Successfully scraped ${articles.length} articles:`);
    
    articles.forEach((article, index) => {
      console.log(`\n--- Article ${index + 1} ---`);
      console.log(`Title: ${article.title}`);
      console.log(`URL: ${article.url}`);
      console.log(`Excerpt: ${article.excerpt?.substring(0, 100)}...`);
      console.log(`Author: ${article.author || 'N/A'}`);
      console.log(`Published: ${article.publishedDate || 'N/A'}`);
      console.log(`Tags: ${article.tags?.join(', ') || 'N/A'}`);
    });
    
    logger.info('\n✅ Scraper test completed successfully!');
    
  } catch (error) {
    logger.error('Scraper test failed:', error);
    process.exit(1);
  }
}

testScraper();
