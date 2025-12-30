"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(180)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsVerified(true)
    setTimeout(() => router.push("/"), 2000)
  }

  const handleResend = async () => {
    setTimeLeft(180)
    setOtp("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (isVerified) {
    return (
      <AuthLayout title="Email Verified" subtitle="Your account has been successfully verified">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Redirecting to home in a moment...</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Verify Email" subtitle="Enter the code sent to your email">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="otp" className="text-sm font-medium">
            Verification Code
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            required
            maxLength={6}
            autoFocus
            className="mt-1 text-center text-2xl tracking-widest"
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">Code expires in {formatTime(timeLeft)}</p>
        </div>

        <Button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={timeLeft > 0}
              className="text-primary hover:underline disabled:text-muted-foreground"
            >
              {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : "Resend"}
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
