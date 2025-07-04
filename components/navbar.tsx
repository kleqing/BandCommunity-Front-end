"use client"

import { useState } from "react"
import { Search, Bell, MessageCircle, Sun, Moon, User, Settings, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { GuitarIcon } from "@/components/icons/guitar-icon"
import { SearchDropdown } from "@/components/search-dropdown"
import { AuthModal } from "@/components/auth-modal"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { logout } from "@/lib/api/auth"
import { User as UserType } from "@/interfaces/user"

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<UserType | undefined>(undefined)
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {

    try {
      await logout()

      localStorage.removeItem("user")
      window.location.reload()
    }
    catch (error) {
      console.error("Logout failed:", error)
      alert("Failed to logout. Please try again.")
    }
  }

  const handleProfile = () => {
    // Handle profile navigation
    window.location.href = "/profile"
  }

  const handleSettings = () => {
    // Handle settings navigation
    console.log("Navigate to settings")
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    const token = localStorage.getItem("resetToken")
    if (token) {
      localStorage.removeItem("resetToken")
      setIsAuthModalOpen(true)

      setTimeout(() => {
        const event = new CustomEvent("reset-password", { detail: { token } })
        window.dispatchEvent(event)
      }, 100)
    }
  }, [searchParams])

  useEffect(() => {
    const userJson = localStorage.getItem("user")
    if (userJson) {
      const parsed: UserType = JSON.parse(userJson)
      setUser(parsed)
    }
  }, [])

  useEffect(() => {
    const verifyEmail = localStorage.getItem("emailVerified")

    if (verifyEmail) {
      localStorage.removeItem("emailVerified")

      setIsAuthModalOpen(true)

      setTimeout(() => {
        const event = new CustomEvent("verify-success", { detail: { email: verifyEmail } })
        window.dispatchEvent(event)
      }, 100)
    }
  }, [])

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <GuitarIcon className="h-6 w-6" />
              </Button>

              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="w-64 border-none bg-muted/50 focus-visible:ring-1"
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  />
                </div>
                {isSearchOpen && <SearchDropdown />}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Chat */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>New Message</DropdownMenuItem>
                  <DropdownMenuItem>Chat History</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                  <DropdownMenuItem>View All</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2 relative"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
              </Button>

              {/* User Profile or Login Button */}
              {user?.isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 h-auto">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePictureUrl || "/placeholder.svg"} alt={user.userName} />
                        <AvatarFallback>
                          {user.userName}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden sm:block">{user.userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center space-x-2 p-2 w-full max-w-[220px]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePictureUrl || "/placeholder.svg"} alt={user.userName} />
                        <AvatarFallback>{user.userName}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}