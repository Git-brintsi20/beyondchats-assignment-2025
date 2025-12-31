<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Helper to make fake paragraphs
        $makeContent = function($topic, $isEnhanced) {
            $prefix = $isEnhanced ? "AI-ENHANCED ANALYSIS: " : "";
            $para1 = "{$prefix}This article explores the critical aspects of {$topic}. In recent years, we have seen significant shifts in how this technology impacts our daily lives. " . str_repeat("The industry is evolving rapidly. ", 4);
            $para2 = "Experts suggest that understanding {$topic} is key to future success. Data shows a 40% increase in adoption rates. " . str_repeat("Innovation drives this growth. ", 4);
            $para3 = "In conclusion, {$topic} remains a vital subject. We must adapt to these changes to stay competitive. " . str_repeat("Looking ahead, the future is bright. ", 3);
            return $para1 . "\n\n" . $para2 . "\n\n" . $para3;
        };

        $topics = [
            ['slug' => 'ai-healthcare', 'title' => 'AI in Healthcare', 'image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop'],
            ['slug' => 'future-finance', 'title' => 'The Future of Finance', 'image' => 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop'],
            ['slug' => 'remote-work', 'title' => 'Remote Work Trends', 'image' => 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&auto=format&fit=crop'],
            ['slug' => 'green-energy', 'title' => 'Green Energy Solutions', 'image' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop'],
            ['slug' => 'cyber-security', 'title' => 'Cyber Security Basics', 'image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop']
        ];

        foreach ($topics as $index => $topic) {
            // Dates: 5 months ago, 4 months ago...
            $baseDate = Carbon::now()->subMonths(5 - $index);

            // 1. Create ORIGINAL
            $original = Article::updateOrCreate(
                ['url' => "https://beyondchats.com/blog/{$topic['slug']}"],
                [
                    'title' => $topic['title'],
                    'content' => $makeContent($topic['title'], false),
                    'excerpt' => "An introduction to {$topic['title']} and its core concepts.",
                    'author' => 'BeyondChats',
                    'thumbnail' => $topic['image'],
                    'published_date' => $baseDate,
                    'scraped_at' => $baseDate,
                    'is_enhanced' => false,
                    'metadata' => ['readingTime' => 5, 'wordCount' => 500]
                ]
            );

            // 2. Create ENHANCED
            Article::updateOrCreate(
                ['url' => "https://beyondchats.com/blog/{$topic['slug']}-enhanced"],
                [
                    'title' => "{$topic['title']} - Enhanced Guide",
                    'content' => $makeContent($topic['title'], true),
                    'excerpt' => "AI-Enhanced deep dive into {$topic['title']} with statistics.",
                    'author' => 'BeyondChats AI',
                    'thumbnail' => $topic['image'],
                    'published_date' => $baseDate->addHour(), // 1 hour after original
                    'scraped_at' => Carbon::now(),
                    'is_enhanced' => true,
                    'original_article_id' => $original->id,
                    'metadata' => ['readingTime' => 8, 'wordCount' => 800],
                    'enhancement_metadata' => json_encode([
                        'similarity_score' => 95,
                        'model' => 'Claude 3.5 Sonnet',
                        'references' => [
                            ['title' => 'Reference 1', 'url' => 'https://google.com'],
                            ['title' => 'Reference 2', 'url' => 'https://wikipedia.org']
                        ]
                    ])
                ]
            );
        }
    }
}
