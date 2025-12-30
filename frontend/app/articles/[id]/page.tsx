"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { getArticleById, type Article } from "@/lib/api"
import { format } from "date-fns"
import {
  Heart,
  Bookmark,
  ArrowLeft,
  Sparkles,
  BarChart3,
  ChevronDown,
  ChevronUp,
  LinkedinIcon,
  Twitter,
  Copy,
  Check,
  Loader2,
} from "lucide-react"

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showEnhancementDetails, setShowEnhancementDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true)
        const data = await getArticleById(params.id)
        setArticle(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    
    fetchArticle()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground animate-pulse">Loading article...</span>
          </div>
        </main>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 zoom-match-cut">
          <div className="rounded-lg border border-destructive bg-destructive/10 px-6 py-12 text-center">
            <h3 className="text-lg font-medium text-destructive">Article not found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {error || 'The article you are looking for does not exist'}
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-4 hover:scale-105 transition-transform">
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const isEnhanced = article.metadata?.isAIGenerated || false
  const formattedDate = article.publishedDate 
    ? format(new Date(article.publishedDate), "MMMM dd, yyyy")
    : format(new Date(article.scrapedAt), "MMMM dd, yyyy")
  const readingTime = article.metadata?.readingTime 
    ? `${article.metadata.readingTime} min read`
    : "5 min read"
  const wordCount = article.metadata?.wordCount 
    ? article.metadata.wordCount.toLocaleString()
    : "N/A"
      <p>One of the most exciting developments is the shift toward edge AI—running AI models on local devices rather than relying solely on cloud computing. This approach offers several advantages: reduced latency, improved privacy, and lower operational costs.</p>
      <p>In 2025, we'll see more devices equipped with dedicated AI processors, enabling complex AI tasks to be performed locally. This will be particularly important for applications that require real-time processing or handle sensitive data.</p>
      
      <h2>Multimodal AI Systems</h2>
      <p>AI systems that can understand and process multiple types of data—text, images, video, and audio—are becoming increasingly sophisticated. These multimodal models are more powerful and versatile than single-modality systems, opening up new possibilities for AI applications.</p>
      <p>From enhanced virtual assistants to more intuitive human-computer interfaces, multimodal AI will transform how we interact with technology in 2025 and beyond.</p>
      
      <h2>Conclusion</h2>
      <p>The future of AI in 2025 looks incredibly promising. With advances in generative models, edge computing, and multimodal systems, we're entering a new era of artificial intelligence. The question is no longer whether AI will impact our lives, but how quickly we can adapt to these changes.</p>
    `,
    sources: [
      { title: "Latest AI Research Findings", url: "https://example.com/ai-research" },
      { title: "Industry Analysis Report", url: "https://example.com/industry-report" },
      { title: "Expert Commentary", url: "https://example.com/expert-commentary" },
    ],
    enhancementDetails: {
      originalWordCount: 2100,
      enhancedWordCount: 2400,
      readabilityImprovement: "23%",
      newSectionsAdded: 2,
      improvements: [
        "Added comprehensive introduction section",
        "Enhanced structure with better headings",
        "Included practical examples and use cases",
        "Improved flow and transitions between sections",
        "Added call-to-action elements",
      ],
    },
    relatedArticles: [
      {
        id: 2,
        title: "Machine Learning Ethics in Practice",
        excerpt: "Navigating responsible AI development",
        tags: ["AI", "Ethics"],
      },
      {
        id: 3,
        title: "Building Custom AI Models",
        excerpt: "A practical guide for developers",
        tags: ["AI", "Development"],
      },
      {
        id: 5,
        title: "AI in Healthcare: Breakthrough Innovations",
        excerpt: "How AI is transforming medical research",
        tags: ["AI", "Healthcare"],
      },
    ],
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Articles", href: "/" }, { label: article.title }]}
        />

        {/* Hero Section */}
        <div className="mt-8 animate-slide-up space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl leading-tight">{article.title}</h1>
            {article.excerpt && (
              <p className="text-xl text-muted-foreground">{article.excerpt}</p>
            )}
          </div>

          {/* Article Image */}
          <div className="relative h-96 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
            <img 
              src={article.thumbnail || "/placeholder.svg"} 
              alt={article.title} 
              className="h-full w-full object-cover" 
            />
            {isEnhanced && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground gap-1 flex items-center">
                  <Sparkles className="h-3 w-3" />
                  AI Enhanced
                </Badge>
              </div>
            )}
          </div>

          {/* Article Metadata */}
          <div className="flex items-center justify-between border-y border-border py-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{article.author || "Unknown Author"}</p>
                <p className="text-sm text-muted-foreground">
                  {article.metadata?.sourceType === 'enhanced' ? 'AI Enhanced Content' : 'Original Content'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right text-sm text-muted-foreground">
              <p>{formattedDate}</p>
              <p>{readingTime} • {wordCount} words</p>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {article.tags.map((tag) => (
                <Badge key={tag} className="bg-primary/20 text-primary hover:bg-primary/30">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="my-8 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setIsLiked(!isLiked)}
            className={`gap-2 ${isLiked ? "bg-red-50 text-red-600 dark:bg-red-950" : ""}`}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            {isLiked ? "Liked" : "Like"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsSaved(!isSaved)}
            className={`gap-2 ${isSaved ? "bg-primary/20 text-primary" : ""}`}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" title="Share on Twitter">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" title="Share on LinkedIn">
              <LinkedinIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2 bg-transparent"
              title="Copy link to clipboard"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert max-w-none space-y-8 py-8 text-foreground">
          <div className="space-y-6 leading-relaxed text-lg whitespace-pre-wrap">
            {article.content}
          </div>
        </article>

        {/* AI Enhancement Section */}
        {isEnhanced && article.metadata && (
          <div className="my-12 border-y border-border py-8">
            <button
              onClick={() => setShowEnhancementDetails(!showEnhancementDetails)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-primary/5 p-4 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">AI Enhancement Details</h3>
                  <p className="text-sm text-muted-foreground">See what was improved in this article</p>
                </div>
              </div>
              {showEnhancementDetails ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </button>

            {showEnhancementDetails && article.metadata && (
              <div className="mt-4 space-y-6 animate-slide-up">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="border-border bg-card p-4">
                    <p className="text-xs font-medium text-muted-foreground">Word Count</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {article.metadata.wordCount || 'N/A'}
                    </p>
                  </Card>
                  <Card className="border-border bg-card p-4">
                    <p className="text-xs font-medium text-muted-foreground">Reading Time</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {article.metadata.readingTime ? `${article.metadata.readingTime} min` : 'N/A'}
                    </p>
                  </Card>
                  <Card className="border-border bg-card p-4">
                    <p className="text-xs font-medium text-muted-foreground">Similarity Score</p>
                    <p className="mt-2 text-2xl font-bold text-primary">
                      {article.metadata.similarityScore ? `${article.metadata.similarityScore}%` : 'N/A'}
                    </p>
                  </Card>
                </div>

                {article.metadata.keywords && article.metadata.keywords.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Target Keywords</h4>
                    <div className="flex gap-2 flex-wrap">
                      {article.metadata.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {article.metadata.references && article.metadata.references.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">References</h4>
                    <ul className="space-y-2">
                      {article.metadata.references.map((ref, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {ref.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link href={`/compare/original/${article._id}`}>
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <BarChart3 className="h-4 w-4" />
                  View Detailed Comparison
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Sources */}
        <div className="my-12 space-y-4">
          <h3 className="text-xl font-bold text-foreground">Sources & References</h3>
          <div className="grid gap-3">
            {article.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-border bg-card p-4 hover:border-primary hover:bg-card/80 transition-all"
              >
                <p className="font-medium text-foreground hover:text-primary">{source.title}</p>
                <p className="text-xs text-muted-foreground truncate">{source.url}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div className="my-12 space-y-6">
          <h3 className="text-xl font-bold text-foreground">Related Articles</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {article.relatedArticles.map((related, idx) => (
              <Link key={related.id} href={`/articles/${related.id}`}>
                <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/20 hover:border-primary bg-card hover:bg-card/80">
                  <div className="p-5 space-y-3" style={{ animationDelay: `${idx * 50}ms` }}>
                    <h4 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                      {related.title}
                    </h4>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{related.excerpt}</p>
                    <div className="flex gap-1 flex-wrap">
                      {related.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 border-t border-border pt-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>
      </main>
    </div>
  )
}
