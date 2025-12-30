"use client"

import { useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import SearchBar from "@/components/search-bar"
import ArticleGrid from "@/components/article-grid"
import Pagination from "@/components/pagination"
import { PageTransition } from "@/components/page-transition"

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ source: "all", sortBy: "latest" })
  const [totalPages, setTotalPages] = useState(1)

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <div className="w-full bg-gradient-to-b from-primary/5 to-transparent py-12 transition-all duration-500 glide-in-top">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SearchBar onSearch={setSearchQuery} onFilterChange={setFilters} />
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <ArticleGrid 
              page={currentPage} 
              searchQuery={searchQuery} 
              filters={filters}
              onTotalPagesChange={setTotalPages}
            />
            {totalPages > 1 && (
              <div className="mt-12 glide-in">
                <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} />
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  )
}