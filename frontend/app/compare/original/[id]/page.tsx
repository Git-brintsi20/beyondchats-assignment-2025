"use client"

import { useState, use } from "react"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import { ArrowLeft, Eye, Maximize2, Focus } from "lucide-react"

export default function ComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [viewMode, setViewMode] = useState<"side-by-side" | "stacked" | "differences">("side-by-side")
  const [syncScroll, setSyncScroll] = useState(true)

  const original = {
    title: "The Future of AI: What to Expect in 2025",
    content: `Artificial Intelligence is revolutionizing technology. AI is everywhere now. Machine learning models are getting smarter. Companies use AI for many things. AI helps with customer service. AI generates content. AI analyzes data.

The growth of generative AI has been remarkable. Tools like ChatGPT are popular. Companies experiment with AI. Some use it for business processes. AI makes things faster.

Edge AI is becoming important. Running AI on devices is useful. It reduces latency. Privacy is better. Costs are lower.

AI systems can process multiple types of data. Images, text, video, audio. These models are powerful. They open new possibilities.

The future looks good for AI. We will see more changes. AI will impact everyone.`,
    wordCount: "156",
    readingTime: "1 min",
  }

  const enhanced = {
    title: "The Future of AI: What to Expect in 2025",
    content: `Introduction
Artificial Intelligence is no longer a concept for the future—it's here, and it's evolving faster than ever. As we enter 2025, the landscape of AI is shifting dramatically, with new breakthroughs occurring almost daily. This article explores the key trends and developments that will shape the AI industry over the next year.

Generative AI Maturation
The explosive growth of generative AI has been nothing short of remarkable. From ChatGPT to specialized models for coding, image generation, and beyond, these tools have captured the imagination of businesses and consumers alike. In 2025, we expect to see this technology mature significantly.

Companies will move beyond experimental use cases to implement generative AI in critical business processes. We're already seeing this shift with enterprises deploying AI for customer service, content creation, and data analysis. The focus will be on making these systems more reliable, efficient, and trustworthy.

Edge AI and On-Device Processing
One of the most exciting developments is the shift toward edge AI—running AI models on local devices rather than relying solely on cloud computing. This approach offers several advantages: reduced latency, improved privacy, and lower operational costs.

In 2025, we'll see more devices equipped with dedicated AI processors, enabling complex AI tasks to be performed locally. This will be particularly important for applications that require real-time processing or handle sensitive data.

Multimodal AI Systems
AI systems that can understand and process multiple types of data—text, images, video, and audio—are becoming increasingly sophisticated. These multimodal models are more powerful and versatile than single-modality systems, opening up new possibilities for AI applications.

Conclusion
The future of AI in 2025 looks incredibly promising. With advances in generative models, edge computing, and multimodal systems, we're entering a new era of artificial intelligence.`,
    wordCount: "273",
    readingTime: "2 min",
  }

  const metrics = {
    wordCountIncrease: 75,
    readabilityImprovement: 23,
    similarityScore: 87,
    newSections: 5,
    paragraphsAdded: 8,
  }

  const renderContent = (text: string, isHighlighted: boolean) => {
    return (
      <div
        className={`space-y-3 leading-relaxed text-sm whitespace-pre-wrap ${isHighlighted ? "bg-green-50/50 dark:bg-green-950/20 p-4 rounded" : ""}`}
      >
        {text}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" }, 
            { label: "Articles", href: `/articles/${id}` }, 
            { label: "Comparison" }
          ]}
        />

        {/* Header */}
        <div className="mt-8 animate-fade-in space-y-6">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">{original.title}</h1>

          {/* View Mode Controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewMode === "side-by-side" ? "default" : "outline"}
              onClick={() => setViewMode("side-by-side")}
              className="gap-2 bg-primary"
            >
              <Eye className="h-4 w-4" />
              Side-by-Side
            </Button>
            <Button
              variant={viewMode === "stacked" ? "default" : "outline"}
              onClick={() => setViewMode("stacked")}
              className="gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              Stacked
            </Button>
            <Button
              variant={viewMode === "differences" ? "default" : "outline"}
              onClick={() => setViewMode("differences")}
              className="gap-2"
            >
              <Focus className="h-4 w-4" />
              Differences Only
            </Button>

            <div className="ml-auto">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncScroll}
                  onChange={(e) => setSyncScroll(e.target.checked)}
                  className="rounded"
                />
                Sync Scroll
              </label>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
            <Card className="border-border bg-card p-3">
              <p className="text-xs font-medium text-muted-foreground">Word Count Increase</p>
              <p className="mt-1 text-xl font-bold text-primary">+{metrics.wordCountIncrease}%</p>
            </Card>
            <Card className="border-border bg-card p-3">
              <p className="text-xs font-medium text-muted-foreground">Readability</p>
              <p className="mt-1 text-xl font-bold text-green-600">+{metrics.readabilityImprovement}%</p>
            </Card>
            <Card className="border-border bg-card p-3">
              <p className="text-xs font-medium text-muted-foreground">Similarity Score</p>
              <p className="mt-1 text-xl font-bold text-blue-600">{metrics.similarityScore}%</p>
            </Card>
            <Card className="border-border bg-card p-3">
              <p className="text-xs font-medium text-muted-foreground">New Sections</p>
              <p className="mt-1 text-xl font-bold">{metrics.newSections}</p>
            </Card>
            <Card className="border-border bg-card p-3">
              <p className="text-xs font-medium text-muted-foreground">Paragraphs Added</p>
              <p className="mt-1 text-xl font-bold">{metrics.paragraphsAdded}</p>
            </Card>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="mt-12">
          {viewMode === "side-by-side" && (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Original */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">Original</h2>
                  <Badge variant="outline">{original.wordCount} words</Badge>
                  <Badge variant="outline">{original.readingTime}</Badge>
                </div>
                <Card className="border-border bg-card p-6">{renderContent(original.content, false)}</Card>
              </div>

              {/* Enhanced */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">Enhanced</h2>
                  <Badge className="bg-primary text-primary-foreground">{enhanced.wordCount} words</Badge>
                  <Badge className="bg-primary text-primary-foreground">{enhanced.readingTime}</Badge>
                </div>
                <Card className="border-border border-green-500/50 bg-green-50/50 dark:bg-green-950/20 p-6">
                  {renderContent(enhanced.content, true)}
                </Card>
              </div>
            </div>
          )}

          {viewMode === "stacked" && (
            <div className="space-y-8">
              {/* Original */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">Original</h2>
                  <Badge variant="outline">{original.wordCount} words</Badge>
                </div>
                <Card className="border-border bg-card p-6">{renderContent(original.content, false)}</Card>
              </div>

              {/* Enhanced */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">Enhanced</h2>
                  <Badge className="bg-primary text-primary-foreground">{enhanced.wordCount} words</Badge>
                </div>
                <Card className="border-border border-green-500/50 bg-green-50/50 dark:bg-green-950/20 p-6">
                  {renderContent(enhanced.content, true)}
                </Card>
              </div>
            </div>
          )}

          {viewMode === "differences" && (
            <div className="space-y-4">
              <Card className="border-border bg-card p-6">
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-100">Added Content</h3>
                    <p className="mt-2 text-sm text-green-800 dark:text-green-200 leading-relaxed">
                      The article now includes proper sections with clear hierarchy (Introduction, Generative AI
                      Maturation, Edge AI and On-Device Processing, Multimodal AI Systems, Conclusion). The introduction
                      now provides context about why these trends matter in 2025. Each topic is expanded with specific
                      examples and practical implications for readers.
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">Enhanced Clarity</h3>
                    <p className="mt-2 text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      Vague statements like "AI is getting smarter" have been replaced with concrete information about
                      specific applications and advancements. Technical terms are now properly contextualized within
                      relevant discussions about their real-world impact.
                    </p>
                  </div>

                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-4 border border-amber-200 dark:border-amber-800">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">Improved Structure</h3>
                    <p className="mt-2 text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                      Content has been reorganized for better logical flow. Related concepts are grouped together.
                      Transitions between sections are smoother. The article now builds knowledge progressively, making
                      it easier to follow and understand.
                    </p>
                  </div>

                  <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 p-4 border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">Enhanced Engagement</h3>
                    <p className="mt-2 text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                      The article now has more compelling language while maintaining accuracy. Examples are more
                      specific. The conclusion provides a stronger call-to-action. Overall readability and engagement
                      have improved significantly.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-12 border-t border-border pt-8">
          <Link href={`/articles/${id}`} className="flex items-center gap-2 text-primary hover:underline w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Article
          </Link>
        </div>
      </main>
    </div>
  )
}
