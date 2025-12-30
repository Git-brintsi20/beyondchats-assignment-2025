/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

class ContentScraper {
  constructor() {
    this.timeout = 30000; // 30 seconds
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Scrape full content from a URL
   */
  async scrapeArticle(url) {
    try {
      console.log(`📄 Scraping: ${url}`);

      // In demo mode, return mock content for example URLs
      if (this.demoMode && url.includes('example-blog.com')) {
        return {
          url,
          title: 'AI in Healthcare: Complete Guide',
          content: `Artificial intelligence is revolutionizing healthcare with unprecedented capabilities. Machine learning algorithms can now analyze medical images with accuracy matching human experts. Natural language processing helps process vast amounts of medical literature. Predictive analytics identifies health risks before symptoms appear. However, AI faces significant challenges in understanding patient care complexities. Empathy, cultural context, and ethical nuances require human judgment. Patient trust and comfort depend on human connection. Healthcare involves emotional intelligence that current AI cannot replicate. The future lies in AI-human collaboration. AI excels at data processing and pattern recognition. Humans provide emotional support, ethical reasoning, and personalized care. This partnership optimizes outcomes while preserving the human touch essential to healing. Healthcare professionals must adapt to AI tools while maintaining their core caring role.`,
          author: 'Healthcare AI Research Team',
          publishDate: '2024-01-15',
          images: [],
          headings: ['Introduction', 'AI Capabilities', 'Challenges', 'The Future'],
          wordCount: 150,
          excerpt: 'Artificial intelligence is revolutionizing healthcare with unprecedented capabilities...',
          scrapedAt: new Date()
        };
      }

      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent
        }
      });

      const $ = cheerio.load(response.data);
      
      // Extract title
      let title = $('h1').first().text().trim() ||
                  $('title').text().trim() ||
                  $('meta[property="og:title"]').attr('content');

      // Extract main content using multiple strategies
      let content = this.extractContent($);

      // Extract metadata
      const author = this.extractAuthor($);
      const publishDate = this.extractPublishDate($);
      const images = this.extractImages($, url);
      const headings = this.extractHeadings($);

      // Calculate word count
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

      // Create excerpt (first 200 characters)
      const excerpt = content.substring(0, 200).trim() + (content.length > 200 ? '...' : '');

      return {
        url,
        title,
        content,
        excerpt,
        wordCount,
        scrapedAt: new Date(),
        metadata: {
          author,
          publishDate,
          images: images.slice(0, 5), // Top 5 images
          headings: headings.slice(0, 10) // Top 10 headings
        }
      };

    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Extract main content using multiple selectors
   */
  extractContent($) {
    const contentSelectors = [
      'article',
      'main',
      '.post-content',
      '.article-content',
      '.entry-content',
      '.content',
      '[role="main"]'
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        // Remove unwanted elements
        element.find('script, style, nav, header, footer, aside, .advertisement, .ad, .social-share').remove();
        
        const text = element.text().trim();
        if (text.length > 300) { // Minimum content length
          return this.cleanText(text);
        }
      }
    }

    // Fallback: get all paragraph text
    let allText = '';
    $('p').each((i, elem) => {
      allText += $(elem).text().trim() + '\n\n';
    });

    return this.cleanText(allText);
  }

  /**
   * Extract author information
   */
  extractAuthor($) {
    const authorSelectors = [
      '.author',
      '.by-author',
      '[rel="author"]',
      '.post-author',
      '[itemprop="author"]',
      'meta[name="author"]'
    ];

    for (const selector of authorSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        const author = selector.startsWith('meta') 
          ? element.attr('content')
          : element.text().trim();
        
        if (author && author.length > 0 && author.length < 100) {
          return author.replace(/^by\s*/i, '').trim();
        }
      }
    }

    return null;
  }

  /**
   * Extract publish date
   */
  extractPublishDate($) {
    const dateSelectors = [
      'time[datetime]',
      '.publish-date',
      '.post-date',
      '[itemprop="datePublished"]',
      'meta[property="article:published_time"]'
    ];

    for (const selector of dateSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        const date = element.attr('datetime') || 
                    element.attr('content') || 
                    element.text().trim();
        if (date) return date;
      }
    }

    return null;
  }

  /**
   * Extract images
   */
  extractImages($, baseUrl) {
    const images = [];
    
    $('img').each((i, elem) => {
      let src = $(elem).attr('src') || $(elem).attr('data-src');
      if (src) {
        // Make absolute URL
        if (src.startsWith('/')) {
          try {
            src = new URL(src, baseUrl).href;
          } catch (e) {
            return;
          }
        }
        if (src.startsWith('http')) {
          images.push(src);
        }
      }
    });

    return images;
  }

  /**
   * Extract headings
   */
  extractHeadings($) {
    const headings = [];
    
    $('h2, h3').each((i, elem) => {
      const heading = $(elem).text().trim();
      if (heading && heading.length > 0 && heading.length < 200) {
        headings.push(heading);
      }
    });

    return headings;
  }

  /**
   * Clean extracted text
   */
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double newline
      .trim();
  }
}

export default ContentScraper;
