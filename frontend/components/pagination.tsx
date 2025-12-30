"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

export default function Pagination({ currentPage, onPageChange, totalPages }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="outline" onClick={handlePrevious} disabled={currentPage === 1} className="gap-2 bg-transparent">
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const pageNum = i + 1
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={currentPage === pageNum ? "bg-primary" : ""}
            >
              {pageNum}
            </Button>
          )
        })}
        {totalPages > 5 && <span className="text-muted-foreground">...</span>}
      </div>

      <Button
        variant="outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="gap-2 bg-transparent"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
