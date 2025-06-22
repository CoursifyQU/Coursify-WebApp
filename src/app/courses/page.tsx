import { createClient } from "@supabase/supabase-js"
import { CourseList } from "@/components/course-list"

// Server component to fetch courses
export default async function CoursesPage() {
  // Use environment variables for Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kpjnsppbmyfrchhbnnjd.supabase.co"
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key"
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      id,
      course_code,
      course_name,
      course_description,
      course_units,
      offering_faculty
    `)
    .order("course_code")

  if (error) {
    console.error("Error fetching courses:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Courses</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading courses. Please try again later.
        </div>
      </div>
    )
  }

  // Map database fields to component props
  const formattedCourses = courses?.map(course => ({
    id: course.id,
    code: course.course_code,
    name: course.course_name,
    description: course.course_description,
    credits: course.course_units,
    departments: { name: course.offering_faculty, code: "" },
    prerequisites: null,
    corequisites: null,
    course_levels: null
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Queen's University Courses</h1>
      {formattedCourses && formattedCourses.length > 0 ? (
        <CourseList courses={formattedCourses} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No courses found. Please check your database connection.
        </div>
      )}
    </div>
  )
}
