"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, UserCircle, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    })
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold"><span className="text-primary">Course</span><span className="text-[#d62839]">Central</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/schools/queens" className="text-sm font-medium hover:text-primary">
            Queen's Courses
          </Link>
          <Link href="/add-courses" className="text-sm font-medium hover:text-primary">
            Add Courses
          </Link>
          <Link href="/queens-answers" className="text-sm font-medium hover:text-primary">
            AI Assistant
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          
          {/* Auth Button or User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <UserCircle size={18} />
                  <span className="max-w-[100px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2 text-sm font-medium text-gray-600">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => router.push('/sign-in')}
            >
              Sign In
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 pb-6 border-b">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/schools/queens" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              Queen's Courses
            </Link>
            <Link href="/add-courses" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              Add Courses
            </Link>
            <Link href="/queens-answers" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              AI Assistant
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              About
            </Link>
            
            {/* Auth Buttons */}
            {user ? (
              <div className="pt-2 border-t">
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {user.email}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  router.push('/sign-in');
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navigation
