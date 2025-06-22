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

export type CourseWithStats = Course & {
  distributions: GradeDistribution[];
  averageGPA: number;
  totalEnrollment: number;
};
