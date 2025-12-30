"use client"

import type React from "react"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary"></div>
            <span className="text-xl">BeyondChats</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg shadow-primary/5">{children}</div>
        </div>
      </main>
    </div>
  )
}
