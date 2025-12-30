<?php

/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Article extends Model
{
    protected $fillable = [
        'title',
        'url',
        'content',
        'excerpt',
        'author',
        'published_date',
        'thumbnail',
        'tags',
        'metadata',
        'scraped_at'
    ];

    protected $casts = [
        'tags' => 'array',
        'metadata' => 'array',
        'published_date' => 'datetime',
        'scraped_at' => 'datetime',
    ];

    /**
     * Get formatted publication date
     */
    protected function formattedDate(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->published_date ? $this->published_date->format('F d, Y') : 'N/A',
        );
    }

    /**
     * Get short excerpt (first 100 characters)
     */
    protected function shortExcerpt(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->excerpt ? substr($this->excerpt, 0, 100) . '...' : '',
        );
    }

    /**
     * Calculate reading time based on word count
     */
    public function calculateReadingTime(): int
    {
        if (!$this->content) {
            return 0;
        }
        $wordCount = str_word_count(strip_tags($this->content));
        return ceil($wordCount / 200); // Average reading speed: 200 words/minute
    }

    /**
     * Add a reference to the metadata
     */
    public function addReference(string $title, string $url): void
    {
        $metadata = $this->metadata ?? [];
        $metadata['references'] = $metadata['references'] ?? [];
        $metadata['references'][] = [
            'title' => $title,
            'url' => $url
        ];
        $this->metadata = $metadata;
        $this->save();
    }

    /**
     * Scope for search (LIKE-based for SQLite compatibility)
     */
    public function scopeSearch($query, $term)
    {
        if ($term) {
            return $query->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                  ->orWhere('content', 'like', "%{$term}%")
                  ->orWhere('excerpt', 'like', "%{$term}%");
            });
        }
        return $query;
    }

    /**
     * Scope for filtering by source type
     */
    public function scopeSourceType($query, $type)
    {
        if ($type && $type !== 'all') {
            return $query->whereJsonContains('metadata->sourceType', $type);
        }
        return $query;
    }
}
