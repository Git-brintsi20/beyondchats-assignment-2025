/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import axios from 'axios';

class GoogleSearchService {
  constructor(apiKey = process.env.SERP_API_KEY) {
    this.apiKey = apiKey;
    this.searchEngine = 'serpapi'; // Default to SerpAPI
  }

  /**
   * Search Google for a query and return top results
   */
  async search(query, options = {}) {
    const { num = 10, filterBlogs = true } = options;

    try {
      // If no API key, return mock data for demo
      if (!this.apiKey || this.apiKey === 'your_serpapi_key_here') {
        console.log('⚠️  No SerpAPI key found, using mock search results');
        return this.getMockResults(query);
      }

      // SerpAPI search
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          q: query,
          api_key: this.apiKey,
          num,
          engine: 'google'
        },
        timeout: 10000
      });

      const results = response.data.organic_results || [];
      
      // Filter for blog/article URLs if requested
      if (filterBlogs) {
        return this.filterBlogUrls(results.map(r => ({
          title: r.title,
          url: r.link,
          snippet: r.snippet
        })));
      }

      return results.map(r => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet
      }));

    } catch (error) {
      console.error('Google search error:', error.message);
      return this.getMockResults(query);
    }
  }

  /**
   * Filter URLs to only include blog/article pages
   */
  filterBlogUrls(results) {
    // Exclude non-blog domains
    const excludePatterns = [
      'youtube.com',
      'facebook.com',
      'twitter.com',
      'linkedin.com',
      'instagram.com',
      'pinterest.com',
      'reddit.com',
      'quora.com',
      'stackoverflow.com'
    ];

    return results.filter(result => {
      const url = result.url.toLowerCase();
      
      // Exclude social media and video sites
      if (excludePatterns.some(pattern => url.includes(pattern))) {
        return false;
      }

      // Prefer URLs that look like blog posts
      const blogIndicators = [
        '/blog/',
        '/article/',
        '/post/',
        '/news/',
        '/insights/',
        '-guide',
        'tutorial'
      ];

      return blogIndicators.some(indicator => url.includes(indicator)) || 
             url.split('/').length > 4; // Has path segments
    });
  }

  /**
   * Get mock search results for demo mode
   */
  getMockResults(query) {
    console.log(`🔍 Mock search for: "${query}"`);
    
    return [
      {
        title: `Complete Guide to ${query} - Best Practices`,
        url: `https://example-blog.com/guides/${query.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Learn everything about ${query} with our comprehensive guide covering best practices, tips, and real-world examples.`
      },
      {
        title: `${query}: What You Need to Know in 2025`,
        url: `https://tech-insights.com/articles/${query.toLowerCase().replace(/\s+/g, '-')}-2025`,
        snippet: `An in-depth analysis of ${query} and its impact on modern businesses. Industry experts share their insights.`
      }
    ];
  }
}

export default GoogleSearchService;
