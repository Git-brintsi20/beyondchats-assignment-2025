<?php

/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Artisan;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles with pagination, search, and filters.
     * GET /api/articles
     */
    public function index(Request $request)
    {
        try {
            $page = $request->query('page', 1);
            $limit = min($request->query('limit', 10), 100);
            $search = $request->query('search');
            $sortBy = $request->query('sortBy', '-published_date');
            $sourceType = $request->query('source', 'all');

            $query = Article::query();

            if ($search) {
                $query->search($search);
            }

            $query->sourceType($sourceType);

            $sortDirection = str_starts_with($sortBy, '-') ? 'desc' : 'asc';
            $sortField = ltrim($sortBy, '-');
            $query->orderBy($sortField, $sortDirection);

            $articles = $query->paginate($limit, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $articles->items(),
                'pagination' => [
                    'total' => $articles->total(),
                    'pages' => $articles->lastPage(),
                    'current' => $articles->currentPage(),
                    'limit' => $articles->perPage()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch articles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created article.
     * POST /api/articles
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|min:5',
                'url' => 'required|url|unique:articles,url',
                'content' => 'nullable|string',
                'excerpt' => 'nullable|string|max:500',
                'author' => 'nullable|string',
                'published_date' => 'nullable|date',
                'thumbnail' => 'nullable|url',
                'tags' => 'nullable|array',
                'metadata' => 'nullable|array',
                'scraped_at' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $article = Article::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Article created successfully',
                'data' => $article
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified article.
     * GET /api/articles/{id}
     */
    public function show($id)
    {
        try {
            $article = Article::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $article
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified article.
     * PUT /api/articles/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $article = Article::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|min:5',
                'url' => 'sometimes|url|unique:articles,url,' . $id,
                'content' => 'nullable|string',
                'excerpt' => 'nullable|string|max:500',
                'author' => 'nullable|string',
                'published_date' => 'nullable|date',
                'thumbnail' => 'nullable|url',
                'tags' => 'nullable|array',
                'metadata' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $article->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Article updated successfully',
                'data' => $article
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified article.
     * DELETE /api/articles/{id}
     */
    public function destroy($id)
    {
        try {
            $article = Article::findOrFail($id);
            $article->delete();

            return response()->json([
                'success' => true,
                'message' => 'Article deleted successfully'
            ], 204);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Trigger web scraper manually.
     * POST /api/articles/scrape
     */
    public function scrape()
    {
        try {
            Artisan::call('scrape:articles');
            $output = Artisan::output();

            return response()->json([
                'success' => true,
                'message' => 'Scraping completed',
                'output' => $output
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Scraping failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get article statistics.
     * GET /api/articles/stats
     */
    public function stats()
    {
        try {
            $totalArticles = Article::count();
            $latestArticle = Article::latest('published_date')->first();
            $oldestArticle = Article::oldest('published_date')->first();
            $enhancedCount = Article::whereJsonContains('metadata->isAIGenerated', true)->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $totalArticles,
                    'enhanced' => $enhancedCount,
                    'original' => $totalArticles - $enhancedCount,
                    'latest' => $latestArticle ? [
                        'title' => $latestArticle->title,
                        'date' => $latestArticle->published_date
                    ] : null,
                    'oldest' => $oldestArticle ? [
                        'title' => $oldestArticle->title,
                        'date' => $oldestArticle->published_date
                    ] : null
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
