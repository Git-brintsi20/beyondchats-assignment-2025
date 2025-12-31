<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Define the 5 oldest/core topics
        $topics = [
            [
                'slug' => 'ai-healthcare',
                'title' => 'AI in Healthcare',
                'excerpt' => 'How AI is changing medicine.',
                'image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop'
            ],
            [
                'slug' => 'future-finance',
                'title' => 'The Future of Finance',
                'excerpt' => 'Blockchain and AI in banking.',
                'image' => 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop'
            ],
            [
                'slug' => 'remote-work',
                'title' => 'Remote Work Trends',
                'excerpt' => 'The shift to working from home.',
                'image' => 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&auto=format&fit=crop'
            ],
            [
                'slug' => 'green-energy',
                'title' => 'Green Energy Solutions',
                'excerpt' => 'Sustainable power for the future.',
                'image' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop'
            ],
            [
                'slug' => 'cyber-security',
                'title' => 'Cyber Security Basics',
                'excerpt' => 'Protecting your digital assets.',
                'image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop'
            ]
        ];

        foreach ($topics as $index => $topic) {
            $baseDate = Carbon::now()->subMonths(5 - $index);

            // 1. Create ORIGINAL Article
            $original = Article::updateOrCreate(
                ['url' => "https://beyondchats.com/blog/{$topic['slug']}"],
                [
                    'title' => $topic['title'],
                    'content' => "This is the original content for {$topic['title']}. It covers the basics of the topic but lacks depth and modern examples. ".str_repeat("Content filler text. ", 20),
                    'excerpt' => $topic['excerpt'],
                    'author' => 'BeyondChats',
                    'thumbnail' => $topic['image'],
                    'published_date' => $baseDate,
                    'scraped_at' => $baseDate,
                    'is_enhanced' => false,
                    'metadata' => ['readingTime' => 5, 'wordCount' => 500]
                ]
            );

            // 2. Create ENHANCED Article (Linked to Original)
            Article::updateOrCreate(
                ['url' => "https://beyondchats.com/blog/{$topic['slug']}-enhanced"],
                [
                    'title' => "{$topic['title']} - Enhanced Guide",
                    'content' => "This is the AI-Enhanced version of {$topic['title']}. It includes advanced statistics, recent case studies, and structured formatting. ".str_repeat("Advanced AI content. ", 30),
                    'excerpt' => "AI-Enhanced: " . $topic['excerpt'],
                    'author' => 'BeyondChats AI',
                    'thumbnail' => $topic['image'],
                    'published_date' => $baseDate->addDay(),
                    'scraped_at' => Carbon::now(),
                    'is_enhanced' => true,
                    'original_article_id' => $original->id,
                    'metadata' => ['readingTime' => 8, 'wordCount' => 800, 'similarity_score' => 95],
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
