"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary"></div>
          <span className="text-xl">BeyondChats</span>
        </Link>

        <nav className="hidden gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/articles" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Articles
          </Link>
          <Link href="/trending" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Trending
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden gap-2 sm:flex">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
          <button className="md:hidden p-2">
            <Menu size={20} className="text-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
