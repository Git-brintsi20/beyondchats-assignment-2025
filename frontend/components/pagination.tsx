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

  // Calculate page range to show
  const getPageNumbers = () => {
    const pages = []
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 4) {
        // Near start: show 1,2,3,4,5...last
        for (let i = 1; i <= 5; i++) pages.push(i)
        pages.push('ellipsis-end')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Near end: show 1...last-4,last-3,last-2,last-1,last
        pages.push(1)
        pages.push('ellipsis-start')
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
      } else {
        // Middle: show 1...current-1,current,current+1...last
        pages.push(1)
        pages.push('ellipsis-start')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('ellipsis-end')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button 
        variant="outline" 
        onClick={handlePrevious} 
        disabled={currentPage === 1} 
        className="gap-2 bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span key={`${page}-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            )
          }
          
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onPageChange(page)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className={currentPage === page ? "bg-primary" : ""}
            >
              {page}
            </Button>
          )
        })}
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
