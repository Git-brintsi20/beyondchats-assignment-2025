<?php

/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Custom article endpoints (must be before resource routes)
Route::post('/articles/scrape', [ArticleController::class, 'scrape']);
Route::get('/articles/stats', [ArticleController::class, 'stats']);

// Article CRUD endpoints
Route::apiResource('articles', ArticleController::class);

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'Laravel API is running',
        'timestamp' => now()->toISOString()
    ]);
});
