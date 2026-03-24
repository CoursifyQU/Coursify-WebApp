"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, Upload, BarChart3 } from "lucide-react"
import { fetchCoursesPage } from "@/lib/db"
import type { CourseWithStats } from "@/types"

export default function CourseSearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)
  const [results, setResults] = useState<CourseWithStats[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!submittedQuery.trim()) return

    let cancelled = false
    setLoading(true)
    setSearched(true)

    fetchCoursesPage({
      search: submittedQuery,
      hasData: false,
      limit: 50,
      page: 1,
    }).then((result) => {
      if (!cancelled) {
        setResults(result.courses)
        setTotal(result.total)
      }
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [submittedQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSubmittedQuery(query.trim())
      window.history.replaceState(null, "", `?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-green-600"
    if (gpa >= 3.0) return "text-blue-600"
    if (gpa >= 2.3) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-gradient pt-20">
      <style jsx global>{`
        .mesh-gradient {
          background-color: hsla(0, 0%, 100%, 1);
          background-image:
            radial-gradient(at 21% 33%, hsla(225, 100%, 19%, 0.09) 0px, transparent 50%),
            radial-gradient(at 79% 76%, hsla(352, 71%, 54%, 0.08) 0px, transparent 50%),
            radial-gradient(at 96% 10%, hsla(43, 83%, 51%, 0.07) 0px, transparent 50%);
        }
        .glass-card-deep {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(28px) saturate(170%);
          -webkit-backdrop-filter: blur(28px) saturate(170%);
          border: 1px solid rgba(255, 255, 255, 0.82);
          box-shadow:
            0 8px 32px rgba(0, 48, 95, 0.13),
            0 2px 8px rgba(0, 48, 95, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.95),
            inset 0 -1px 0 rgba(255, 255, 255, 0.3);
        }
        .search-glass {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.82);
          box-shadow:
            0 4px 20px rgba(0, 48, 95, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border-radius: 0.75rem;
          padding: 0.5rem;
        }
        :is(.dark) .mesh-gradient {
          background-color: hsla(220, 20%, 10%, 1);
          background-image:
            radial-gradient(at 21% 33%, hsla(225, 100%, 30%, 0.15) 0px, transparent 50%),
            radial-gradient(at 79% 76%, hsla(352, 71%, 40%, 0.12) 0px, transparent 50%),
            radial-gradient(at 96% 10%, hsla(43, 83%, 40%, 0.10) 0px, transparent 50%);
        }
        :is(.dark) .glass-card-deep {
          background: rgba(38, 38, 38, 0.82);
          backdrop-filter: blur(28px) saturate(170%);
          -webkit-backdrop-filter: blur(28px) saturate(170%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            inset 0 -1px 0 rgba(255, 255, 255, 0.02);
        }
        :is(.dark) .search-glass {
          background: rgba(38, 38, 38, 0.82);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-navy/8 dark:bg-blue-400/8 rounded-full blur-3xl"></div>
      </div>

      <div className="container py-12 px-4 lg:px-6 relative z-10 max-w-4xl mx-auto">
        <Link
          href="/schools/queens"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy dark:text-white mb-8 glass-pill px-4 py-2 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course Explorer
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-brand-navy dark:text-white">
            Search All Courses
          </h1>
          <p className="text-muted-foreground text-sm">
            Search our full catalog of Queen&apos;s courses, including those we don&apos;t have grade data for yet.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8 items-stretch">
          <div className="flex-1 search-glass">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-lg bg-brand-navy/10 dark:bg-blue-400/10">
                <Search className="h-3.5 w-3.5 text-brand-navy dark:text-white" />
              </div>
              <Input
                placeholder="Search by course code or name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 bg-transparent border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-brand-navy dark:text-white placeholder:text-brand-navy/40 dark:placeholder:text-white/40"
                autoFocus
              />
            </div>
          </div>
          <Button type="submit" className="liquid-btn-red border-0 text-white shrink-0 h-14 min-h-14 rounded-xl px-6">
            Search
          </Button>
        </form>

        {loading && (
          <div className="glass-card-deep rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy dark:border-blue-400 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Searching courses...</p>
            </div>
          </div>
        )}

        {!loading && searched && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {total} {total === 1 ? "course" : "courses"} found for &ldquo;{submittedQuery}&rdquo;
            </p>

            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((course) => {
                  const hasGpaData = course.averageGPA > 0
                  const slug = course.course_code.replace(/\s+/g, "-").toLowerCase()

                  return (
                    <Link
                      key={course.id}
                      href={`/schools/queens/${slug}`}
                      className="block glass-card-deep rounded-xl p-5 hover:bg-white/80 dark:hover:bg-white/[0.06] transition-colors duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-brand-red">{course.course_code}</span>
                            {hasGpaData ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                <BarChart3 className="h-3 w-3" />
                                Data available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                                No data yet
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-brand-navy dark:text-white truncate">{course.course_name}</p>
                          {course.department && (
                            <p className="text-xs text-muted-foreground mt-1">{course.department}</p>
                          )}
                        </div>
                        {hasGpaData && (
                          <div className="flex items-center gap-4 text-sm shrink-0">
                            <div>
                              <span className="text-xs text-muted-foreground block">Avg. GPA</span>
                              <span className={`font-semibold ${getGpaColor(course.averageGPA)}`}>
                                {course.averageGPA.toFixed(1)}
                              </span>
                            </div>
                            {course.totalEnrollment > 0 && (
                              <div>
                                <span className="text-xs text-muted-foreground block">Enrollment</span>
                                <span className="font-semibold text-brand-navy dark:text-white">
                                  {Math.round(course.totalEnrollment)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="glass-card-deep rounded-xl p-8 text-center">
                <p className="text-muted-foreground mb-4">No courses found matching &ldquo;{submittedQuery}&rdquo;.</p>
              </div>
            )}

            {/* CTA to add data */}
            <div className="mt-8 p-6 glass-card-deep rounded-xl text-center">
              <Upload className="h-8 w-8 text-brand-gold mx-auto mb-3" />
              <h3 className="text-base font-bold text-brand-navy dark:text-white mb-2">Help grow our database</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                Have a grade distribution PDF? Upload it to help other Queen&apos;s students make informed decisions.
              </p>
              <Button asChild className="liquid-btn-red border-0 text-white">
                <a href="/add-courses">Upload Grade Distributions</a>
              </Button>
            </div>
          </>
        )}

        {!loading && !searched && (
          <div className="glass-card-deep rounded-xl p-8 text-center">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Enter a course code or name to search the full catalog.</p>
          </div>
        )}
      </div>
    </div>
  )
}
