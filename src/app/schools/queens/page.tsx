"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp, Filter, Search, SlidersHorizontal, X, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { fetchCoursesPage, fetchDepartments } from "@/lib/db"
import type { CourseWithStats } from "@/types"
import { useSearchParams, useRouter } from "next/navigation"

export default function QueensCourses() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [courses, setCourses] = useState<CourseWithStats[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    searchParams.get("departments")?.split(",").filter(Boolean) || []
  )
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    searchParams.get("levels")?.split(",").filter(Boolean) || []
  )
  const [gpaRange, setGpaRange] = useState([
    parseFloat(searchParams.get("gpa_min") || "0"),
    parseFloat(searchParams.get("gpa_max") || "4.3"),
  ])
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(() => {
    const sortBy = searchParams.get("sort_by")
    const sortDir = searchParams.get("sort_dir")
    if (sortBy) {
      return { key: sortBy, direction: sortDir === "desc" ? "descending" : "ascending" }
    }
    return null
  })
  const [showFilters, setShowFilters] = useState(false)
  const [departmentOpen, setDepartmentOpen] = useState(false)
  const [levelOpen, setLevelOpen] = useState(false)
  const hasData = true // Always show only courses with data
  const [departments, setDepartments] = useState<string[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  )
  const coursesPerPage = 50

  const courseLevels = ["100", "200", "300", "400", "500"]

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments().then(setDepartments)
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Sync URL params
  const updateUrl = useCallback(
    (params: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "" && value !== "0" && value !== "4.3" && value !== "1" && value !== "true") {
          newParams.set(key, value)
        } else if (key === "has_data" && value === "false") {
          newParams.set(key, value)
        } else {
          newParams.delete(key)
        }
      })
      const paramString = newParams.toString()
      router.replace(paramString ? `?${paramString}` : "", { scroll: false })
    },
    [searchParams, router]
  )

  // Fetch courses when filters change
  useEffect(() => {
    let cancelled = false

    async function loadCourses() {
      setLoading(true)
      try {
        const result = await fetchCoursesPage({
          page: currentPage,
          limit: coursesPerPage,
          search: debouncedSearch || undefined,
          departments: selectedDepartments.length > 0 ? selectedDepartments : undefined,
          levels: selectedLevels.length > 0 ? selectedLevels : undefined,
          gpaMin: gpaRange[0],
          gpaMax: gpaRange[1],
          sortBy: (sortConfig?.key as "code" | "name" | "gpa" | "enrollment") || undefined,
          sortDir: sortConfig ? (sortConfig.direction === "ascending" ? "asc" : "desc") : undefined,
          hasData,
        })
        if (!cancelled) {
          setCourses(result.courses)
          setTotal(result.total)
          setTotalPages(result.totalPages)
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCourses()

    // Update URL
    updateUrl({
      page: currentPage > 1 ? String(currentPage) : undefined,
      search: debouncedSearch || undefined,
      departments: selectedDepartments.length > 0 ? selectedDepartments.join(",") : undefined,
      levels: selectedLevels.length > 0 ? selectedLevels.join(",") : undefined,
      gpa_min: gpaRange[0] > 0 ? String(gpaRange[0]) : undefined,
      gpa_max: gpaRange[1] < 4.3 ? String(gpaRange[1]) : undefined,
      sort_by: sortConfig?.key || undefined,
      sort_dir: sortConfig ? (sortConfig.direction === "ascending" ? "asc" : "desc") : undefined,
    })

    return () => {
      cancelled = true
    }
  }, [currentPage, debouncedSearch, selectedDepartments, selectedLevels, gpaRange, sortConfig])

  const requestSort = (key: string) => {
    // GPA and enrollment default to descending first (show highest values first)
    const defaultDesc = key === "gpa" || key === "enrollment"
    let direction: "ascending" | "descending" = defaultDesc ? "descending" : "ascending"

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "ascending" ? "descending" : "ascending"
    }

    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronDown className="h-4 w-4 opacity-50" />
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-green-600"
    if (gpa >= 3.0) return "text-blue-600"
    if (gpa >= 2.3) return "text-yellow-600"
    return "text-red-600"
  }

  const resetFilters = () => {
    setSearchTerm("")
    setDebouncedSearch("")
    setSelectedDepartments([])
    setSelectedLevels([])
    setGpaRange([0, 4.3])
    setSortConfig(null)
    setCurrentPage(1)
  }

  const toggleDepartment = (department: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(department) ? prev.filter((d) => d !== department) : [...prev, department]
    )
    setCurrentPage(1)
  }

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
    setCurrentPage(1)
  }

  const hasActiveFilters =
    debouncedSearch !== "" ||
    selectedDepartments.length > 0 ||
    selectedLevels.length > 0 ||
    gpaRange[0] > 0 ||
    (gpaRange[1] < 4.3)

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

        .dot-pattern {
          background-image: radial-gradient(circle, #00305f 1px, transparent 1px);
          background-size: 20px 20px;
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

        /* Override shadcn ghost variant accent hover on all glass buttons */
        .glass-btn:hover,
        .glass-btn:focus {
          background: rgba(255, 255, 255, 0.55) !important;
          box-shadow: 0 4px 20px rgba(0, 48, 95, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
          color: inherit !important;
        }

        /* Override CommandItem yellow highlight */
        [cmdk-item][data-selected="true"],
        [cmdk-item][aria-selected="true"],
        [role="option"][data-selected="true"],
        [role="option"][aria-selected="true"] {
          background-color: rgba(0, 48, 95, 0.08) !important;
          color: #00305f !important;
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

        /* ── Dark-mode overrides ── */
        :is(.dark) .mesh-gradient {
          background-color: hsla(220, 20%, 10%, 1);
          background-image:
            radial-gradient(at 21% 33%, hsla(225, 100%, 30%, 0.15) 0px, transparent 50%),
            radial-gradient(at 79% 76%, hsla(352, 71%, 40%, 0.12) 0px, transparent 50%),
            radial-gradient(at 96% 10%, hsla(43, 83%, 40%, 0.10) 0px, transparent 50%);
        }

        :is(.dark) .dot-pattern {
          background-image: radial-gradient(circle, #4a9eff 1px, transparent 1px);
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

        :is(.dark) .glass-btn:hover,
        :is(.dark) .glass-btn:focus {
          background: rgba(48, 48, 48, 0.65) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        }

        :is(.dark) [cmdk-item][data-selected="true"],
        :is(.dark) [cmdk-item][aria-selected="true"],
        :is(.dark) [role="option"][data-selected="true"],
        :is(.dark) [role="option"][aria-selected="true"] {
          background-color: rgba(74, 158, 255, 0.15) !important;
          color: #4a9eff !important;
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

      {/* Background elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-navy/8 dark:bg-blue-400/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-brand-gold/7 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="dot-pattern absolute inset-0 opacity-[0.06]"></div>
      </div>

      <div className="container py-12 px-4 lg-filters:px-6 relative z-10">
        <div className="mb-12 text-center lg-filters:text-left">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full glass-pill mb-4">
            <span className="text-brand-navy dark:text-white text-sm font-medium mr-2">Course Explorer</span>
            <span className="inline-flex rounded-full h-1.5 w-1.5 bg-brand-red"></span>
          </div>
          <h1 className="text-3xl lg-filters:text-4xl font-bold mb-4">
            <span className="text-brand-navy dark:text-white">Queen's University</span> <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto lg-filters:mx-0">
            Browse and filter through all courses offered at Queen's University. View grade distributions, enrollment
            data, and more to help you make informed course decisions.
          </p>
        </div>

        <div className="flex flex-col lg-filters:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="search-glass">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-lg bg-brand-navy/10 dark:bg-blue-400/10">
                  <Search className="h-3.5 w-3.5 text-brand-navy dark:text-white" />
                </div>
                <Input
                  placeholder="Search by course code or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-transparent border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-brand-navy dark:text-white placeholder:text-brand-navy/40 dark:placeholder:text-white/40"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="lg-filters:hidden glass-btn border-0 text-brand-navy dark:text-white hover:bg-white/30"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="ghost"
              onClick={resetFilters}
              className={`whitespace-nowrap ${
                hasActiveFilters
                  ? "liquid-btn-red border-0 text-white hover:bg-transparent"
                  : "glass-btn border-0 text-brand-red hover:bg-white/30"
              }`}
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg-filters:grid-cols-4 gap-6 mb-8">
          <div className={`lg-filters:col-span-1 ${showFilters ? "block" : "hidden lg-filters:block"}`}>
            <div className="glass-card-deep rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium flex items-center text-brand-navy dark:text-white">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="lg-filters:hidden">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Department Dropdown */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-brand-navy dark:text-white">Department</label>
                  <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={departmentOpen}
                        className="w-full justify-between glass-btn border-0 text-brand-navy dark:text-white hover:bg-white/30"
                      >
                        {selectedDepartments.length > 0
                          ? `${selectedDepartments.length} selected`
                          : "Select departments"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search departments..." />
                        <CommandList>
                          <CommandEmpty>No department found.</CommandEmpty>
                          <CommandGroup>
                            {departments.map((dept) => (
                              <CommandItem
                                key={dept}
                                value={dept}
                                onSelect={() => toggleDepartment(dept)}
                                className="flex items-center"
                              >
                                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                                  {selectedDepartments.includes(dept) && <Check className="h-3 w-3" />}
                                </div>
                                <span>{dept}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Course Level Dropdown */}
                <div className="mt-6">
                  <label className="text-sm font-medium mb-2 block text-brand-navy dark:text-white">Course Level</label>
                  <Popover open={levelOpen} onOpenChange={setLevelOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={levelOpen}
                        className="w-full justify-between glass-btn border-0 text-brand-navy dark:text-white hover:bg-white/30"
                      >
                        {selectedLevels.length > 0 ? `${selectedLevels.length} selected` : "Select levels"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {courseLevels.map((level) => (
                              <CommandItem
                                key={level}
                                value={level}
                                onSelect={() => toggleLevel(level)}
                                className="flex items-center"
                              >
                                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                                  {selectedLevels.includes(level) && <Check className="h-3 w-3" />}
                                </div>
                                <span>{level}-Level</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* GPA Range with Circle Handles */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-brand-navy dark:text-white">GPA Range</label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[0, 4.3]}
                      value={gpaRange}
                      onValueChange={setGpaRange}
                      onValueCommit={(value) => {
                        setGpaRange(value)
                        setCurrentPage(1)
                      }}
                      max={4.3}
                      step={0.1}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm text-brand-navy dark:text-white">
                      <span className="font-medium">{gpaRange[0].toFixed(1)}</span>
                      <span className="font-medium">{gpaRange[1].toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Min</span>
                      <span>Max</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/60">
                  <div className="text-xs text-muted-foreground mb-2">Active Filters:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDepartments.map((dept) => (
                      <Badge
                        key={dept}
                        className="bg-brand-navy/10 dark:bg-blue-400/10 text-brand-navy dark:text-white hover:bg-brand-navy/20 dark:hover:bg-blue-400/20 flex items-center"
                      >
                        {dept}
                        <button
                          onClick={() => setSelectedDepartments(selectedDepartments.filter((d) => d !== dept))}
                          className="ml-1 hover:text-brand-red"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedLevels.map((level) => (
                      <Badge
                        key={level}
                        className="bg-brand-navy/10 dark:bg-blue-400/10 text-brand-navy dark:text-white hover:bg-brand-navy/20 dark:hover:bg-blue-400/20 flex items-center"
                      >
                        {level}-Level
                        <button
                          onClick={() => setSelectedLevels(selectedLevels.filter((l) => l !== level))}
                          className="ml-1 hover:text-brand-red"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {(gpaRange[0] > 0 || gpaRange[1] < 4.3) && (
                      <Badge className="bg-brand-navy/10 dark:bg-blue-400/10 text-brand-navy dark:text-white hover:bg-brand-navy/20 dark:hover:bg-blue-400/20 flex items-center">
                        GPA: {gpaRange[0].toFixed(1)} - {gpaRange[1].toFixed(1)}
                        <button onClick={() => setGpaRange([0, 4.3])} className="ml-1 hover:text-brand-red">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg-filters:col-span-3">
            {loading ? (
              <div className="glass-card-deep rounded-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy dark:border-blue-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course data...</p>
                </div>
              </div>
            ) : (
              <div className="glass-card-deep rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-brand-navy/5 dark:bg-blue-400/5">
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-navy dark:text-white">
                          <button className="flex items-center" onClick={() => requestSort("code")}>
                            Course Code {getSortIcon("code")}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-navy dark:text-white">
                          <button className="flex items-center" onClick={() => requestSort("name")}>
                            Course Name {getSortIcon("name")}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-navy dark:text-white">
                          <button className="flex items-center" onClick={() => requestSort("gpa")}>
                            Avg. GPA {getSortIcon("gpa")}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-navy dark:text-white">
                          <button className="flex items-center" onClick={() => requestSort("enrollment")}>
                            Enrollment {getSortIcon("enrollment")}
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <tr
                            key={course.id}
                            className="border-t hover:bg-brand-navy/5 dark:hover:bg-blue-400/5 transition-colors duration-200"
                          >
                            <td className="px-4 py-3 text-sm font-medium">
                              <a
                                href={`/schools/queens/${course.course_code.replace(/\s+/g, "-").toLowerCase()}`}
                                className="text-brand-red hover:underline"
                              >
                                {course.course_code}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-sm">{course.course_name}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`font-medium ${getGpaColor(course.averageGPA)}`}>
                                {course.averageGPA > 0 ? course.averageGPA.toFixed(1) : "N/A"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center">
                                {course.totalEnrollment > 0 ? (
                                  <>
                                    <div className="w-16 bg-muted rounded-full h-2 mr-2">
                                      <div
                                        className="bg-brand-navy dark:bg-blue-400 rounded-full h-2"
                                        style={{ width: `${Math.min((course.totalEnrollment / 600) * 100, 100)}%` }}
                                      />
                                    </div>
                                    {Math.round(course.totalEnrollment)}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                            No courses found matching your filters. Try adjusting your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm px-6 py-4 text-sm text-muted-foreground border-t border-white/60 dark:border-white/5 flex flex-col lg-filters:flex-row justify-between items-center gap-4">
                  <div>
                    Showing {courses.length > 0 ? (currentPage - 1) * coursesPerPage + 1 : 0}–{Math.min(currentPage * coursesPerPage, total)} of {total} courses
                  </div>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="glass-btn border-0 text-brand-navy dark:text-white hover:bg-white/30"
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
                        className="glass-btn border-0 text-brand-navy dark:text-white hover:bg-white/30"
                      >
                        Next
                      </Button>
                    </div>
                  )}

                  <div className="text-xs bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full">
                    <strong>Note:</strong> GPA is calculated on a 4.3 scale
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-6 glass-card-deep rounded-xl relative overflow-hidden">
              <h3 className="text-lg font-bold text-brand-navy dark:text-white mb-3">Need Help Choosing?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our AI assistant can provide personalized course recommendations based on your interests, learning
                style, and academic goals.
              </p>
              <Button
                asChild
                className="liquid-btn-red border-0 text-white"
              >
                <a href="/queens-answers">Ask AI Assistant</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
