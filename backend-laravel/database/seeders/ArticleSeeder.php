<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Introduction to AI and Machine Learning',
                'content' => 'Artificial Intelligence (AI) and Machine Learning (ML) are transforming industries worldwide...',
                'link' => 'https://beyondchats.com/blog/ai-introduction',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            [
                'title' => 'The Future of Cloud Computing',
                'content' => 'Cloud computing continues to evolve with new technologies and services...',
                'link' => 'https://beyondchats.com/blog/cloud-future',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            [
                'title' => 'Web Development Best Practices 2025',
                'content' => 'Modern web development requires understanding of multiple frameworks and tools...',
                'link' => 'https://beyondchats.com/blog/web-dev-practices',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            [
                'title' => 'Cybersecurity Trends and Threats',
                'content' => 'As technology advances, so do the methods used by cybercriminals...',
                'link' => 'https://beyondchats.com/blog/cybersecurity-trends',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            [
                'title' => 'Data Science and Analytics',
                'content' => 'Data-driven decision making is crucial for modern businesses...',
                'link' => 'https://beyondchats.com/blog/data-science',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            // Enhanced versions
            [
                'title' => 'Introduction to AI and Machine Learning - Enhanced',
                'content' => 'Artificial Intelligence (AI) and Machine Learning (ML) are revolutionizing industries worldwide with unprecedented capabilities. This comprehensive guide explores the fundamental concepts, applications, and future trends in AI/ML technology. Learn how these technologies are being applied in healthcare, finance, and more.',
                'link' => 'https://beyondchats.com/blog/ai-introduction',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => true,
                'original_article_id' => 1,
                'enhancement_metadata' => json_encode([
                    'similarity_score' => 0.85,
                    'enhanced_at' => Carbon::now()->toIso8601String(),
                    'model_used' => 'Claude Sonnet 4',
                    'references' => [
                        ['title' => 'MIT AI Course', 'url' => 'https://example.com/mit-ai'],
                        ['title' => 'Google AI Blog', 'url' => 'https://ai.googleblog.com'],
                    ]
                ]),
            ],
            [
                'title' => 'The Future of Cloud Computing - Enhanced',
                'content' => 'Cloud computing continues to evolve with groundbreaking technologies and services. This enhanced article explores serverless architecture, edge computing, multi-cloud strategies, and the role of AI in cloud infrastructure. Discover how major cloud providers are shaping the future of digital transformation.',
                'link' => 'https://beyondchats.com/blog/cloud-future',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => true,
                'original_article_id' => 2,
                'enhancement_metadata' => json_encode([
                    'similarity_score' => 0.92,
                    'enhanced_at' => Carbon::now()->toIso8601String(),
                    'model_used' => 'Claude Sonnet 4',
                    'references' => [
                        ['title' => 'AWS Architecture', 'url' => 'https://aws.amazon.com/architecture'],
                        ['title' => 'Azure Cloud Guide', 'url' => 'https://azure.microsoft.com/guides'],
                    ]
                ]),
            ],
            [
                'title' => 'Web Development Best Practices 2025 - Enhanced',
                'content' => 'Modern web development requires mastery of multiple frameworks, tools, and methodologies. This comprehensive guide covers React, Next.js, TypeScript, performance optimization, accessibility standards, and security best practices. Learn industry-standard patterns used by leading tech companies.',
                'link' => 'https://beyondchats.com/blog/web-dev-practices',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => true,
                'original_article_id' => 3,
                'enhancement_metadata' => json_encode([
                    'similarity_score' => 0.88,
                    'enhanced_at' => Carbon::now()->toIso8601String(),
                    'model_used' => 'Claude Sonnet 4',
                    'references' => [
                        ['title' => 'MDN Web Docs', 'url' => 'https://developer.mozilla.org'],
                        ['title' => 'Web.dev by Google', 'url' => 'https://web.dev'],
                    ]
                ]),
            ],
            [
                'title' => 'Cybersecurity Trends and Threats - Enhanced',
                'content' => 'As technology advances rapidly, cybercriminals develop increasingly sophisticated attack methods. This enhanced guide covers zero-trust architecture, AI-powered threat detection, ransomware prevention, and emerging security frameworks. Stay ahead of threats with expert insights and real-world case studies.',
                'link' => 'https://beyondchats.com/blog/cybersecurity-trends',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => true,
                'original_article_id' => 4,
                'enhancement_metadata' => json_encode([
                    'similarity_score' => 0.90,
                    'enhanced_at' => Carbon::now()->toIso8601String(),
                    'model_used' => 'Claude Sonnet 4',
                    'references' => [
                        ['title' => 'OWASP Foundation', 'url' => 'https://owasp.org'],
                        ['title' => 'NIST Cybersecurity', 'url' => 'https://www.nist.gov/cyberframework'],
                    ]
                ]),
            ],
            [
                'title' => 'Data Science and Analytics - Enhanced',
                'content' => 'Data-driven decision making is crucial for modern businesses competing in the digital age. This comprehensive guide explores statistical methods, machine learning algorithms, data visualization techniques, and big data technologies. Learn how Fortune 500 companies leverage analytics for competitive advantage.',
                'link' => 'https://beyondchats.com/blog/data-science',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => true,
                'original_article_id' => 5,
                'enhancement_metadata' => json_encode([
                    'similarity_score' => 0.87,
                    'enhanced_at' => Carbon::now()->toIso8601String(),
                    'model_used' => 'Claude Sonnet 4',
                    'references' => [
                        ['title' => 'Kaggle Learn', 'url' => 'https://www.kaggle.com/learn'],
                        ['title' => 'Towards Data Science', 'url' => 'https://towardsdatascience.com'],
                    ]
                ]),
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }
    }
}
