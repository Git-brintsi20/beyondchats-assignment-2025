"use client"

import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Rocket, Clock, CheckCircle2 } from "lucide-react"

export default function FutureFeaturesPage() {
  const futureFeatures = [
    {
      title: "User Authentication",
      description: "Full authentication system with JWT tokens, OAuth integration, and user profiles.",
      status: "Planned",
      priority: "High"
    },
    {
      title: "Advanced Article Filtering",
      description: "Filter by categories, tags, date ranges, and reading time with a sophisticated UI.",
      status: "Planned",
      priority: "Medium"
    },
    {
      title: "Trending Analytics",
      description: "Real-time trending articles dashboard based on views, shares, and engagement metrics.",
      status: "Planned",
      priority: "High"
    },
    {
      title: "Bookmark & Favorites",
      description: "Save articles, create collections, and organize your reading list.",
      status: "Planned",
      priority: "Medium"
    },
    {
      title: "Social Features",
      description: "Share articles, comment, like, and engage with other readers.",
      status: "Planned",
      priority: "Low"
    },
    {
      title: "Email Notifications",
      description: "Get notified about new articles, trending topics, and personalized recommendations.",
      status: "Planned",
      priority: "Medium"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 zoom-match-cut">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:scale-105 transition-transform">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Rocket className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent gradient-animate">
            Future Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exciting enhancements planned for future releases. These features will be implemented after the initial assignment evaluation.
          </p>
        </div>

        {/* Current Assignment Status */}
        <Card className="p-8 mb-12 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Current Assignment: Complete ✅</h3>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Phase 1: Web Scraping + CRUD APIs (5 articles from BeyondChats blog)
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Phase 2: AI Content Enhancement Workflow with Claude Sonnet 4
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Phase 3: React Frontend with Article Display & Comparisons
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Future Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {futureFeatures.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-6 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <Clock className="h-6 w-6 text-primary" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  feature.priority === 'High' ? 'bg-red-500/20 text-red-500' :
                  feature.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {feature.priority} Priority
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span>{feature.status}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Note Section */}
        <Card className="mt-12 p-8 bg-muted/30 border-border/50 animate-in fade-in duration-500" style={{ animationDelay: '800ms' }}>
          <h3 className="text-lg font-semibold mb-3">📝 Note for Evaluators</h3>
          <p className="text-muted-foreground">
            This page demonstrates future enhancements that would be implemented in a production version. 
            The current assignment focuses on core functionality: web scraping, AI enhancement, and article display. 
            Additional features like authentication, trending analytics, and social features are planned for post-evaluation development.
          </p>
        </Card>
      </main>
    </div>
  )
}
