"use client"

import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`page-enter ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  )
}

export function ZoomTransition({ children, className = "" }: PageTransitionProps) {
  return <div className={`zoom-match-cut ${className}`}>{children}</div>
}

export function SwipeTransition({ 
  children, 
  className = "",
  direction = "left" 
}: PageTransitionProps & { direction?: "left" | "right" | "top" | "bottom" }) {
  return <div className={`swipe-in-${direction} ${className}`}>{children}</div>
}

export function GlideTransition({ children, className = "" }: PageTransitionProps) {
  return <div className={`glide-in ${className}`}>{children}</div>
}

export function FadeTransition({ children, className = "" }: PageTransitionProps) {
  return <div className={`fade-in-blur ${className}`}>{children}</div>
}
