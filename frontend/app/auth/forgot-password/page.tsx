"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import AuthLayout from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <AuthLayout title="Reset Password" subtitle="We'll send you an email to reset your password">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="mt-1"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>

          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Check your email</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Didn't receive it? Check your spam folder or{" "}
            <button onClick={() => setIsSubmitted(false)} className="text-primary hover:underline">
              try again
            </button>
          </p>
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      )}
    </AuthLayout>
  )
}
