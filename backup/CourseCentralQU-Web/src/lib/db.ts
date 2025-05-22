import { getSupabaseClient } from "./supabase/client"
import type { Course, GradeDistribution, CourseWithStats } from "@/types"

// Always use real Supabase data, never mock data
export let isUsingMockData = false;

// Helper function to safely convert a database row to a GradeDistribution
function toGradeDistribution(row: any): GradeDistribution {
  return {
    id: Number(row.id) || 0,
    course_id: String(row.course_id) || "",
    term: String(row.term) || "",
    enrollment: Number(row.enrollment) || 0,
    average_gpa: Number(row.average_gpa) || 0,
    grade_counts: Array.isArray(row.grade_counts) ? row.grade_counts : []
  };
}

// Fetch all courses with statistics
export async function getAllCourses(): Promise<CourseWithStats[]> {
  try {
    console.log("Getting Supabase client...");
    const supabase = getSupabaseClient();
    console.log("Fetching courses from Supabase...");
    
    // Get all distributions first (they're usually fewer than courses)
    const { data: distributionsData, error: distError } = await supabase
      .from('course_distributions')
      .select('*');

    if (distError) {
      console.error('Error fetching distributions:', distError);
      return [];
    }

    console.log(`Successfully fetched ${distributionsData?.length || 0} distributions`);
    
    // Create a map of course IDs to their distributions for faster lookup
    const distributionsByCourseId = new Map<string, any[]>();
    distributionsData?.forEach(dist => {
      const courseId = String(dist.course_id);
      if (!distributionsByCourseId.has(courseId)) {
        distributionsByCourseId.set(courseId, []);
      }
      distributionsByCourseId.get(courseId)?.push(dist);
    });
    
    // Now get all courses
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('*');

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return [];
    }

    console.log(`Successfully fetched ${coursesData?.length || 0} courses`);
    
    // Map courses with their distributions
    const coursesWithStats: CourseWithStats[] = coursesData.map((course: any) => {
      const courseId = String(course.id);
      const courseDistributionsData = distributionsByCourseId.get(courseId) || [];
      const courseDistributions = courseDistributionsData.map(toGradeDistribution);
        
      // Calculate average GPA and enrollment
      const totalGPA = courseDistributions.reduce(
        (sum, dist) => sum + dist.average_gpa, 
        0
      );
      const totalEnrollment = courseDistributions.reduce(
        (sum, dist) => sum + dist.enrollment, 
        0
      );
      
      const averageGPA = courseDistributions.length > 0 ? totalGPA / courseDistributions.length : 0;
      const avgEnrollment = courseDistributions.length > 0 ? totalEnrollment / courseDistributions.length : 0;

      return {
        id: String(course.id || ""),
        course_code: String(course.course_code || ""),
        course_name: String(course.course_name || ""),
        description: course.course_description ? String(course.course_description) : undefined,
        credits: Number(course.course_units || 0),
        department: String(course.offering_faculty || ""),
        distributions: courseDistributions,
        averageGPA,
        totalEnrollment: avgEnrollment
      };
    });
    
    // Filter out courses with no valid data (no distributions or GPA <= 0)
    const validCourses = coursesWithStats.filter(course => 
      course.distributions.length > 0 && course.averageGPA > 0
    );
    
    console.log(`Filtered to ${validCourses.length} courses with valid GPA data`);
    
    return validCourses;
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    return [];
  }
}

// Get a single course by code
export async function getCourseByCode(courseCode: string): Promise<CourseWithStats | null> {
  try {
    const supabase = getSupabaseClient();
    
    // First get the course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('course_code', courseCode)
      .single();
    
    if (courseError || !courseData) {
      console.error(`Error fetching course with code ${courseCode}:`, courseError);
      return null;
    }

    console.log(`Found course with ID: ${courseData.id}`);

    // Convert course ID to string explicitly for the join
    const courseId = String(courseData.id);

    // Then get its distributions
    const { data: distributionsData, error: distError } = await supabase
      .from('course_distributions')
      .select('*')
      .eq('course_id', courseId)
      .order('term', { ascending: false });
    
    if (distError) {
      console.error(`Error fetching distributions for course ${courseCode}:`, distError);
      console.error(`Course ID used for query: ${courseId}`);
      return null;
    }

    console.log(`Found ${distributionsData?.length || 0} distributions for course ${courseCode}`);

    // Convert distributions to the correct type
    const distributions = (distributionsData || []).map(toGradeDistribution);

    // Calculate averages
    const totalGPA = distributions.reduce(
      (sum, dist) => sum + dist.average_gpa, 
      0
    );
    const totalEnrollment = distributions.reduce(
      (sum, dist) => sum + dist.enrollment, 
      0
    );
    const averageGPA = distributions.length > 0 ? totalGPA / distributions.length : 0;
    const avgEnrollment = distributions.length > 0 ? totalEnrollment / distributions.length : 0;

    // Combine into a CourseWithStats object
    const courseWithStats: CourseWithStats = {
      id: String(courseData.id),
      course_code: String(courseData.course_code),
      course_name: String(courseData.course_name),
      description: courseData.course_description ? String(courseData.course_description) : undefined,
      credits: Number(courseData.course_units || 0),
      department: String(courseData.offering_faculty || ""),
      distributions,
      averageGPA,
      totalEnrollment: avgEnrollment
    };
    
    return courseWithStats;
  } catch (error) {
    console.error(`Error in getCourseByCode:`, error);
    return null;
  }
}

export async function getCourseDistributions(courseId: string, term: string): Promise<GradeDistribution | null> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('course_distributions')
      .select('*')
      .eq('course_id', courseId)
      .eq('term', term)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching grade distribution for course ${courseId}, term ${term}:`, error);
      return null;
    }
    
    return toGradeDistribution(data);
  } catch (error) {
    console.error(`Error in getCourseDistributions:`, error);
    return null;
  }
}

export async function searchCourses(query: string): Promise<CourseWithStats[]> {
  try {
    const supabase = getSupabaseClient();
    
    // Filter courses by the search query
    const allCourses = await getAllCourses();
    
    if (!query) return allCourses;
    
    const lowerQuery = query.toLowerCase();
    return allCourses.filter(course => 
      course.course_code.toLowerCase().includes(lowerQuery) ||
      course.course_name.toLowerCase().includes(lowerQuery) ||
      (course.description && course.description.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error("Error in searchCourses:", error);
    return [];
  }
}

// Debug function to inspect database structure
export async function debugDatabaseStructure(): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    
    // Get course_distributions structure
    const { data: distData, error: distError } = await supabase
      .from('course_distributions')
      .select('*')
      .limit(1);
      
    if (distError) {
      console.error("Error getting course_distributions:", distError);
    } else if (distData && distData.length > 0) {
      console.log("course_distributions fields:", Object.keys(distData[0]));
      console.log("course_distributions sample:", distData[0]);
    }
    
    // Get courses structure
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
      
    if (courseError) {
      console.error("Error getting courses:", courseError);
    } else if (courseData && courseData.length > 0) {
      console.log("courses fields:", Object.keys(courseData[0]));
      console.log("courses sample:", courseData[0]);
    }
  } catch (e) {
    console.error("Exception in debugDatabaseStructure:", e);
  }
}
<<<<<<< HEAD
=======

// Function to fetch Reddit comments for a course
export async function getRedditCommentsForCourse(courseCode: string): Promise<any[]> {
  try {
    // Using raw SQL query exactly as specified
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, tags, upvotes, sentiment_label')
      .eq('course_code', courseCode)
      .eq('SOURCE', 'reddit') // Changed from 'source' to 'SOURCE' (uppercase)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching Reddit comments for course ${courseCode}:`, error);
      console.error("SQL query error details:", JSON.stringify(error));
      return [];
    }

    console.log(`Retrieved ${data?.length || 0} Reddit comments for ${courseCode}`);
    return data || [];
  } catch (e) {
    console.error(`Exception in getRedditCommentsForCourse for ${courseCode}:`, e);
    return [];
  }
}

// Function to fetch RateMyProf comments for a course
export async function getRateMyProfCommentsForCourse(courseCode: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, sentiment_label, tags, quality_rating, difficulty_rating')
      .eq('course_code', courseCode)
      .eq('SOURCE', 'ratemyprofessors') // Changed from 'ratemyprof' to 'ratemyprofessors'
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching RateMyProf comments for course ${courseCode}:`, error);
      console.error("SQL query error details:", JSON.stringify(error));
      return [];
    }

    console.log(`Retrieved ${data?.length || 0} RateMyProf comments for ${courseCode}`);
    return data || [];
  } catch (e) {
    console.error(`Exception in getRateMyProfCommentsForCourse for ${courseCode}:`, e);
    return [];
  }
}

// Direct query approach for RateMyProf comments
export async function fetchRateMyProfCommentsDirect(courseCode: string): Promise<any[]> {
  try {
    // This is the exact query as specified by the user
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, sentiment_label, tags, quality_rating, difficulty_rating')
      .filter('course_code', 'eq', courseCode)
      .filter('SOURCE', 'eq', 'ratemyprofessors')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Direct query error for RateMyProf ${courseCode}:`, error);
      return [];
    }

    console.log(`Direct query found ${data?.length || 0} RateMyProf results`);
    return data || [];
  } catch (e) {
    console.error(`Exception in fetchRateMyProfCommentsDirect for ${courseCode}:`, e);
    return [];
  }
}

// Function to directly execute the raw SQL query for Reddit comments
export async function getRedditCommentsRawSQL(courseCode: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.rpc('get_reddit_comments', { course_code_param: courseCode });

    if (error) {
      console.error(`Error executing raw SQL for Reddit comments for ${courseCode}:`, error);
      
      // Fallback to direct SQL query without the RPC
      const query = `
        SELECT text, professor_name, source_url, tags, upvotes, sentiment_label
        FROM rag_chunks
        WHERE course_code = '${courseCode}' AND SOURCE = 'reddit'
        ORDER BY created_at DESC
      `;
      
      const { data: sqlData, error: sqlError } = await supabase.rpc('execute_sql', { query_text: query });
      
      if (sqlError) {
        console.error("Error with fallback SQL:", sqlError);
        return [];
      }
      
      console.log("Raw SQL results:", sqlData);
      return sqlData || [];
    }

    return data || [];
  } catch (e) {
    console.error(`Exception in getRedditCommentsRawSQL for ${courseCode}:`, e);
    return [];
  }
}

// Direct SQL query approach for Reddit comments
export async function fetchRedditCommentsDirect(courseCode: string): Promise<any[]> {
  try {
    // This is the exact query as specified by the user
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, tags, upvotes, sentiment_label')
      .filter('course_code', 'eq', courseCode)
      .filter('SOURCE', 'eq', 'reddit')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Direct query error for ${courseCode}:`, error);
      return [];
    }

    console.log(`Direct query found ${data?.length || 0} results`);
    return data || [];
  } catch (e) {
    console.error(`Exception in fetchRedditCommentsDirect for ${courseCode}:`, e);
    return [];
  }
}

// Function to execute raw SQL for RateMyProf comments
export async function getRateMyProfRawSQL(courseCode: string): Promise<any[]> {
  try {
    // Create the raw SQL query exactly as specified by the user
    const query = `
      SELECT text, professor_name, source_url, sentiment_label, tags, quality_rating, difficulty_rating
      FROM rag_chunks
      WHERE course_code = '${courseCode}' AND SOURCE = 'ratemyprofessors'
      ORDER BY created_at DESC
    `;
    
    // Try to execute the query using a stored procedure if available
    try {
      const { data, error } = await supabase.rpc('execute_sql', { query_text: query });
      
      if (!error && data && data.length > 0) {
        console.log(`Raw SQL found ${data.length} RateMyProf results`);
        return data;
      }
    } catch (rpcError) {
      console.error("RPC error:", rpcError);
      // Continue to fallback methods
    }
    
    // If RPC fails, try a more direct approach with the Supabase client
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, sentiment_label, tags, quality_rating, difficulty_rating')
      .eq('course_code', courseCode)
      .eq('SOURCE', 'ratemyprofessors')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Final attempt error for RateMyProf ${courseCode}:`, error);
      return [];
    }
    
    console.log(`Final attempt found ${data?.length || 0} RateMyProf results`);
    return data || [];
  } catch (e) {
    console.error(`Exception in getRateMyProfRawSQL for ${courseCode}:`, e);
    return [];
  }
} 
>>>>>>> 134683d55ecd0fb79c936d8a5917d4323cae77a7
