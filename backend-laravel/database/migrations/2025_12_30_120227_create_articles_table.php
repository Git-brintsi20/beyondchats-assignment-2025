<?php

/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title')->index();
            $table->string('url')->unique();
            $table->text('content')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('author')->nullable();
            $table->timestamp('published_date')->nullable()->index();
            $table->string('thumbnail')->nullable();
            $table->json('tags')->nullable();
            $table->json('metadata')->nullable(); // Stores wordCount, readingTime, similarityScore, etc.
            $table->timestamp('scraped_at')->useCurrent();
            $table->timestamps();
            
            // Full-text search is not supported by SQLite
            // MySQL/PostgreSQL would use: $table->fullText(['title', 'content']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
