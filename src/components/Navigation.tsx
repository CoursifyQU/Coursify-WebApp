"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut, User, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
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
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let lastY = window.scrollY

    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY

      setScrolled(currentY > 20)

      if (currentY < 80) {
        setHidden(false)
      } else if (delta > 6) {
        setHidden(true)
        setIsMenuOpen(false)
      } else if (delta < -6) {
        setHidden(false)
      }

      lastY = currentY
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSignOut = async () => {
    toast({
      title: "Signing out...",
      description: "You will be redirected to the home page",
      variant: "success",
    })
    await signOut()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/schools/queens", label: "Queen's Courses" },
    { href: "/add-courses", label: "Add Courses" },
    { href: "/queens-answers", label: "AI Assistant" },
    { href: "/about", label: "About" },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-transform duration-300 ease-in-out"
      style={{ transform: hidden ? "translateY(-110%)" : "translateY(0)" }}
    >
      {/* Pill navbar */}
      <div
        className="max-w-4xl mx-auto rounded-full px-5 py-2.5 transition-all duration-300"
        style={{
          background: scrolled ? "var(--nav-bg-scrolled)" : "var(--nav-bg)",
          backdropFilter: scrolled ? "blur(48px) saturate(220%)" : "blur(32px) saturate(200%)",
          WebkitBackdropFilter: scrolled ? "blur(48px) saturate(220%)" : "blur(32px) saturate(200%)",
          border: "1px solid var(--nav-border)",
          boxShadow: scrolled
            ? `0 16px 48px var(--nav-shadow-scrolled), 0 4px 12px var(--nav-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : `0 8px 32px var(--nav-shadow), 0 2px 8px var(--nav-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-lg font-bold tracking-tight gold-shine-text">
              Coursify
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden nav:flex items-center gap-0.5 text-sm font-medium text-brand-navy/70 dark:text-slate-300/70">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    link.href === "/queens-answers"
                      ? "px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      : "px-3.5 py-1.5 rounded-full text-brand-navy/70 dark:text-slate-300/70 hover:text-brand-navy dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-200"
                  }
                >
                  {link.href === "/queens-answers" ? (
                    <span className="coursify-gradient-text">
                      {link.label}
                    </span>
                  ) : (
                    link.label
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-black/[0.06] dark:bg-white/[0.10] hover:bg-black/[0.10] dark:hover:bg-white/[0.16] text-gray-600 dark:text-slate-300 border border-black/[0.06] dark:border-white/[0.10]"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark"
                ? <><Sun size={15} /><span className="hidden nav:inline text-xs">Light</span></>
                : <><Moon size={15} /><span className="hidden nav:inline text-xs">Dark</span></>
              }
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-brand-navy dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-200 border border-white/60 dark:border-white/10"
                    style={{ background: "var(--nav-bg)" }}
                  >
                    <User className="w-4 h-4" strokeWidth={1.5} />
                    <span className="hidden nav:block max-w-[80px] truncate text-xs">
                      {user.email?.split("@")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-2xl border-0 shadow-xl mt-2 glass-card"
                >
                  <div className="p-2 text-xs font-medium text-gray-500 dark:text-slate-400">{user.email}</div>
                  <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-sm text-gray-600 dark:text-slate-300 hover:text-brand-red rounded-xl mx-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="liquid-btn-red text-white text-sm font-medium px-4 py-1.5 rounded-full"
              >
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="nav:hidden p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-gray-500 dark:text-slate-400 hover:text-brand-navy dark:hover:text-white transition-all duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div
          className="nav:hidden max-w-4xl mx-auto mt-2 rounded-3xl px-4 py-4 glass-card"
        >
          <nav className="flex flex-col gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-brand-navy dark:hover:text-white px-4 py-2.5 rounded-2xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors duration-200"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 mt-1 border-t border-black/5 dark:border-white/5 flex items-center justify-between px-4 py-2.5">
              <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-black/[0.06] dark:bg-white/[0.10] hover:bg-black/[0.10] dark:hover:bg-white/[0.16] text-gray-600 dark:text-slate-300 border border-black/[0.06] dark:border-white/[0.10]"
              >
                {mounted && theme === "dark"
                  ? <><Sun size={15} /><span className="text-xs">Light mode</span></>
                  : <><Moon size={15} /><span className="text-xs">Dark mode</span></>
                }
              </button>
            </div>

            {user ? (
              <div className="pt-2 mt-1 border-t border-black/5 dark:border-white/5">
                <div className="text-xs font-medium text-gray-400 dark:text-slate-500 mb-1 px-4">{user.email}</div>
                <button
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-brand-red rounded-2xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors duration-200"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 mt-1 border-t border-black/5 dark:border-white/5">
                <button
                  className="w-full liquid-btn-red text-white text-sm font-medium px-4 py-2.5 rounded-2xl"
                  onClick={() => { router.push("/sign-in"); setIsMenuOpen(false) }}
                >
                  Sign In
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navigation
