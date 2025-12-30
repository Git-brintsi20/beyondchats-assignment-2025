"use client"

import { Button } from "@/components/ui/button"

export default function Hero() {
  const scrollToSearch = () => {
    const element = document.getElementById("search-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[500px] overflow-hidden bg-gradient-to-b from-primary/10 via-secondary/5 to-background px-4 py-20 sm:px-6 lg:px-8">
      {/* Animated Background Shape */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl shape-morph"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl shape-morph" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <h1 className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-5xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent gradient-animate">
          Discover & Analyze Articles with AI
        </h1>
        <p className="mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 text-lg leading-8 text-muted-foreground" style={{ animationDelay: "200ms" }}>
          BeyondChats uses advanced AI to enhance article insights, provide comparisons, and deliver personalized
          content recommendations tailored to your interests.
        </p>
        <div className="mt-10 flex animate-in fade-in zoom-in duration-700 gap-4 justify-center" style={{ animationDelay: "400ms" }}>
          <Button onClick={scrollToSearch} className="h-12 px-8 bg-primary hover:bg-primary/90 hover:scale-105 text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
            Explore Articles
          </Button>
          <Button variant="outline" className="h-12 px-8 bg-transparent hover:bg-primary/10 hover:scale-105 transition-all duration-300 hover:border-primary">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
