/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

import axios from 'axios';

class DatabaseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || process.env.BACKEND_API_URL || 'http://localhost:8000/api';
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BeyondChats-Automation/1.0'
      }
    });
  }

  async getAllArticles(params = {}) {
    try {
      const response = await this.api.get('/articles', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching articles:', error.message);
      throw error;
    }
  }

  async getArticleById(id) {
    try {
      const response = await this.api.get(`/articles/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching article ${id}:`, error.message);
      throw error;
    }
  }

  async updateArticle(id, data) {
    try {
      const response = await this.api.put(`/articles/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating article ${id}:`, error.message);
      throw error;
    }
  }

  async createArticle(data) {
    try {
      const response = await this.api.post('/articles', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating article:', error.message);
      throw error;
    }
  }

  async searchArticles(query) {
    try {
      const response = await this.api.get('/articles', {
        params: { search: query }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching articles:', error.message);
      throw error;
    }
  }

  async getStatistics() {
    try {
      const response = await this.api.get('/articles/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching statistics:', error.message);
      throw error;
    }
  }
}

export default DatabaseService;
