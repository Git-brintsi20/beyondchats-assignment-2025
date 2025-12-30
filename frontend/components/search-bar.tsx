"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, ChevronDown } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: { source: string; sortBy: string }) => void
}

export default function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ source: "all", sortBy: "latest" })
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClear = () => {
    setSearchQuery("")
    onSearch("")
  }

  return (
    <div id="search-section" className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles, topics, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="relative" ref={filterRef}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 bg-card"
          >
            <ChevronDown className="h-4 w-4" />
            Filter
          </Button>

          {showFilters && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-4 shadow-lg animate-slide-up">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Source</label>
                  <select
                    value={filters.source}
                    onChange={(e) => handleFilterChange("source", e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Sources</option>
                    <option value="tech">Tech Articles</option>
                    <option value="business">Business</option>
                    <option value="science">Science</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="latest">Latest</option>
                    <option value="trending">Trending</option>
                    <option value="popular">Most Popular</option>
                    <option value="reading-time">Reading Time</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFilters({ source: "all", sortBy: "latest" })
                      onFilterChange({ source: "all", sortBy: "latest" })
                    }}
                    className="flex-1 text-sm"
                  >
                    Reset
                  </Button>
                  <Button type="button" onClick={() => setShowFilters(false)} className="flex-1 bg-primary text-sm">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
