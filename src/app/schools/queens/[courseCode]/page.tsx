'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { getCourseByCode } from '@/lib/db';
import type { CourseWithStats } from '@/types';
import { isUsingMockData } from "@/lib/db";

// Grade labels
const GRADE_LABELS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

// Color mapping for grades
const GRADE_COLORS = {
  'A+': '#4CAF50', 'A': '#4CAF50', 'A-': '#8BC34A',
  'B+': '#CDDC39', 'B': '#CDDC39', 'B-': '#FFEB3B',
  'C+': '#FFC107', 'C': '#FFC107', 'C-': '#FF9800',
  'D+': '#FF5722', 'D': '#FF5722', 'D-': '#F44336',
  'F': '#D32F2F',
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseCode = params?.courseCode ? (params.courseCode as string).replace(/-/g, ' ').toUpperCase() : '';
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [course, setCourse] = useState<CourseWithStats | null>(null);
  
  // Fetch data from Supabase
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Fetch course data
        const courseData = await getCourseByCode(courseCode);
        if (!courseData) {
          setError(`Course ${courseCode} not found`);
          setLoading(false);
          return;
        }
        
        setCourse(courseData);
        
        // Set default selected term to the most recent
          if (courseData.distributions && courseData.distributions.length > 0) {
          setSelectedTerm(courseData.distributions[0].term);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('An error occurred while fetching course data');
        setLoading(false);
      }
    };

    if (courseCode) {
      fetchCourseData();
    }
  }, [courseCode]);

  // Skip loading screen and render immediately
  if (loading) {
    return null;
  }

  // If course doesn't exist, show an error
  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find a course with code "{courseCode}".</p>
          <Link 
          href="/schools/queens" 
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
            Return to Courses List
          </Link>
        </div>
      </div>
    );
  }
  
  // Find the distribution for the selected term
  const selectedDistribution = course.distributions.find(dist => dist.term === selectedTerm);
  
  // Check if course has distributions
  const hasDistributions = course.distributions && course.distributions.length > 0;

  // Calculate course code parts
  const courseCodeParts = courseCode.split(' ');
  const department = courseCodeParts[0];
  
  // Format GPA
  const formatGPA = (gpa: number) => gpa.toFixed(2);

  // Prepare grade distribution data for charts
  const gradeDistributionData = selectedDistribution 
    ? GRADE_LABELS.map((grade, index) => ({
        grade,
        count: selectedDistribution.grade_counts[index] || 0,
        fill: GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || '#ccc'
      }))
    : [];

  // Calculate term GPA trend
  const termGpaData = hasDistributions 
    ? course.distributions.map(dist => ({
    term: dist.term,
    gpa: dist.average_gpa,
        fill: '#4CAF50'
  })).reverse()
    : [];

  // Helper function to create grade distribution breakdown
  const createDistributionBreakdown = (distribution: any) => {
    if (!distribution) return [];
    
    const breakdown = [
      { label: 'A+: ' + Math.round(distribution.grade_counts[0]) + '%', color: '#4CAF50' },
      { label: 'A: ' + Math.round(distribution.grade_counts[1]) + '%', color: '#4CAF50' },
      { label: 'A-: ' + Math.round(distribution.grade_counts[2]) + '%', color: '#8BC34A' },
      { label: 'B+: ' + Math.round(distribution.grade_counts[3]) + '%', color: '#CDDC39' },
      { label: 'B: ' + Math.round(distribution.grade_counts[4]) + '%', color: '#CDDC39' },
      { label: 'B-: ' + Math.round(distribution.grade_counts[5]) + '%', color: '#FFEB3B' },
      { label: 'C+: ' + Math.round(distribution.grade_counts[6]) + '%', color: '#FFC107' },
      { label: 'C: ' + Math.round(distribution.grade_counts[7]) + '%', color: '#FFC107' },
      { label: 'C-: ' + Math.round(distribution.grade_counts[8]) + '%', color: '#FF9800' },
      { label: 'D+: ' + Math.round(distribution.grade_counts[9]) + '%', color: '#FF5722' },
      { label: 'D: ' + Math.round(distribution.grade_counts[10]) + '%', color: '#F44336' },
      { label: 'D-: ' + Math.round(distribution.grade_counts[11]) + '%', color: '#E91E63' },
      { label: 'F: ' + Math.round(distribution.grade_counts[12]) + '%', color: '#D32F2F' }
    ];
    
    return breakdown;
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-10">
      {/* Custom styling */}
      <style jsx global>{`
        .card-hover-effect {
          transition: all 0.3s ease;
        }
        
        .card-hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
      
      {/* Mock data notification */}
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
      
            <motion.div         className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full pt-10 md:pt-16"        initial="hidden"        animate="visible"        variants={fadeIn}      >        {/* Header Banner - Rounded edges */}        <motion.div           className="bg-[#003B71] shadow-lg py-8 px-8 text-white overflow-hidden relative rounded-xl"          variants={slideUp}        >          {/* Light effect from right side */}          <div className="absolute inset-0 bg-gradient-to-r from-transparent from-40% via-[#003B71]/70 to-[#0066CC]/50 pointer-events-none"></div>                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#004F99] rounded-full opacity-10 -mr-16 -mt-16 blur-3xl"></div>          <div className="absolute bottom-0 left-20 w-40 h-40 bg-[#0066CC] rounded-full opacity-10 -mb-20 blur-3xl"></div>                    <motion.div            variants={{              hidden: { opacity: 0, x: -20 },              visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 }}            }}          >            <span className="inline-block px-3 py-1 bg-[#d62839] text-white text-sm font-medium rounded-md mb-2">              {course.department?.replace(/^Offering Faculty:/, '') || 'Faculty of Arts and Science'}            </span>          </motion.div>                    <motion.h1             className="text-4xl font-bold mb-1 flex items-center"            variants={{              hidden: { opacity: 0, y: 10 },              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 }}            }}          >            {course.course_code}          </motion.h1>                    <motion.h2             className="text-2xl font-medium text-white/90 mb-6"            variants={{              hidden: { opacity: 0, y: 10 },              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 }}            }}          >            {course.course_name}          </motion.h2>                    <motion.div            variants={{              hidden: { opacity: 0, y: 20 },              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 }}            }}          >            <h3 className="text-lg font-medium text-white mb-1 flex items-center">              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />              </svg>              Course Description            </h3>            <div className="text-white/90 backdrop-blur-sm bg-[#002D5A]/30 p-4 rounded-lg border border-white/10">              {course.description ? (                <p className="text-white/95">                  {typeof course.description === 'string' ? course.description : String(course.description)}                </p>              ) : (                <p className="text-white/80">No description available for this course.</p>              )}            </div>          </motion.div>        </motion.div>      </motion.div>
      
            {/* Content - Course Details */}      <motion.div         className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full mt-12"        initial="hidden"        animate="visible"        variants={staggerContainer}      >        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">          {/* Course Details Card */}          <motion.div             className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative"            variants={slideUp}          >            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300"></div>            <h3 className="text-lg font-semibold mb-4 text-[#00305f] flex items-center">              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />              </svg>              Course Details            </h3>            <ul className="space-y-3 flex-1">              <motion.li                 className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150"                variants={{                  hidden: { opacity: 0, x: -10 },                  visible: { opacity: 1, x: 0, transition: { duration: 0.3 }}                }}              >                <span className="text-gray-500">Faculty:</span>                <span className="text-gray-900 font-medium">{course.department?.replace(/^Offering Faculty:/, '') || 'Faculty of Arts and Science'}</span>              </motion.li>              <motion.li                 className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150"                variants={{                  hidden: { opacity: 0, x: -10 },                  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 }}                }}              >                <span className="text-gray-500">Credits:</span>                <span className="text-gray-900 font-medium">{course.credits || 3}</span>              </motion.li>              <motion.li                 className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150"                variants={{                  hidden: { opacity: 0, x: -10 },                  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.2 }}                }}              >                <span className="text-gray-500">Available Terms:</span>                <span className="text-gray-900 font-medium">{course.distributions?.length || 0}</span>              </motion.li>            </ul>          </motion.div>          {/* Prerequisites Card */}          <motion.div             className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative"            variants={slideUp}          >            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300"></div>            <h3 className="text-lg font-semibold mb-4 text-[#00305f] flex items-center">              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />              </svg>              Prerequisites            </h3>            <motion.div               className="p-3 rounded-lg bg-gray-50 text-gray-700 flex-1 flex items-center justify-center hover:bg-gray-100 transition-all duration-300"              variants={{                hidden: { opacity: 0, scale: 0.95 },                visible: { opacity: 1, scale: 1, transition: { duration: 0.4 }}              }}            >              {course.description && course.description.toString().toLowerCase().includes('prerequisite') ? (                <p className="text-gray-700">                  {course.description.toString().split(/\n/).find(line =>                     line.toLowerCase().includes('prerequisite') ||                     line.toLowerCase().includes('prereq')                  )}                </p>              ) : (                <p className="text-gray-500">                  Prerequisite Level 2 or above and a minimum grade of a C- (obtained in any term) or a 'Pass' (obtained in Winter 2020) in {department.toLowerCase()} 124.                </p>              )}            </motion.div>          </motion.div>          {/* Performance Metrics Card */}          <motion.div             className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative"            variants={slideUp}          >            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300"></div>            <h3 className="text-lg font-semibold mb-4 text-[#00305f] flex items-center">              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />              </svg>              Performance Metrics            </h3>            <div className="space-y-4 flex-1">              <motion.div                 className="relative pt-1"                variants={{                  hidden: { opacity: 0 },                  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 }}                }}              >                <div className="flex items-center justify-between mb-1">                  <div>                    <span className="text-xs font-semibold inline-block text-[#00305f]">Average GPA</span>                  </div>                  <div>                    <span className={`text-xs font-bold inline-block px-2 py-1 rounded-full uppercase ${                      course.averageGPA >= 3.7 ? 'bg-green-100 text-green-800' :                      course.averageGPA >= 3.0 ? 'bg-green-100 text-green-700' :                      course.averageGPA >= 2.3 ? 'bg-yellow-100 text-yellow-800' :                      course.averageGPA >= 1.7 ? 'bg-orange-100 text-orange-800' :                      'bg-red-100 text-red-800'                    }`}>                      {course.averageGPA.toFixed(2)}                    </span>                  </div>                </div>                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-gray-200">                  <motion.div                     style={{ width: `${(course.averageGPA / 4.3) * 100}%` }}                     className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full"                    initial={{ width: 0 }}                    animate={{ width: `${(course.averageGPA / 4.3) * 100}%` }}                    transition={{ duration: 1, delay: 0.5 }}                  ></motion.div>                </div>                <div className="flex justify-between text-xs text-gray-400">                  <span>1.0</span>                  <span>4.3</span>                </div>              </motion.div>                            <motion.div                 className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"                variants={{                  hidden: { opacity: 0, y: 10 },                  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.4 }}                }}              >                <span className="text-gray-500">Average Enrollment:</span>                <span className="text-gray-900 font-medium">{Math.round(course.totalEnrollment)}</span>              </motion.div>            </div>          </motion.div>        </motion.div>      </motion.div>
      
            {/* GPA Analytics Section */}      <motion.div         className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"        initial="hidden"        animate="visible"        variants={staggerContainer}      >        <motion.div           className="bg-white rounded-xl shadow-md border border-gray-100 p-4"          variants={slideUp}        >          <div className="flex items-center mb-2">            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-2">              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />              </svg>            </div>            <h3 className="text-lg font-semibold text-[#00305f]">GPA Analytics</h3>            <span className="ml-auto text-[#00305f] text-sm px-3 py-1.5 rounded-full font-medium bg-gradient-to-r from-[#efb215] to-[#f5d76e] shadow-sm">{course.course_code}</span>          </div>                    <p className="text-sm text-gray-500 mb-2">Historical GPA trends across academic terms</p>                    {hasDistributions ? (            <motion.div               className="h-56 bg-gray-50 p-2 rounded-lg"              variants={{                hidden: { opacity: 0, y: 20 },                visible: { opacity: 1, y: 0, transition: { duration: 0.5 }}              }}            >              <div className="text-center text-xs font-semibold text-gray-500 mb-1">Term GPA Evolution</div>              <ResponsiveContainer width="100%" height="92%">                <LineChart data={termGpaData} margin={{ top: 10, right: 5, left: 0, bottom: 15 }}>                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />                  <XAxis dataKey="term" angle={-45} textAnchor="end" tickMargin={10} label={{ value: 'Term', position: 'insideBottom', offset: -5 }} />                  <YAxis domain={[0, 4.0]} ticks={[0, 1.0, 2.0, 3.0, 4.0]} label={{ value: 'GPA', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />                  <RechartsTooltip                     contentStyle={{                       backgroundColor: 'rgba(255, 255, 255, 0.95)',                       borderRadius: '6px',                       border: 'none',                       boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'                     }}                   />                  <Line                     type="monotone"                     dataKey="gpa"                     stroke="#4CAF50"                     strokeWidth={2}                    dot={{ fill: '#4CAF50', r: 4 }}                    activeDot={{ r: 6, fill: '#4CAF50' }}                  />                </LineChart>              </ResponsiveContainer>            </motion.div>          ) : (            <motion.div               className="h-56 flex items-center justify-center bg-gray-50 rounded-lg"              variants={{                hidden: { opacity: 0 },                visible: { opacity: 1, transition: { duration: 0.5 }}              }}            >              <p className="text-gray-400">No historical GPA data available</p>            </motion.div>          )}                    <motion.div             className="mt-3"            variants={{              hidden: { opacity: 0 },              visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 }}            }}          >            <h4 className="text-xs font-medium text-gray-600 mb-2 text-center">Grade Scale Legend</h4>            <div className="flex flex-wrap justify-center gap-1.5">              <motion.div                 className="bg-gray-100 p-1 px-2 rounded-full text-xs flex items-center hover:bg-gray-200 transition-colors"                variants={{                  hidden: { opacity: 0, scale: 0.9 },                  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.4 }}                }}              >                <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></span>                <span>A (3.7-4.3)</span>              </motion.div>              <motion.div                 className="bg-gray-100 p-1 px-2 rounded-full text-xs flex items-center hover:bg-gray-200 transition-colors"                variants={{                  hidden: { opacity: 0, scale: 0.9 },                  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.45 }}                }}              >                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1"></span>                <span>B (2.7-3.3)</span>              </motion.div>              <motion.div                 className="bg-gray-100 p-1 px-2 rounded-full text-xs flex items-center hover:bg-gray-200 transition-colors"                variants={{                  hidden: { opacity: 0, scale: 0.9 },                  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.5 }}                }}              >                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1"></span>                <span>C (1.7-2.3)</span>              </motion.div>              <motion.div                 className="bg-gray-100 p-1 px-2 rounded-full text-xs flex items-center hover:bg-gray-200 transition-colors"                variants={{                  hidden: { opacity: 0, scale: 0.9 },                  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.55 }}                }}              >                <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span>                <span>D (0.7-1.3)</span>              </motion.div>              <motion.div                 className="bg-gray-100 p-1 px-2 rounded-full text-xs flex items-center hover:bg-gray-200 transition-colors"                variants={{                  hidden: { opacity: 0, scale: 0.9 },                  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.6 }}                }}              >                <span className="w-2.5 h-2.5 rounded-full bg-red-700 mr-1"></span>                <span>F (below 0.7)</span>              </motion.div>            </div>          </motion.div>          <motion.p             className="text-xs text-gray-400 mt-2 text-center"            variants={{              hidden: { opacity: 0 },              visible: { opacity: 1, transition: { duration: 0.5, delay: 0.7 }}            }}          >            * Hover over any dot to see detailed information          </motion.p>        </motion.div>
        
                {/* Grade Distribution Section */}        <motion.div           className="bg-white rounded-xl shadow-md border border-gray-100 p-4"          variants={slideUp}        >          <div className="flex items-center mb-2">            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-2">              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />              </svg>            </div>            <h3 className="text-lg font-semibold text-[#00305f]">Grade Distribution</h3>                        <motion.div               className="ml-auto"              variants={{                hidden: { opacity: 0, x: 10 },                visible: { opacity: 1, x: 0, transition: { duration: 0.4 }}              }}            >              <select                 className="text-sm border border-gray-300 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"                value={selectedTerm}                onChange={(e) => setSelectedTerm(e.target.value)}              >                {course.distributions?.map(dist => (                  <option key={dist.term} value={dist.term}>{dist.term}</option>                ))}              </select>            </motion.div>          </div>                                    {hasDistributions && selectedDistribution ? (            <>              <motion.div                 className="h-56 bg-gray-50 p-2 rounded-lg"                variants={{                  hidden: { opacity: 0, y: 20 },                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 }}                }}              >                <div className="text-center text-xs font-semibold text-gray-500 mb-1">Grade Distribution by Percentage</div>                <ResponsiveContainer width="100%" height="92%">                  <BarChart data={gradeDistributionData} margin={{ top: 10, right: 5, left: 0, bottom: 15 }}>                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />                    <XAxis dataKey="grade" label={{ value: 'Grade', position: 'insideBottom', offset: -5 }} />                    <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />                    <RechartsTooltip                       formatter={(value) => [`${value}%`, 'Students']}                       labelFormatter={(label) => `Grade: ${label}`}                      contentStyle={{                         backgroundColor: 'rgba(255, 255, 255, 0.95)',                         borderRadius: '6px',                         border: 'none',                         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'                       }}                     />                    <Bar dataKey="count" name="Students" animationDuration={1500}>                      {gradeDistributionData.map((entry, index) => (                        <Cell                           key={`cell-${index}`}                           fill={entry.fill}                          className="hover:opacity-90"                         />                      ))}                    </Bar>                  </BarChart>                </ResponsiveContainer>              </motion.div>                                        <motion.div                 className="mt-3 grid grid-cols-2 gap-4"                variants={{                  hidden: { opacity: 0 },                  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3, staggerChildren: 0.1 }}                }}              >                <motion.div                   className="bg-gray-50 rounded-xl shadow-sm p-4"                  variants={{                    hidden: { opacity: 0, scale: 0.95 },                    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 }}                  }}                >                  <h3 className="flex items-center text-blue-800 font-medium mb-3 text-sm">                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />                    </svg>                    Distribution Breakdown                  </h3>                  <motion.div                     className="grid grid-cols-3 gap-2"                    variants={{                      hidden: { opacity: 0 },                      visible: {                         opacity: 1,                        transition: {                           staggerChildren: 0.03,                          delayChildren: 0.1                        }                      }                    }}                  >                    {createDistributionBreakdown(selectedDistribution).map((item, index) => (                      <motion.div                         key={index}                         className="flex items-center bg-white p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer transform hover:scale-105 duration-200"                        variants={{                          hidden: { opacity: 0, y: 5 },                          visible: { opacity: 1, y: 0, transition: { duration: 0.2 }}                        }}                      >                        <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: item.color }}></span>                        <span className="text-xs font-medium">{item.label}</span>                      </motion.div>                    ))}                  </motion.div>                </motion.div>                                          <motion.div                   className="bg-gray-50 rounded-xl shadow-sm p-4"                  variants={{                    hidden: { opacity: 0, scale: 0.95 },                    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.1 }}                  }}                >                  <h3 className="flex items-center text-blue-800 font-medium mb-3 text-sm">                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />                    </svg>                    Term Insights                  </h3>                  <motion.div                     className="space-y-2"                    variants={{                      hidden: { opacity: 0 },                      visible: {                         opacity: 1,                        transition: {                           staggerChildren: 0.1,                          delayChildren: 0.2                        }                      }                    }}                  >                    <motion.div                       className="flex items-center justify-between border border-gray-200 bg-white rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer transform hover:scale-[1.02] duration-200"                      variants={{                        hidden: { opacity: 0, x: -10 },                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 }}                      }}                    >                      <div className="text-xs text-gray-500">Average GPA:</div>                      <div className="text-sm font-medium text-green-600">                        {formatGPA(selectedDistribution.average_gpa)} <span className="text-xs font-normal">(B)</span>                      </div>                    </motion.div>                    <motion.div                       className="flex items-center justify-between border border-gray-200 bg-white rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer transform hover:scale-[1.02] duration-200"                      variants={{                        hidden: { opacity: 0, x: -10 },                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 }}                      }}                    >                      <div className="text-xs text-gray-500">Enrollment:</div>                      <div className="text-sm font-medium">{selectedDistribution.enrollment}</div>                    </motion.div>                    <motion.div                       className="flex items-center justify-between border border-gray-200 bg-white rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer transform hover:scale-[1.02] duration-200"                      variants={{                        hidden: { opacity: 0, x: -10 },                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 }}                      }}                    >                      <div className="text-xs text-gray-500">Term:</div>                      <div className="text-sm font-medium">{selectedDistribution.term}</div>                    </motion.div>                  </motion.div>                </motion.div>              </motion.div>            </>          ) : (            <motion.div               className="h-56 flex items-center justify-center"              variants={{                hidden: { opacity: 0 },                visible: { opacity: 1, transition: { duration: 0.5 }}              }}            >              <p className="text-gray-400">No grade distribution data available</p>            </motion.div>          )}        </motion.div>      </motion.div>    </div>
  );
} 