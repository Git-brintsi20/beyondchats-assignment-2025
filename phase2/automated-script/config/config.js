/**
 * BeyondChats Assignment Project
 * Phase 2: Configuration
 * Author: Salugu Harshita Bhanu
 * License: MIT with Attribution
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // API Keys
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  serpApiKey: process.env.SERP_API_KEY || '',
  
  // Backend API
  backendApiUrl: process.env.BACKEND_API_URL || 'http://localhost:8000/api',
  
  // Mode Configuration
  demoMode: process.env.DEMO_MODE === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Rate Limiting
  rateLimitDelay: parseInt(process.env.RATE_LIMIT_DELAY) || 2000,
  maxBatchSize: parseInt(process.env.MAX_BATCH_SIZE) || 5,
  
  // Claude AI Configuration
  claudeModel: 'claude-sonnet-4-20250514',
  claudeMaxTokens: 4000,
  claudeTemperature: 0.7,
  
  // Google Search Configuration
  searchResultsLimit: 10,
  competitorArticlesCount: 2,
  
  // Content Scraping
  scrapingTimeout: 30000, // 30 seconds
  userAgent: 'BeyondChats-Assignment-Bot/1.0 (Educational Demo)',
  
  // Validation
  validate() {
    const errors = [];
    
    if (!this.anthropicApiKey) {
      errors.push('ANTHROPIC_API_KEY is required');
    }
    
    if (!this.backendApiUrl) {
      errors.push('BACKEND_API_URL is required');
    }
    
    if (errors.length > 0) {
      throw new Error(`Configuration errors:\n${errors.join('\n')}`);
    }
    
    return true;
  }
};

export default config;
