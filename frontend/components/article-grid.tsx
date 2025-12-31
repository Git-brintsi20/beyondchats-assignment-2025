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

// 6 articles per page
const ITEMS_PER_PAGE = 6

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
          limit: ITEMS_PER_PAGE,
        }
        
        if (searchQuery) {
          params.search = searchQuery
        }
        
        if (filters.sortBy) {
          // Map frontend sortBy values to backend column names
          const sortByMap: Record<string, string> = {
            'latest': '-published_date',
            'oldest': 'published_date',
            'title': 'title',
            '-title': '-title'
          }
          params.sortBy = sortByMap[filters.sortBy] || '-published_date'
        }
        
        const response = await getAllArticles(params)
        
        // --- DEBUGGING LOG ---
        console.log("API Response:", response);
        // ---------------------

        // FIX 1: Check for 'data' (standard) OR 'articles'
        let fetchedArticles = response.data || response.articles || []
        
        // Client-side tag filtering
        if (filters.source !== "all") {
          fetchedArticles = fetchedArticles.filter((article: Article) => 
            article.tags?.some(tag => tag.toLowerCase() === filters.source.toLowerCase())
          )
        }
        
        setArticles(fetchedArticles)
        
        // FIX 2: robust total calculation
        // Check response.pagination.total (your custom format) OR response.total (Laravel default)
        const totalItems = response.pagination?.total || response.total || fetchedArticles.length || 0
        const calculatedPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
        
        console.log(`Total Items: ${totalItems}, Calculated Pages: ${calculatedPages}`);

        // Update parent
        if (onTotalPagesChange) {
          onTotalPagesChange(calculatedPages > 0 ? calculatedPages : 1)
        }

      } catch (err: any) {
        console.error('Failed to fetch articles:', err)
        setError(err.message || 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [page, searchQuery, filters, onTotalPagesChange])

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
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
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
        const isEnhanced = article.is_enhanced || article.metadata?.isAIGenerated || false
        const isUpdated = article.metadata?.lastAnalyzed ? true : false
        const readingTime = article.metadata?.readingTime ? `${article.metadata.readingTime} min read` : "5 min read"
        
        // Safely parse date
        let formattedDate = "Recent";
        try {
            const dateStr = article.published_date || article.scraped_at || new Date().toISOString();
            formattedDate = format(new Date(dateStr), "MMM dd, yyyy");
        } catch (e) {
            formattedDate = "Recent";
        }
        
        return (
          <Link 
            key={article.id} 
            href={`/articles/${article.id}`}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card className={`group h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.03] hover:-translate-y-2 cursor-pointer border-2 border-border/60 hover:border-primary/40 zoom-match-cut stagger-${(index % 6) + 1} bg-card/95 backdrop-blur-sm`}>
              <div className="relative overflow-hidden bg-gradient-to-br from-muted via-muted/80 to-muted/60 h-52">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img
                  src={article.thumbnail || "/placeholder.svg"}
                  alt={article.title}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.15] group-hover:rotate-2 brightness-100 group-hover:brightness-110"
                />
                {(isEnhanced || isUpdated) && (
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    {isEnhanced && (
                      <Badge className="gradient-primary text-primary-foreground gap-1.5 flex items-center swipe-in-right glass border-0 shadow-lg px-3 py-1">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        Enhanced
                      </Badge>
                    )}
                    {isUpdated && (
                      <Badge variant="secondary" className="swipe-in-right stagger-1 glass gradient-secondary text-secondary-foreground border-0 shadow-lg px-3 py-1">
                        Updated
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 p-6">
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-lg font-bold text-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 tracking-tight leading-tight">
                    {article.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground/90 transition-all duration-500 group-hover:text-foreground/90 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {article.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs font-medium transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:shadow-sm">
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

                <Button variant="ghost" className="w-full gap-2 mt-auto text-primary font-semibold group-hover:gap-4 transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/80 hover-scale group-hover:text-primary-foreground group-hover:shadow-lg">
                  Read Article 
                  <span className="transition-transform duration-300 group-hover:translate-x-2 text-xl">→</span>
                </Button>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}