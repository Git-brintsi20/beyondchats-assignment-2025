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
                'url' => 'https://beyondchats.com/blog/ai-introduction',
                'content' => 'Artificial Intelligence (AI) and Machine Learning (ML) are transforming industries worldwide. These technologies enable computers to learn from data and make intelligent decisions without explicit programming. AI is being used in healthcare for disease diagnosis, in finance for fraud detection, and in autonomous vehicles for navigation. Machine learning algorithms analyze vast amounts of data to identify patterns and make predictions. Deep learning, a subset of ML, uses neural networks to process complex information like images and speech. As AI continues to evolve, it promises to revolutionize every aspect of our lives, from how we work to how we interact with technology.',
                'excerpt' => 'Learn about AI and ML fundamentals',
                'author' => 'BeyondChats',
                'thumbnail' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            [
                'title' => 'The Future of Cloud Computing',
                'content' => 'Cloud computing continues to evolve with new technologies and services that transform how businesses operate. Organizations are adopting multi-cloud strategies to avoid vendor lock-in and optimize costs. Serverless computing allows developers to focus on code without managing infrastructure. Edge computing brings processing closer to data sources, reducing latency for IoT applications. Container orchestration platforms like Kubernetes simplify application deployment and scaling. Cloud security remains a top priority as companies store sensitive data remotely. The rise of AI-powered cloud services enables sophisticated analytics and automation. As 5G networks expand, cloud computing will become even more integral to digital transformation initiatives.',
                'url' => 'https://beyondchats.com/blog/cloud-future',
                'excerpt' => 'Explore the evolution of cloud computing technologies',
                'author' => 'BeyondChats',
                'thumbnail' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            [
                'title' => 'Web Development Best Practices 2025',
                'content' => 'Modern web development requires understanding of multiple frameworks and tools that shape the digital landscape. React and Next.js dominate frontend development with their component-based architecture and server-side rendering capabilities. TypeScript adds type safety to JavaScript, catching errors before runtime. Responsive design ensures websites work seamlessly across all devices. Progressive Web Apps (PWAs) combine the best of web and mobile applications. Web accessibility (WCAG) standards make content available to everyone. Performance optimization techniques like code splitting and lazy loading improve user experience. Security best practices including HTTPS, CSP headers, and input validation protect users and data.',
                'url' => 'https://beyondchats.com/blog/web-dev-practices',
                'excerpt' => 'Master modern web development frameworks and tools',
                'author' => 'BeyondChats',
                'thumbnail' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            [
                'title' => 'Cybersecurity Trends and Threats',
                'content' => 'As technology advances, so do the methods used by cybercriminals to exploit vulnerabilities. Ransomware attacks have become more sophisticated, targeting critical infrastructure and demanding large payments. Phishing campaigns use social engineering to trick users into revealing sensitive information. Zero-trust security models assume no user or device is trusted by default. Multi-factor authentication adds layers of protection beyond passwords. Security Information and Event Management (SIEM) systems detect threats in real-time. Regular security audits and penetration testing identify weaknesses before attackers do. Employee training remains crucial as human error is often the weakest link in security chains.',
                'url' => 'https://beyondchats.com/blog/cybersecurity-trends',
                'excerpt' => 'Stay ahead of evolving cybersecurity threats',
                'author' => 'BeyondChats',
                'thumbnail' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            [
                'title' => 'Data Science and Analytics',
                'content' => 'Data-driven decision making is crucial for modern businesses competing in todays market. Companies collect vast amounts of data from multiple sources including customer interactions, sales transactions, and social media. Data scientists use statistical methods and machine learning to extract insights from this information. Predictive analytics helps forecast future trends and customer behavior. Data visualization tools like Tableau and Power BI make complex data accessible to stakeholders. Big data technologies such as Hadoop and Spark process enormous datasets efficiently. Data governance ensures quality, security, and compliance. Organizations that leverage analytics effectively gain competitive advantages through informed strategic decisions.',
                'url' => 'https://beyondchats.com/blog/data-science',
                'excerpt' => 'Leverage data science for business insights',
                'author' => 'BeyondChats',
                'thumbnail' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
                'scraped_at' => Carbon::now(),
                'is_enhanced' => false,
            ],
            // Enhanced versions
            [
                'title' => 'Introduction to AI and Machine Learning - Enhanced',
                'content' => 'Artificial Intelligence (AI) and Machine Learning (ML) are revolutionizing industries worldwide with unprecedented capabilities. This comprehensive guide explores the fundamental concepts, applications, and future trends in AI/ML technology. Learn how these technologies are being applied in healthcare, finance, and more.',
                'url' => 'https://beyondchats.com/blog/ai-introduction-enhanced',
                'excerpt' => 'AI-enhanced comprehensive guide to AI/ML fundamentals, applications, and future trends',
                'author' => 'BeyondChats AI',
                'thumbnail' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
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
                'url' => 'https://beyondchats.com/blog/cloud-future-enhanced',
                'excerpt' => 'AI-enhanced exploration of serverless, edge computing, and multi-cloud strategies',
                'author' => 'BeyondChats AI',
                'thumbnail' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop',
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
                'url' => 'https://beyondchats.com/blog/web-dev-practices-enhanced',
                'excerpt' => 'AI-enhanced guide covering React, Next.js, TypeScript, and modern best practices',
                'author' => 'BeyondChats AI',
                'thumbnail' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
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
                'url' => 'https://beyondchats.com/blog/cybersecurity-trends-enhanced',
                'excerpt' => 'AI-enhanced security guide with zero-trust, threat detection, and real-world case studies',
                'author' => 'BeyondChats AI',
                'thumbnail' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
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
                'url' => 'https://beyondchats.com/blog/data-science-enhanced',
                'excerpt' => 'AI-enhanced data science guide with ML algorithms and Fortune 500 case studies',
                'author' => 'BeyondChats AI',
                'thumbnail' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
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
            // Extract URL as the unique identifier
            $url = $article['url'];
            unset($article['url']);
            
            // Use updateOrCreate to make seeder idempotent (safe to run multiple times)
            Article::updateOrCreate(
                ['url' => $url], // Match on URL
                $article // Update/Create with these values
            );
        }
    }
}
