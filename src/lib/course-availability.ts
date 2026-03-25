import type { CourseDataAvailability, CourseWithStats } from "@/types"

/** Grade/GPA data counts as full "data"; comments-only is a separate tier. */
export function computeDataAvailability(
  averageGpa: number,
  hasComments: boolean
): CourseDataAvailability {
  if (averageGpa > 0) return "data"
  if (hasComments) return "comments"
  return "none"
}

export function getCourseDataAvailability(course: CourseWithStats): CourseDataAvailability {
  return (
    course.dataAvailability ??
    computeDataAvailability(course.averageGPA, course.hasComments ?? false)
  )
}
