<?php

/**
 * BeyondChats Assignment Project
 * Author: S_Harshit_B
 * Created: December 30, 2025
 * Repository: github.com/Git-brintsi20/beyondchats-assignment-2025
 * License: MIT with Attribution (see LICENSE)
 */

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Article;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use Carbon\Carbon;

class ScrapeArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:articles {--count=5 : Number of articles to scrape}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape articles from BeyondChats blog';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting article scraper...');
        
        $count = (int) $this->option('count');
        $targetUrl = 'https://beyondchats.com/blogs/';
        
        try {
            // Fetch the blog page
            $this->info("Fetching: {$targetUrl}");
            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::timeout(30)->get($targetUrl);
            
            if (!$response->ok()) {
                $this->error('Failed to fetch blog page');
                return 1;
            }

            $crawler = new Crawler($response->body());
            
            // Extract article links and metadata
            $articles = [];
            $crawler->filter('article, .post, .blog-post, [class*="article"]')->each(function (Crawler $node) use (&$articles) {
                try {
                    // Extract title
                    $titleNode = $node->filter('h2, h3, .title, [class*="title"]')->first();
                    $title = $titleNode->count() ? trim($titleNode->text()) : 'No Title';
                    
                    // Extract URL
                    $linkNode = $node->filter('a')->first();
                    $url = $linkNode->count() ? $linkNode->attr('href') : null;
                    
                    // Extract excerpt
                    $excerptNode = $node->filter('p, .excerpt, [class*="excerpt"]')->first();
                    $excerpt = $excerptNode->count() ? trim($excerptNode->text()) : '';
                    
                    // Extract thumbnail
                    $imgNode = $node->filter('img')->first();
                    $thumbnail = $imgNode->count() ? $imgNode->attr('src') : null;
                    
                    // Extract date
                    $dateNode = $node->filter('time, .date, [class*="date"]')->first();
                    $dateStr = $dateNode->count() ? $dateNode->text() : null;
                    
                    if ($url && $title !== 'No Title') {
                        // Make URL absolute if relative
                        if (!str_starts_with($url, 'http')) {
                            $url = 'https://beyondchats.com' . $url;
                        }
                        
                        $articles[] = [
                            'title' => $title,
                            'url' => $url,
                            'excerpt' => substr($excerpt, 0, 500),
                            'thumbnail' => $thumbnail,
                            'date' => $dateStr,
                        ];
                    }
                } catch (\Exception $e) {
                    // Skip problematic nodes
                }
            });
            
            // Take the requested count
            $articles = collect($articles)->take($count)->all();
            
            $this->info("Found " . count($articles) . " articles");
            
            // Save articles to database
            $saved = 0;
            $skipped = 0;
            
            foreach ($articles as $articleData) {
                // Check if article already exists
                $existing = Article::where('url', $articleData['url'])->first();
                
                if ($existing) {
                    $this->warn("Skipped (duplicate): {$articleData['title']}");
                    $skipped++;
                    continue;
                }
                
                // Fetch full article content
                $this->info("Fetching content from: {$articleData['url']}");
                /** @var \Illuminate\Http\Client\Response $articleResponse */
                $articleResponse = Http::timeout(30)
                    ->acceptJson()
                    ->withHeaders(['Accept-Charset' => 'utf-8'])
                    ->get($articleData['url']);
                
                if ($articleResponse->ok()) {
                    $html = $articleResponse->body();
                    
                    // Ensure UTF-8 encoding
                    if (!mb_check_encoding($html, 'UTF-8')) {
                        $html = mb_convert_encoding($html, 'UTF-8', mb_detect_encoding($html));
                    }
                    
                    $articleCrawler = new Crawler($html);
                    
                    // Extract main content - get text from specific content area
                    $contentNode = $articleCrawler->filter('article .content, .post-content, .entry-content, article')->first();
                    
                    // Get all paragraphs and text content
                    $paragraphs = [];
                    $skippedFirstHeading = false;
                    
                    // Prepare title for strict comparison
                    $cleanTitle = strtolower(trim(preg_replace('/[^a-zA-Z0-9]/', '', $articleData['title'])));

                    if ($contentNode->count()) {
                        $contentNode->filter('p, h1, h2, h3, h4, h5, h6')->each(function (Crawler $node) use (&$paragraphs, &$skippedFirstHeading, $articleData, $cleanTitle) {
                            $text = trim($node->text());
                            
                            // ---------------------------------------------------------
                            // FIX: STRICT DUPLICATE TITLE REMOVAL
                            // ---------------------------------------------------------
                            
                            // 1. Create a clean version of the current node text
                            $cleanText = strtolower(trim(preg_replace('/[^a-zA-Z0-9]/', '', $text)));
                            
                            // 2. Check if the text matches the Article Title
                            // We check if they are identical OR if the node text is contained within the title
                            if (!empty($cleanText) && ($cleanText === $cleanTitle || str_contains($cleanTitle, $cleanText))) {
                                return; // Skip this node, it's just the title repeated
                            }

                            // 3. Skip the first h1/h2 as it's usually the article title (Fallback logic)
                            if (!$skippedFirstHeading && ($node->nodeName() === 'h1' || $node->nodeName() === 'h2')) {
                                $skippedFirstHeading = true;
                                return;
                            }
                            
                            // 4. Skip "Table of Contents" headers if they exist
                            if (stripos($text, 'Table of Contents') !== false) {
                                return;
                            }

                            // 5. Add valid text to paragraphs
                            if (!empty($text) && strlen($text) > 10) { 
                                $paragraphs[] = $text;
                            }
                        });
                    }
                    
                    // Join paragraphs with double newlines
                    $content = implode("\n\n", $paragraphs);
                    
                    // Clean up the content
                    $content = html_entity_decode($content, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $content = trim($content);
                    
                    // Parse date
                    $publishedDate = null;
                    if ($articleData['date']) {
                        try {
                            $publishedDate = Carbon::parse($articleData['date']);
                        } catch (\Exception $e) {
                            $publishedDate = now();
                        }
                    } else {
                        $publishedDate = now();
                    }
                    
                    // Calculate reading time
                    $wordCount = str_word_count($content);
                    $readingTime = ceil($wordCount / 200);
                    
                    // Create article
                    $article = Article::create([
                        'title' => $articleData['title'],
                        'url' => $articleData['url'],
                        'content' => $content,
                        'excerpt' => $articleData['excerpt'],
                        'author' => 'BeyondChats',
                        'published_date' => $publishedDate,
                        'thumbnail' => $articleData['thumbnail'],
                        'tags' => ['scraped', 'beyondchats'],
                        'metadata' => [
                            'sourceType' => 'scraped',
                            'wordCount' => $wordCount,
                            'readingTime' => $readingTime,
                            'scrapedFrom' => 'https://beyondchats.com/blogs/',
                        ],
                        'scraped_at' => now(),
                    ]);
                    
                    $this->info("✓ Saved: {$articleData['title']}");
                    $saved++;
                } else {
                    $this->error("Failed to fetch: {$articleData['url']}");
                }
                
                // Rate limiting - be respectful
                sleep(2);
            }
            
            $this->info("\nScraping completed!");
            $this->info("Saved: {$saved} articles");
            $this->info("Skipped: {$skipped} articles");
            
            return 0;
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return 1;
        }
    }
}