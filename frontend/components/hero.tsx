"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp } from "lucide-react"

export default function Hero() {
  const scrollToSearch = () => {
    const element = document.getElementById("search-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[500px] overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 px-4 py-20 sm:px-6 lg:px-8">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full filter blur-3xl shape-morph"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/25 to-primary/15 rounded-full filter blur-3xl shape-morph" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-secondary/20 to-accent/15 rounded-full filter blur-3xl shape-morph" style={{ animationDelay: '8s' }}></div>
      </div>
      
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <div className="fade-in-blur flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary px-3 py-1 rounded-full glass">AI-Powered Content Discovery</span>
        </div>
        
        <h1 className="zoom-match-cut text-5xl font-bold tracking-tight text-foreground sm:text-6xl leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent gradient-animate">
            Discover & Analyze
          </span>
          <br />
          <span className="text-foreground">Articles with AI</span>
        </h1>
        
        <p className="mt-6 glide-in text-lg leading-8 text-muted-foreground">
          BeyondChats uses advanced AI to enhance article insights, provide comparisons, and deliver personalized
          content recommendations tailored to your interests.
        </p>
        
        <div className="mt-10 flex scale-in gap-4 justify-center flex-wrap">
          <Button 
            onClick={scrollToSearch} 
            className="h-12 px-8 gradient-primary hover:opacity-90 hover-lift text-primary-foreground transition-all duration-300 shadow-primary gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Explore Articles
          </Button>
          <Button 
            variant="outline" 
            className="h-12 px-8 glass hover:bg-primary/10 hover-lift transition-all duration-300 hover:border-primary hover:shadow-primary gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
