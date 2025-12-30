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
  id: number;  // Changed from _id to id for Laravel
  title: string;
  url: string;
  content: string;
  excerpt: string;
  author?: string;
  published_date?: string;  // Laravel snake_case
  thumbnail?: string;
  tags?: string[];
  scraped_at?: string;  // Laravel snake_case
  created_at?: string;
  updated_at?: string;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    lastAnalyzed?: Date;
    similarityScore?: number;
    isAIGenerated?: boolean;
    sourceType?: 'original' | 'enhanced' | 'competitor' | 'scraped';
    keywords?: string[];
    references?: Array<{ title: string; url: string }>;
  };
  relatedArticles?: Array<{
    id: string;
    title: string;
    excerpt: string;
    tags: string[];
  }>;
}

export interface ArticleListResponse {
  articles: Article[];
  pagination?: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
  total?: number;
  pages?: number;
  currentPage?: number;
  limit?: number;
}

// Backend API response wrapper
interface BackendResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
  message?: string;
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

// API Client Configuration - Laravel Backend ONLY
const API_BASE_URL = 'http://localhost:8000/api';

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
    const response = await apiClient.get<BackendResponse<Article[]>>('/articles', { params });
    
    // Transform backend response to frontend format
    return {
      articles: response.data.data || [],
      total: response.data.pagination?.total || 0,
      pages: response.data.pagination?.pages || 0,
      currentPage: response.data.pagination?.current || 1,
      limit: response.data.pagination?.limit || 10
    };
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get a single article by ID
 */
export async function getArticleById(id: string): Promise<Article> {
  try {
    const response = await apiClient.get<BackendResponse<Article>>(`/articles/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create a new article
 */
export async function createArticle(article: Partial<Article>): Promise<Article> {
  try {
    const response = await apiClient.post<BackendResponse<Article>>('/articles', article);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update an existing article
 */
export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
  try {
    const response = await apiClient.put<BackendResponse<Article>>(`/articles/${id}`, updates);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete an article
 */
export async function deleteArticle(id: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.delete<BackendResponse<null>>(`/articles/${id}`);
    return { message: response.data.message || 'Article deleted successfully' };
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Trigger web scraping
 */
export async function triggerScraping(): Promise<ScrapeResponse> {
  try {
    const response = await apiClient.post<BackendResponse<ScrapeResponse>>('/articles/scrape');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get statistics
 */
export async function getStats(): Promise<StatsResponse> {
  try {
    const response = await apiClient.get<BackendResponse<StatsResponse>>('/articles/stats');
    return response.data.data;
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
    const response = await apiClient.get<BackendResponse<Article[]>>('/articles', {
      params: {
        search: query,
        ...filters,
      },
    });
    
    // Transform backend response to frontend format
    return {
      articles: response.data.data || [],
      total: response.data.pagination?.total || 0,
      pages: response.data.pagination?.pages || 0,
      currentPage: response.data.pagination?.current || 1,
      limit: response.data.pagination?.limit || 10
    };
  } catch (error) {
    throw handleApiError(error);
  }
}

// Export API client for custom requests
export { apiClient };
