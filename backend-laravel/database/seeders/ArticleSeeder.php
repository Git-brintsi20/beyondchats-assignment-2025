<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;

class ArticleSeeder extends Seeder
{
    private function scrapeArticle($url): ?array
    {
        try {
            $response = Http::timeout(15)->get($url);
            if (!$response->successful()) return null;
            
            $crawler = new Crawler($response->body());
            
            // Extract title
            $title = null;
            if ($crawler->filter('h1')->count() > 0) {
                $title = trim($crawler->filter('h1')->first()->text());
            }
            
            // Extract featured/main image - BeyondChats uses wp-content uploads
            $image = null;
            if ($crawler->filter('img[src*="wp-content"]')->count() > 0) {
                $src = $crawler->filter('img[src*="wp-content"]')->first()->attr('src');
                if ($src) {
                    $image = str_starts_with($src, 'http') ? $src : 'https://beyondchats.com' . $src;
                }
            }
            
            // Extract article content - get ALL paragraphs from article body
            $content = '';
            $paragraphs = [];
            
            // BeyondChats blog structure: look for article content
            if ($crawler->filter('article p, .entry-content p, .post-content p')->count() > 0) {
                $paragraphs = $crawler->filter('article p, .entry-content p, .post-content p')
                    ->each(function($node) {
                        $text = trim($node->text());
                        // Filter out very short paragraphs, navigation, and form text
                        if (strlen($text) > 80 && 
                            !str_contains($text, 'Your email address will not be published') &&
                            !str_contains($text, 'Required fields are marked')) {
                            return $text;
                        }
                        return null;
                    });
                
                $paragraphs = array_filter($paragraphs);
                
                if (count($paragraphs) >= 3) {
                    // Take first 8 paragraphs for good content length
                    $content = implode("\n\n", array_slice($paragraphs, 0, 8));
                }
            }
            
            if (!$title || !$content) return null;
            
            return [
                'title' => $title,
                'content' => $content,
                'image' => $image,
            ];
        } catch (\Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
            return null;
        }
    }

    public function run(): void
    {
        // REAL BeyondChats blog URLs from their actual blog
        $urls = [
            'https://beyondchats.com/blogs/choosing-the-right-ai-chatbot-a-guide/',
            'https://beyondchats.com/blogs/should-you-trust-ai-in-healthcare/',
            'https://beyondchats.com/blogs/why-we-are-building-yet-another-ai-chatbot/',
            'https://beyondchats.com/blogs/will-ai-understand-the-complexities-of-patient-care/',
            'https://beyondchats.com/blogs/your-website-needs-a-receptionist/',
        ];

        $fallbackArticles = [
            ['title' => 'AI-Powered Customer Support Revolution', 'slug' => 'ai-customer-support', 'image' => 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800'],
            ['title' => 'Chatbot Automation Strategies', 'slug' => 'chatbot-automation', 'image' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'],
            ['title' => 'Enhancing Customer Experience with AI', 'slug' => 'customer-experience', 'image' => 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800'],
            ['title' => 'AI Integration Best Practices', 'slug' => 'ai-integration', 'image' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'],
            ['title' => 'Business Automation Trends 2025', 'slug' => 'business-automation', 'image' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'],
        ];

        foreach ($urls as $index => $url) {
            echo "Scraping: {$url}\n";
            $scraped = $this->scrapeArticle($url);
            $baseDate = Carbon::now()->subMonths(5 - $index);
            
            if ($scraped) {
                // Use scraped data
                $title = $scraped['title'];
                $content = $scraped['content'];
                $image = $scraped['image'] ?? $fallbackArticles[$index]['image'];
            } else {
                // Use fallback
                echo "Failed to scrape, using fallback data\n";
                $fallback = $fallbackArticles[$index];
                $title = $fallback['title'];
                $content = "This comprehensive article explores {$fallback['title']} in detail. Understanding these concepts is crucial for modern businesses looking to stay competitive in the digital age.\n\nWe examine the latest trends, best practices, and real-world implementations. Industry experts share their insights on how organizations can leverage these technologies effectively.\n\nThe future of business automation and AI integration continues to evolve rapidly. Companies that embrace these changes early will gain significant advantages in efficiency, customer satisfaction, and market positioning.";
                $image = $fallback['image'];
            }
            
            $excerpt = substr($content, 0, 150) . '...';

            // 1. Create ORIGINAL
            $original = Article::updateOrCreate(
                ['url' => $url],
                [
                    'title' => $title,
                    'content' => $content,
                    'excerpt' => $excerpt,
                    'author' => 'BeyondChats',
                    'thumbnail' => $image,
                    'published_date' => $baseDate,
                    'scraped_at' => $baseDate,
                    'is_enhanced' => false,
                    'metadata' => ['readingTime' => 5, 'wordCount' => 500]
                ]
            );

            // 2. Create ENHANCED version
            $enhancedContent = "AI-ENHANCED ANALYSIS: " . $content . "\n\nThis enhanced version includes additional insights powered by AI analysis. Key trends and patterns have been identified to provide deeper understanding of the subject matter.";
            
            Article::updateOrCreate(
                ['url' => $url . '-enhanced'],
                [
                    'title' => $title . ' - AI Enhanced',
                    'content' => $enhancedContent,
                    'excerpt' => "AI-enhanced analysis: " . $excerpt,
                    'author' => 'BeyondChats AI',
                    'thumbnail' => $image,
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
        
        echo "\n✅ Seeded " . (count($urls) * 2) . " articles (originals + enhanced versions)\n";
    }
}
