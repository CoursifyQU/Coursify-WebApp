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
    <header className="sticky top-0 z-50 w-full border-b" style={{backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)'}}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold"><span style={{color: '#00305f'}}>Course</span><span style={{color: '#d62839'}}>Central</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium" style={{color: '#333'}}>
            Home
          </Link>
          <Link href="/schools/queens" className="text-sm font-medium" style={{color: '#333'}}>
            Queen's Courses
          </Link>
          <Link href="/add-courses" className="text-sm font-medium" style={{color: '#333'}}>
            Add Courses
          </Link>
          <Link href="/queens-answers" className="text-sm font-medium" style={{color: '#333'}}>
            AI Assistant
          </Link>
          <Link href="/about" className="text-sm font-medium" style={{color: '#333'}}>
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
              style={{backgroundColor: '#00305f', color: 'white'}}
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
            <Link href="/" className="text-sm font-medium" style={{color: '#333'}} onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/schools/queens" className="text-sm font-medium" style={{color: '#333'}} onClick={toggleMenu}>
              Queen's Courses
            </Link>
            <Link href="/add-courses" className="text-sm font-medium" style={{color: '#333'}} onClick={toggleMenu}>
              Add Courses
            </Link>
            <Link href="/queens-answers" className="text-sm font-medium" style={{color: '#333'}} onClick={toggleMenu}>
              AI Assistant
            </Link>
            <Link href="/about" className="text-sm font-medium" style={{color: '#333'}} onClick={toggleMenu}>
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
<<<<<<< HEAD
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
=======
                  <UserAvatar size="sm" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">me</p>
                    </div>
                    <Link 
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
>>>>>>> 134683d55ecd0fb79c936d8a5917d4323cae77a7
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
                style={{backgroundColor: '#00305f', color: 'white'}}
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
