"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Check } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "password") {
      calculatePasswordStrength(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match")
      return
    }
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSuccess(true)
    setTimeout(() => router.push("/auth/login"), 2000)
  }

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500"
    if (strength === 2) return "bg-yellow-500"
    if (strength === 3) return "bg-blue-500"
    return "bg-green-500"
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This password reset link is invalid or expired">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Please request a new password reset link</p>
        </div>
      </AuthLayout>
    )
  }

  if (isSuccess) {
    return (
      <AuthLayout title="Password Reset" subtitle="Your password has been successfully reset">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-muted-foreground">Redirecting to login in a moment...</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create New Password" subtitle="Enter a new password for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password" className="text-sm font-medium">
            New Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoFocus
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formData.password && (
            <div className="mt-2">
              <div className="mb-1 flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full bg-gray-200 dark:bg-gray-700 ${
                      i < passwordStrength ? getStrengthColor(passwordStrength) : ""
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {passwordStrength === 0 && "Weak password"}
                {passwordStrength === 1 && "Fair password"}
                {passwordStrength === 2 && "Good password"}
                {passwordStrength === 3 && "Strong password"}
                {passwordStrength === 4 && "Very strong password"}
              </p>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  )
}
