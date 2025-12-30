"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, User, Calendar, Sparkles, Loader2 } from "lucide-react"
import { getAllArticles, type Article } from "@/lib/api"
import { format } from "date-fns"

interface ArticleGridProps {
  page: number
  searchQuery: string
  filters: { source: string; sortBy: string }
  onTotalPagesChange?: (total: number) => void
}

const mockArticles = [
  {
    id: 1,
    title: "The Future of AI: What to Expect in 2025",
    excerpt: "Exploring emerging trends in artificial intelligence and machine learning",
    author: "Sarah Chen",
    date: "Dec 28, 2024",
    readingTime: "8 min read",
    image: "/ai-technology-future.png",
    tags: ["AI", "Technology", "Future"],
    isEnhanced: true,
    isUpdated: false,
  },
  {
    id: 2,
    title: "Sustainable Business Practices",
    excerpt: "How companies are adopting eco-friendly strategies for growth",
    author: "Michael Rodriguez",
    date: "Dec 27, 2024",
    readingTime: "6 min read",
    image: "/sustainable-business-green.png",
    tags: ["Business", "Sustainability"],
    isEnhanced: false,
    isUpdated: true,
  },
  {
    id: 3,
    title: "Brain-Computer Interfaces: The Next Frontier",
    excerpt: "Latest breakthroughs in neurotechnology and mind-machine interaction",
    author: "Dr. Emily Watson",
    date: "Dec 26, 2024",
    readingTime: "10 min read",
    image: "/brain-computer-interface-neural.jpg",
    tags: ["Science", "Technology", "Neural"],
    isEnhanced: true,
    isUpdated: false,
  },
  {
    id: 4,
    title: "Remote Work: The Future is Hybrid",
    excerpt: "Organizations navigating the evolving landscape of work-from-home policies",
    author: "Jennifer Lee",
    date: "Dec 25, 2024",
    readingTime: "7 min read",
    image: "/remote-work-hybrid-office.jpg",
    tags: ["Work", "Business", "Culture"],
    isEnhanced: false,
    isUpdated: false,
  },
  {
    id: 5,
    title: "Mental Health in the Digital Age",
    excerpt: "Understanding the impact of technology on our psychological wellbeing",
    author: "Dr. James Park",
    date: "Dec 24, 2024",
    readingTime: "9 min read",
    image: "/mental-health-digital-wellness.jpg",
    tags: ["Wellness", "Health", "Mental"],
    isEnhanced: true,
    isUpdated: true,
  },
  {
    id: 6,
    title: "Quantum Computing Explained",
    excerpt: "Breaking down the complexities of quantum technology for everyone",
    author: "Prof. David Kumar",
    date: "Dec 23, 2024",
    readingTime: "12 min read",
    image: "/quantum-computing.png",
    tags: ["Science", "Technology", "Quantum"],
    isEnhanced: false,
    isUpdated: false,
  },
  {
    id: 7,
    title: "Climate Action: What Governments Are Doing",
    excerpt: "Global initiatives and policies to combat climate change",
    author: "Lisa Anderson",
    date: "Dec 22, 2024",
    readingTime: "7 min read",
    image: "/climate-change-environment-green-earth.jpg",
    tags: ["Environment", "Policy", "Sustainability"],
    isEnhanced: true,
    isUpdated: false,
  },
  {
    id: 8,
    title: "Cryptocurrency in 2025: Predictions and Insights",
    excerpt: "What the blockchain industry might look like in the coming year",
    author: "Alex Thompson",
    date: "Dec 21, 2024",
    readingTime: "8 min read",
    image: "/cryptocurrency-blockchain-bitcoin.png",
    tags: ["Finance", "Technology", "Crypto"],
    isEnhanced: false,
    isUpdated: true,
  },
  {
    id: 9,
    title: "The Art of Deep Work in a Distracted World",
    excerpt: "Strategies to maintain focus and boost productivity",
    author: "Dr. Marcus White",
    date: "Dec 20, 2024",
    readingTime: "6 min read",
    image: "/productivity-focus-deep-work.jpg",
    tags: ["Productivity", "Wellness", "Work"],
    isEnhanced: true,
    isUpdated: false,
  },
]

export default function ArticleGrid({ page, searchQuery, filters, onTotalPagesChange }: ArticleGridProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        setError(null)
        
        const params: any = {
          page,
          limit: 6,
        }
        
        if (searchQuery) {
          params.search = searchQuery
        }
        
        if (filters.source !== "all") {
          // Backend doesn't have tag filtering yet, we'll filter client-side
        }
        
        if (filters.sortBy) {
          params.sortBy = filters.sortBy
        }
        
        const response = await getAllArticles(params)
        
        let fetchedArticles = response.articles
        
        // Remove duplicate articles - if both original and enhanced exist, prefer enhanced
        const uniqueArticles = new Map()
        fetchedArticles.forEach(article => {
          const key = article.title.toLowerCase().trim()
          const existing = uniqueArticles.get(key)
          
          if (!existing) {
            uniqueArticles.set(key, article)
          } else if (article.metadata?.isAIGenerated && !existing.metadata?.isAIGenerated) {
            // Prefer enhanced version over original
            uniqueArticles.set(key, article)
          }
        })
        
        fetchedArticles = Array.from(uniqueArticles.values())
        
        // Client-side tag filtering if needed
        if (filters.source !== "all") {
          fetchedArticles = fetchedArticles.filter(article => 
            article.tags?.some(tag => tag.toLowerCase() === filters.source.toLowerCase())
          )
        }
        
        setArticles(fetchedArticles)
        onTotalPagesChange?.(Math.max(1, Math.ceil(fetchedArticles.length / 6)))
      } catch (err: any) {
        console.error('Failed to fetch articles:', err)
        setError(err.message || 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [page, searchQuery, filters])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 animate-in fade-in duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground animate-pulse">Loading articles...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 px-6 py-12 text-center">
        <h3 className="text-lg font-medium text-destructive">Failed to load articles</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <h3 className="text-lg font-medium text-foreground">No articles found</h3>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => {
        const isEnhanced = article.metadata?.isAIGenerated || false
        const isUpdated = article.metadata?.lastAnalyzed ? true : false
        const readingTime = article.metadata?.readingTime 
          ? `${article.metadata.readingTime} min read` 
          : "5 min read"
        const formattedDate = article.publishedDate 
          ? format(new Date(article.publishedDate), "MMM dd, yyyy")
          : format(new Date(article.scrapedAt), "MMM dd, yyyy")
        
        return (
          <Link 
            key={article._id} 
            href={`/articles/${article._id}`}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card className={`group h-full overflow-hidden transition-all duration-300 hover:shadow-xl shadow-primary hover:scale-[1.02] hover:-translate-y-1 cursor-pointer border-border/50 zoom-match-cut stagger-${(index % 6) + 1}`}>
              <div className="relative overflow-hidden gradient-ocean h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <img
                  src={article.thumbnail || "/placeholder.svg"}
                  alt={article.title}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 mix-blend-overlay opacity-80"
                />
                {(isEnhanced || isUpdated) && (
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                    {isEnhanced && (
                      <Badge className="gradient-primary text-primary-foreground gap-1 flex items-center swipe-in-right glass border-0">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        Enhanced
                      </Badge>
                    )}
                    {isUpdated && (
                      <Badge variant="secondary" className="swipe-in-right stagger-1 glass gradient-secondary text-secondary-foreground border-0">
                        Updated
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 p-5">
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground/80">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {article.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs transition-smooth hover:scale-110 hover:border-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {readingTime}
                  </div>
                </div>

                <Button variant="ghost" className="w-full gap-2 mt-auto text-primary group-hover:gap-4 transition-all duration-300 group-hover:bg-primary/10 hover-scale">
                  Read Article 
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Button>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
