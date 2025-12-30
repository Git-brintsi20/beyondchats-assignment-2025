"use client"

import { Button } from "@/components/ui/button"

export default function Hero() {
  const scrollToSearch = () => {
    const element = document.getElementById("search-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[500px] overflow-hidden bg-gradient-to-b from-primary/10 via-secondary/5 to-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="animate-fade-in text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Discover & Analyze Articles with AI
        </h1>
        <p className="mt-6 animate-fade-in text-lg leading-8 text-muted-foreground" style={{ animationDelay: "100ms" }}>
          BeyondChats uses advanced AI to enhance article insights, provide comparisons, and deliver personalized
          content recommendations tailored to your interests.
        </p>
        <div className="mt-10 flex animate-fade-in gap-4 justify-center" style={{ animationDelay: "200ms" }}>
          <Button onClick={scrollToSearch} className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            Explore Articles
          </Button>
          <Button variant="outline" className="h-12 px-8 bg-transparent">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
