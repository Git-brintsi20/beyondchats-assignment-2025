<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Helper to make clean multi-paragraph content
        $makeContent = function($topic, $isEnhanced) {
            $prefix = $isEnhanced ? "AI-ENHANCED ANALYSIS: " : "";
            
            $p1 = "{$prefix}This article explores the critical aspects of {$topic}. In recent years, we have seen significant shifts in how this technology impacts our daily lives. The industry is evolving rapidly, bringing both new opportunities and challenges for professionals in the field.";
            
            $p2 = "Experts suggest that understanding {$topic} is key to future success. Data shows a 40% increase in adoption rates over the last fiscal year. Innovation drives this growth, pushing boundaries of what was previously thought possible.";
            
            $p3 = "In conclusion, {$topic} remains a vital subject. We must adapt to these changes to stay competitive. Looking ahead, the future is bright for those who invest time in mastering these concepts.";
            
            // Crucial: Double newline for frontend splitting
            return $p1 . "\n\n" . $p2 . "\n\n" . $p3;
        };

        $topics = [
            ['slug' => 'ai-healthcare', 'title' => 'AI in Healthcare', 'image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop'],
            ['slug' => 'future-finance', 'title' => 'The Future of Finance', 'image' => 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop'],
            ['slug' => 'remote-work', 'title' => 'Remote Work Trends', 'image' => 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&auto=format&fit=crop'],
            ['slug' => 'green-energy', 'title' => 'Green Energy Solutions', 'image' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop'],
            ['slug' => 'cyber-security', 'title' => 'Cyber Security Basics', 'image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop']
        ];

        foreach ($topics as $index => $topic) {
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
                    'published_date' => $baseDate->addHour(),
                    'scraped_at' => Carbon::now(),
                    'is_enhanced' => true,
                    'original_article_id' => $original->id,
                    'metadata' => ['readingTime' => 8, 'wordCount' => 800],
                    'enhancement_metadata' => json_encode([
                        'similarity_score' => 0.95,
                        'model' => 'Claude 3.5 Sonnet'
                    ])
                ]
            );
        }
    }
}
