"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp, Filter, Search, SlidersHorizontal, X, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { getAllCourses } from "@/lib/db"
import type { CourseWithStats } from "@/types"
import { isUsingMockData } from "@/lib/db"

export default function QueensCourses() {
  const [courses, setCourses] = useState<CourseWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [gpaRange, setGpaRange] = useState([0, 4.3])
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [departmentOpen, setDepartmentOpen] = useState(false)
  const [levelOpen, setLevelOpen] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 50 // Show 50 courses per page

  // Fetch courses
  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      try {
        const fetchedCourses = await getAllCourses()
        setCourses(fetchedCourses)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Get unique departments for filter
  const departments = [...new Set(courses.map(course => course.department))].sort()
  
  // Extract course level from course code (e.g. "CISC 121" -> "100")
  const getCourseLevel = (courseCode: string) => {
    const match = courseCode.match(/\d+/)
    if (match && match[0]) {
      const levelNum = parseInt(match[0], 10)
      return Math.floor(levelNum / 100) * 100 + ""
    }
    return "100" // Default to 100 level if not found
  }
  
  const courseLevels = ["100", "200", "300", "400", "500"]

  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 })
  const isFiltersInView = useInView(filtersRef, { once: true, amount: 0.3 })
  const isTableInView = useInView(tableRef, { once: true, amount: 0.1 })

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    // Check if both code and name exist before calling toLowerCase()
    const matchesSearch = !searchTerm || (
      (course?.course_code?.toLowerCase?.() || "").includes(searchTerm.toLowerCase()) ||
      (course?.course_name?.toLowerCase?.() || "").includes(searchTerm.toLowerCase())
    )

    const level = getCourseLevel(course.course_code)
    const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(course.department)
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(level)
    const matchesGpa = course.averageGPA >= gpaRange[0] && course.averageGPA <= gpaRange[1]
    
    // Only show courses with valid GPA and distribution data
    const hasValidData = course.distributions.length > 0 && course.averageGPA > 0

    return matchesSearch && matchesDepartment && matchesLevel && matchesGpa && hasValidData
  })

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortConfig) return 0

    if (sortConfig.key === "code") {
      return sortConfig.direction === "ascending" 
        ? a.course_code.localeCompare(b.course_code) 
        : b.course_code.localeCompare(a.course_code)
    }

    if (sortConfig.key === "name") {
      return sortConfig.direction === "ascending" 
        ? a.course_name.localeCompare(b.course_name) 
        : b.course_name.localeCompare(a.course_name)
    }

    if (sortConfig.key === "gpa") {
      return sortConfig.direction === "ascending" 
        ? a.averageGPA - b.averageGPA 
        : b.averageGPA - a.averageGPA
    }

    if (sortConfig.key === "enrollment") {
      return sortConfig.direction === "ascending" 
        ? a.totalEnrollment - b.totalEnrollment 
        : b.totalEnrollment - a.totalEnrollment
    }

    return 0
  })

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
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
    setSelectedDepartments([])
    setSelectedLevels([])
    setGpaRange([0, 4.3])
    setSortConfig(null)
  }

  const toggleDepartment = (department: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(department) ? prev.filter((d) => d !== department) : [...prev, department],
    )
  }

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-gradient">
      {/* Custom animations */}
      <style jsx global>{`
        .mesh-gradient {
          background-color: hsla(0, 0%, 100%, 1);
          background-image:
            radial-gradient(at 21% 33%, hsla(225, 100%, 19%, 0.05) 0px, transparent 50%),
            radial-gradient(at 79% 76%, hsla(352, 71%, 54%, 0.05) 0px, transparent 50%),
            radial-gradient(at 96% 10%, hsla(43, 83%, 51%, 0.05) 0px, transparent 50%);
        }
        
        .card-hover-effect {
          transition: all 0.3s ease;
        }
        
        .card-hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .dot-pattern {
          background-image: radial-gradient(circle, #00305f 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .gradient-text {
          background: linear-gradient(-45deg, #00305f, #d62839, #efb215, #00305f);
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Display mock data notification */}
      {isUsingMockData && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 fixed top-4 right-4 z-50 max-w-md shadow-md rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                Using mock data. Please configure Supabase connection to use real data.
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  className="inline-flex bg-amber-100 text-amber-500 rounded-md p-1.5 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  onClick={() => {
                    const banner = document.querySelector('.bg-amber-100');
                    banner?.classList.add('hidden');
                  }}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple background elements instead of FloatingElements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00305f]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#efb215]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d62839]/5 rounded-full blur-3xl -top-10 -right-20"></div>
        <div className="absolute w-80 h-80 bg-[#00305f]/5 rounded-full blur-3xl -bottom-10 -left-20"></div>
        <div className="dot-pattern absolute inset-0 opacity-[0.08]"></div>
      </div>

      <div className="container py-12 px-4 md:px-6 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center md:text-left"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00305f]/10 mb-4">
            <span className="text-[#00305f] text-sm font-medium mr-2">Course Explorer</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d62839] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d62839]"></span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#00305f]">Queen's University</span> <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">
            Browse and filter through all courses offered at Queen's University. View grade distributions, enrollment
            data, and more to help you make informed course decisions.
          </p>
        </motion.div>

        <motion.div
          ref={filtersRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isFiltersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-6 mb-8"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by course code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#00305f]/20 focus:border-[#00305f] focus:ring-[#00305f]/20 transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden border-[#00305f] text-[#00305f] hover:bg-[#00305f]/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant={filteredCourses.length < courses.length ? "default" : "outline"}
              onClick={resetFilters}
              className={`whitespace-nowrap ${
                filteredCourses.length < courses.length
                  ? "bg-[#d62839] hover:bg-[#d62839]/90"
                  : "border-[#d62839] text-[#d62839] hover:bg-[#d62839]/10"
              }`}
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isFiltersInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`md:col-span-1 ${showFilters ? "block" : "hidden md:block"}`}
          >
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm card-hover-effect">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium flex items-center text-[#00305f]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="md:hidden">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Department Dropdown */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-[#00305f]">Department</label>
                  <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={departmentOpen}
                        className="w-full justify-between border-gray-200 hover:border-[#00305f] transition-colors duration-300"
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
                  <label className="text-sm font-medium mb-2 block text-[#00305f]">Course Level</label>
                  <Popover open={levelOpen} onOpenChange={setLevelOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={levelOpen}
                        className="w-full justify-between border-gray-200 hover:border-[#00305f] transition-colors duration-300"
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
                  <label className="text-sm font-medium mb-2 block text-[#00305f]">GPA Range</label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[0, 4.3]}
                      value={gpaRange}
                      onValueChange={setGpaRange}
                      max={4.3}
                      step={0.1}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm text-[#00305f]">
                      <span className="font-medium">{gpaRange[0].toFixed(1)}</span>
                      <span className="font-medium">{gpaRange[1].toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Min</span>
                      <span>Max</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-muted-foreground mb-2">Active Filters:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDepartments.map((dept) => (
                      <Badge
                        key={dept}
                        className="bg-[#00305f]/10 text-[#00305f] hover:bg-[#00305f]/20 flex items-center"
                      >
                        {dept}
                        <button
                          onClick={() => setSelectedDepartments(selectedDepartments.filter((d) => d !== dept))}
                          className="ml-1 hover:text-[#d62839]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedLevels.map((level) => (
                      <Badge
                        key={level}
                        className="bg-[#00305f]/10 text-[#00305f] hover:bg-[#00305f]/20 flex items-center"
                      >
                        {level}-Level
                        <button
                          onClick={() => setSelectedLevels(selectedLevels.filter((l) => l !== level))}
                          className="ml-1 hover:text-[#d62839]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {(gpaRange[0] > 0 || gpaRange[1] < 4.3) && (
                      <Badge className="bg-[#00305f]/10 text-[#00305f] hover:bg-[#00305f]/20 flex items-center">
                        GPA: {gpaRange[0].toFixed(1)} - {gpaRange[1].toFixed(1)}
                        <button onClick={() => setGpaRange([0, 4.3])} className="ml-1 hover:text-[#d62839]">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={tableRef}
            initial={{ opacity: 0, x: 20 }}
            animate={isTableInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-3"
          >
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00305f] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading course data...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#00305f]/5">
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#00305f]">
                          <button className="flex items-center" onClick={() => requestSort("code")}>
                            Course Code {getSortIcon("code")}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#00305f]">
                          <button className="flex items-center" onClick={() => requestSort("name")}>
                            Course Name {getSortIcon("name")}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#00305f]">
                          <button className="flex items-center" onClick={() => requestSort("gpa")}>
                            Avg. GPA {getSortIcon("gpa")}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#00305f]">
                          <button className="flex items-center" onClick={() => requestSort("enrollment")}>
                            Enrollment {getSortIcon("enrollment")}
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCourses.length > 0 ? (
                        // Calculate pagination
                        (() => {
                          const indexOfLastCourse = currentPage * coursesPerPage;
                          const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
                          const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
                          
                          return currentCourses.map((course, index) => (
                            <motion.tr
                              key={course.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.03 }}
                              className="border-t hover:bg-[#00305f]/5 transition-colors duration-200"
                            >
                              <td className="px-4 py-3 text-sm font-medium">
                                <a
                                  href={`/schools/queens/${course.course_code.replace(/\s+/g, "-").toLowerCase()}`}
                                  className="text-[#d62839] hover:underline"
                                >
                                  {course.course_code}
                                </a>
                              </td>
                              <td className="px-4 py-3 text-sm">{course.course_name}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`font-medium ${getGpaColor(course.averageGPA)}`}>
                                  {course.averageGPA.toFixed(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center">
                                  <div className="w-16 bg-muted rounded-full h-2 mr-2">
                                    <div
                                      className="bg-[#00305f] rounded-full h-2"
                                      style={{ width: `${(course.totalEnrollment / 600) * 100}%` }}
                                    />
                                  </div>
                                  {Math.round(course.totalEnrollment)}
                                </div>
                              </td>
                            </motion.tr>
                          ));
                        })()
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

                <div className="bg-[#00305f]/5 px-6 py-4 text-sm text-muted-foreground border-t flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    Showing {Math.min(currentPage * coursesPerPage, sortedCourses.length)} of {sortedCourses.length} filtered courses (from total {courses.length})
                  </div>
                  
                  {/* Pagination controls */}
                  {sortedCourses.length > coursesPerPage && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-[#00305f] text-[#00305f] hover:bg-[#00305f]/10"
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {Math.ceil(sortedCourses.length / coursesPerPage)}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedCourses.length / coursesPerPage)))}
                        disabled={currentPage >= Math.ceil(sortedCourses.length / coursesPerPage)}
                        className="border-[#00305f] text-[#00305f] hover:bg-[#00305f]/10"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-xs bg-[#efb215]/10 text-[#efb215] px-3 py-1 rounded-full">
                    <strong>Note:</strong> GPA is calculated on a 4.3 scale
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#00305f] mb-3">Need Help Choosing?</h3>
              <p className="text-gray-600 mb-4">
                Our AI assistant can provide personalized course recommendations based on your interests, learning
                style, and academic goals.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white"
              >
                <a href="/queens-answers">Ask AI Assistant</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
