// Course Types
export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  description?: string;
  credits: number;
  department: string;
  average_gpa?: number;
  average_enrollment?: number;
}

export interface CourseDetail extends Course {
  description: string
  terms: string[]
  gpaByTerm: Record<string, number>
  enrollmentByTerm: Record<string, number>
  gradeDistribution: Record<string, Record<string, number>>
}

// Grade Distribution Types
export interface GradeDistribution {
  id: number;
  course_id: string;
  term: string;
  enrollment: number;
  average_gpa: number;
  grade_counts: number[]; // Array of grade percentages
}

export interface GradeSummary {
  category: string
  count: number
  percentage: number
}

// Chat Types
export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

/** Grade stats (GPA) vs reviews-only vs nothing in catalog/list APIs */
export type CourseDataAvailability = "none" | "comments" | "data"

export type CourseWithStats = Course & {
  distributions: GradeDistribution[];
  averageGPA: number;
  totalEnrollment: number;
  hasComments?: boolean;
  dataAvailability?: CourseDataAvailability;
};

// Server-side pagination types
export interface CoursePageParams {
  page?: number;
  limit?: number;
  search?: string;
  departments?: string[];
  levels?: string[];
  subjects?: string[];
  gpaMin?: number;
  gpaMax?: number;
  enrollmentMin?: number;
  enrollmentMax?: number;
  sortBy?: "code" | "name" | "gpa" | "enrollment" | "availability";
  sortDir?: "asc" | "desc";
  hasData?: boolean;
  /** When set, only these tiers (empty = both). Values: data | comments */
  availability?: ("data" | "comments")[];
}

export interface CoursePageResult {
  courses: CourseWithStats[];
  total: number;
  page: number;
  totalPages: number;
}

// PDF Upload Types
export interface ParsedCourseRow {
  course_code: string;
  description: string;
  enrollment: number;
  grade_percentages: number[];
  computed_gpa: number;
}

export interface UploadDistributionResponse {
  success: boolean;
  term?: string;
  inserted: number;
  skipped: string[];
  duplicates: string[];
  errors: string[];
  contributionCount?: number;
}
