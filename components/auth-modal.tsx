"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { login, signup, forgotPassword, resendEmail, resetPassword } from "@/lib/api/auth"
import { toast } from "sonner"
import { isPasswordValid, isDateOfBirthValid } from "@/lib/utils"
import { User } from "@/interfaces/user"
import countriesRaw from "@/data/countries.json"
import statesRaw from "@/data/states.json"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Country, State } from "@/interfaces/location"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<
    "login" | "signup" | "forgot" | "verify" | "verify-success" | "reset-password" | "forgot-success"
  >("login")
  const [userEmail, setUserEmail] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resetToken, setResetToken] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    resetEmail: "",
    newPassword: "",
    confirmNewPassword: "",
    address: "",
    country: "",
    state: ""
  })

  const countries = countriesRaw as Country[]
  const states = statesRaw as State[]

  const availableStates = useMemo(() => {
    return states
      .filter((s) => s.country_code === formData.country && s.state_code && s.name)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [formData.country])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentView === "forgot") {
      // Handle forgot password
      try {
        await forgotPassword(formData.resetEmail)
        setUserEmail(formData.resetEmail)
        toast.success("Reset link sent! Please check your email.")
        setCurrentView("forgot-success")
      } catch (error: any) {
        if (error.message.toLowerCase().includes("not confirmed") || error.message.toLowerCase().includes("verify")) {
          setUserEmail(formData.resetEmail)
          setCurrentView("verify")
        } else {
          toast.error(error.message || "Failed to send reset email")
        }
      }
    }
    else if (currentView === "reset-password") {
      // Handle password reset
      if (formData.newPassword !== formData.confirmNewPassword) {
        alert("Passwords don't match!")
        return
      }
      try {
        await resetPassword(resetToken, formData.newPassword, formData.confirmNewPassword)
        toast.success("Password reset successfully")
        setCurrentView("login")
        resetForm()

        // Clear reset token and email
        window.history.replaceState(null, "", "/")
      }
      catch (error: any) {
        toast.error(error.message || "Password reset failed")
      }
    }
    else if (currentView === "signup") {
      // Handle signup and show verification
      formData.dateOfBirth = new Date(formData.dateOfBirth).toISOString() // Ensure date is in ISO format
      if (!isPasswordValid(formData.password)) {
        toast.error("Password must be at least 8 characters long and include uppercase, lowercase, and a number.")
        return
      }
      if (!isDateOfBirthValid(formData.dateOfBirth)) {
        toast.error("Date of birth must be in the past.")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        return
      }

      const selectedCountry = countries.find(c => c.iso2 === formData.country)?.name || ""
      const selectedState = states.find(s => s.state_code === formData.state && s.country_code === formData.country)?.name || ""
      const fullAddress = `${selectedState}, ${selectedCountry}`
      formData.address = fullAddress;
      try {
        await signup(formData)
        setUserEmail(formData.email)
        setCurrentView("verify")
      }
      catch (error: any) {
        const msg = error.message?.toLowerCase() || ""
        if (msg.includes("email already exist") && msg.includes("not confirmed")) {
          setUserEmail(formData.email)
          setCurrentView("verify")
          toast.info("This email is already registered but not verified. Please check your email.")
        }
        else if (msg.includes("email already exist")) {
          toast.error("Email already exists. Please use a different email.")
        }
        else if (msg.includes("username already exist")) {
          toast.error("Username already exists. Please choose a different username.")
        }
        else {
          toast.error(error.message || "Signup failed")
        }
      }
    }
    else if (currentView === "login") {
      try {
        const res = await login(formData.email, formData.password)
        const user = res.data

        const userData: User = {
          userName: user.userName,
          email: user.email,
          profilePictureUrl: user.profilePictureUrl || "",
          isLoggedIn: true,
        }

        localStorage.setItem("user", JSON.stringify(userData))
        window.location.reload()
        onClose()
      } catch (error: any) {
        const msg = error.message?.toLowerCase() || ""
        if (msg.toLowerCase().includes("not confirmed") || msg.toLowerCase().includes("verify")) {
          setUserEmail(formData.email)
          setCurrentView("verify")
        }
        else if (msg.toLowerCase().includes("not found")) {
          toast.error("Account not found. Please sign up first.")
        }
        else if (msg.toLowerCase().includes("invalid")) {
          toast.error("Incorrect password or account does not exist.")
        }
        else {
          toast.error(error.message || "Login failed")
        }
      }
    }
  }

  useEffect(() => {
    const handleResetPassword = (event: any) => {
      const token = event.detail?.token
      setResetToken(token)
      setCurrentView("reset-password")
    }

    window.addEventListener("reset-password", handleResetPassword)
    return () => {
      window.removeEventListener("reset-password", handleResetPassword)
    }
  }, [])

  useEffect(() => {
    const handleVerifySuccess = (event: any) => {
      const email = event.detail?.email
      if (email) {
        setUserEmail(email)
        setIsEmailVerified(true)
        setCurrentView("verify-success")
      }
    }

    window.addEventListener("verify-success", handleVerifySuccess)
    return () => {
      window.removeEventListener("verify-success", handleVerifySuccess)
    }
  }, [])

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !userEmail) return

    await resendEmail(userEmail)
    toast.success("Verification email resent successfully")

    // Start cooldown
    setResendCooldown(30)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      resetEmail: "",
      newPassword: "",
      confirmNewPassword: "",
      address: "",
      country: "",
      state: "",
    })
  }

  const toggleMode = () => {
    if (currentView === "login") {
      setCurrentView("signup")
    } else {
      setCurrentView("login")
    }
    resetForm()
  }

  const goToForgotPassword = () => {
    setCurrentView("forgot")
  }

  const backToLogin = () => {
    setCurrentView("login")
    setFormData((prev) => ({ ...prev, resetEmail: "", newPassword: "", confirmNewPassword: "" }))
  }

  const getTitle = () => {
    switch (currentView) {
      case "login":
        return "Welcome Back"
      case "signup":
        return "Create Account"
      case "forgot":
        return "Reset Password"
      case "verify":
        return "Verify Your Email"
      case "verify-success":
        return "Email Verified!"
      case "reset-password":
        return "Create New Password"
      default:
        return "Welcome Back"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md scale-95 origin-center">
        <DialogHeader>
          <div className="flex items-center justify-center relative">
            {(currentView === "forgot" || currentView === "verify" || currentView === "reset-password") && (
              <Button variant="ghost" size="sm" className="absolute left-0 p-1" onClick={backToLogin}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-center text-xl font-semibold">{getTitle()}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {currentView === "verify-success" ? (
            // Email Verification Success View
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-600">Email Verified Successfully!</h3>
                <p className="text-sm text-muted-foreground">Your email address has been confirmed.</p>
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-sm text-muted-foreground">You can now access all features of your account.</p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setCurrentView("login")
                  }}
                >
                  Continue to Login
                </Button>
              </div>
            </div>
          ) : currentView === "reset-password" ? (
            // Reset Password Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Create a new password for your account.
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  required
                  minLength={8}
                />
                {formData.newPassword && !isPasswordValid(formData.newPassword) && (
                  <p className="text-xs text-red-500">Password must be at least 8 characters long and include uppercase, lowercase, and a number.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={formData.confirmNewPassword}
                  onChange={(e) => handleInputChange("confirmNewPassword", e.target.value)}
                  required
                  minLength={8}
                />
                {formData.newPassword &&
                  formData.confirmNewPassword &&
                  formData.newPassword !== formData.confirmNewPassword && (
                    <p className="text-xs text-red-500">Passwords don't match</p>
                  )}
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p className="font-medium mb-1">Password requirements:</p>
                <ul className="space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                  <li>• Include at least one special character</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600"
                disabled={
                  !formData.newPassword ||
                  !formData.confirmNewPassword ||
                  formData.newPassword !== formData.confirmNewPassword
                }
              >
                Reset Password
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={backToLogin}
                  className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : currentView === "forgot-success" ? (
            // Forgot Password Success View
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-sky-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Check your email</h3>
                <p className="text-sm text-muted-foreground">We've sent a password reset link to</p>
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-sm text-muted-foreground">Click the button in the email to reset your password.</p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setCurrentView("forgot")}
                >
                  Didn't receive the email?
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={backToLogin}
                    className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          ) : currentView === "verify" ? (
            // Email Verification View
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-sky-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Check your email</h3>
                <p className="text-sm text-muted-foreground">We've sent a verification link to</p>
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-sm text-muted-foreground">Click the button in the email to verify your account.</p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0 || !userEmail.trim()}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend verification email"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={backToLogin}
                    className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </div>

              {!userEmail.trim() && (
                <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  Please enter your email address to resend verification
                </div>
              )}
            </div>
          ) : currentView === "forgot" ? (
            // Forgot Password Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </div>

              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email Address</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.resetEmail}
                  onChange={(e) => handleInputChange("resetEmail", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                Send Reset Link
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={backToLogin}
                  className="text-sm text-sky-600 hover:text-sky-700 hover:underline block w-full"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            // Login/Signup Forms
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {currentView === "login" ? (
                  // Login Form
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                    </div>

                    <div className="text-center space-y-2">
                      <button
                        type="button"
                        className="text-sm text-sky-600 hover:text-sky-700 hover:underline block w-full"
                        onClick={goToForgotPassword}
                      >
                        Forgot password?
                      </button>

                      <div className="text-xs text-muted-foreground">
                        Email not confirmed?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.email.trim()) {
                              setUserEmail(formData.email)
                            }
                            setCurrentView("verify")
                          }}
                          className="text-sky-600 hover:text-sky-700 hover:underline"
                        >
                          Resend verification email
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                      Login
                    </Button>
                  </>
                ) : (
                  // Signup Form
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        required
                      />
                    </div>

                    {/* Location Fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries
                              .filter((c) => c.iso2)
                              .map((country) => (
                                <SelectItem key={country.iso2} value={country.iso2}>
                                  {country.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">City</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => handleInputChange("state", value)}
                          disabled={!formData.country}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={formData.country ? "Choose city" : "Select country first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStates
                              .filter((state) => state.state_code)
                              .map((state) => (
                                <SelectItem key={state.state_code} value={state.state_code}>
                                  {state.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      {formData.password && !isPasswordValid(formData.password) && (
                        <p className="text-xs text-red-500">
                          Password must be at least 8 characters long and include uppercase, lowercase, and a number.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                      />
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-500">Passwords don't match</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <div className="relative">
                        <Input
                          id="dateOfBirth"
                          type="date"
                          max={new Date().toISOString().split("T")[0]} // Prevent future dates
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          className="pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                      Sign Up
                    </Button>
                  </>
                )}

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    {currentView === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-sky-600 hover:text-sky-700 hover:underline font-medium"
                    >
                      {currentView === "login" ? "Sign up" : "Login"}
                    </button>
                  </span>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
