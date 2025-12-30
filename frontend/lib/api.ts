/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import axios, { AxiosInstance } from 'axios';

// Types
export interface Article {
  _id: string;
  title: string;
  url: string;
  content: string;
  excerpt: string;
  author?: string;
  publishedDate?: string;
  thumbnail?: string;
  tags?: string[];
  scrapedAt: Date;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    lastAnalyzed?: Date;
    similarityScore?: number;
    isAIGenerated?: boolean;
    sourceType?: 'original' | 'enhanced' | 'competitor';
    keywords?: string[];
    references?: Array<{ title: string; url: string }>;
  };
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

export interface StatsResponse {
  total: number;
  original: number;
  enhanced: number;
  analyzed: number;
  dateRange: {
    oldest: string;
    newest: string;
  };
}

export interface ScrapeResponse {
  created: number;
  duplicates: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

// API Client Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    return {
      message: 'No response from server. Please check your connection.',
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
};

// API Methods

/**
 * Get all articles with optional filters and pagination
 */
export async function getAllArticles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isAIGenerated?: boolean;
  sortBy?: string;
}): Promise<ArticleListResponse> {
  try {
    const response = await apiClient.get<ArticleListResponse>('/articles', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get a single article by ID
 */
export async function getArticleById(id: string): Promise<Article> {
  try {
    const response = await apiClient.get<Article>(`/articles/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create a new article
 */
export async function createArticle(article: Partial<Article>): Promise<Article> {
  try {
    const response = await apiClient.post<Article>('/articles', article);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update an existing article
 */
export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
  try {
    const response = await apiClient.put<Article>(`/articles/${id}`, updates);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete an article
 */
export async function deleteArticle(id: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.delete<{ message: string }>(`/articles/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Trigger web scraping
 */
export async function triggerScraping(): Promise<ScrapeResponse> {
  try {
    const response = await apiClient.post<ScrapeResponse>('/articles/scrape');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get statistics
 */
export async function getStats(): Promise<StatsResponse> {
  try {
    const response = await apiClient.get<StatsResponse>('/articles/stats');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Search articles
 */
export async function searchArticles(query: string, filters?: {
  isAIGenerated?: boolean;
  page?: number;
  limit?: number;
}): Promise<ArticleListResponse> {
  try {
    const response = await apiClient.get<ArticleListResponse>('/articles', {
      params: {
        search: query,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Export API client for custom requests
export { apiClient };
