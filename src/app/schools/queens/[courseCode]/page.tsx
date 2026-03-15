'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, Cell,
} from 'recharts';
import { getCourseByCode } from '@/lib/db';
import type { CourseWithStats } from '@/types';
import { isUsingMockData } from "@/lib/db";
import { CourseComments } from "@/components/course-comments";

const GRADE_LABELS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

const GRADE_COLORS = {
  'A+': '#4CAF50', 'A': '#4CAF50', 'A-': '#8BC34A',
  'B+': '#CDDC39', 'B': '#CDDC39', 'B-': '#FFEB3B',
  'C+': '#FFC107', 'C': '#FFC107', 'C-': '#FF9800',
  'D+': '#FF5722', 'D': '#FF5722', 'D-': '#F44336',
  'F': '#D32F2F',
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseCode = params?.courseCode ? (params.courseCode as string).replace(/-/g, ' ').toUpperCase() : '';
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [course, setCourse] = useState<CourseWithStats | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseByCode(courseCode);
        if (!courseData) {
          setError(`Course ${courseCode} not found`);
          setLoading(false);
          return;
        }
        if (courseData.distributions && courseData.distributions.length > 0) {
          const uniqueDistributions = Array.from(
            new Map(courseData.distributions.map(dist => [dist.term, dist])).values()
          );
          courseData.distributions = uniqueDistributions;
          setSelectedTerm(uniqueDistributions[0].term);
        }
        setCourse(courseData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('An error occurred while fetching course data');
        setLoading(false);
      }
    };
    if (courseCode) fetchCourseData();
  }, [courseCode]);

  if (loading) return null;

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "rgba(255,255,255,0.9)" }}>
        <div className="text-center glass-card-deep rounded-2xl p-12">
          <h1 className="text-3xl font-bold text-[#d62839] mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find a course with code "{courseCode}".</p>
          <Link href="/schools/queens" className="px-6 py-3 bg-[#00305f] text-white rounded-xl hover:bg-[#002244] transition">
            Return to Courses List
          </Link>
        </div>
      </div>
    );
  }

  const selectedDistribution = course.distributions.find(dist => dist.term === selectedTerm);
  const hasDistributions = course.distributions && course.distributions.length > 0;
  const courseCodeParts = courseCode.split(' ');
  const department = courseCodeParts[0];

  const gradeDistributionData = selectedDistribution
    ? GRADE_LABELS.map((grade, index) => ({
        grade,
        count: selectedDistribution.grade_counts[index] || 0,
        fill: GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || '#ccc'
      }))
    : [];

  const termGpaData = hasDistributions
    ? course.distributions.map(dist => ({ term: dist.term, gpa: dist.average_gpa })).reverse()
    : [];

  const createDistributionBreakdown = (distribution: any) => {
    if (!distribution) return [];
    return [
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
      { label: 'F: ' + Math.round(distribution.grade_counts[12]) + '%', color: '#D32F2F' },
    ];
  };

  const facultyName = course.department?.replace(/^Offering Faculty:/, '') || 'Faculty of Arts and Science';

  return (
    <div className="relative min-h-screen overflow-hidden pb-16 pt-20" style={{
      backgroundColor: 'hsla(0,0%,100%,1)',
      backgroundImage: `
        radial-gradient(at 21% 33%, hsla(225,100%,19%,0.09) 0px, transparent 50%),
        radial-gradient(at 79% 76%, hsla(352,71%,54%,0.08) 0px, transparent 50%),
        radial-gradient(at 96% 10%, hsla(43,83%,51%,0.07) 0px, transparent 50%)
      `
    }}>
      <style jsx global>{`
        .glass-card-deep {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(28px) saturate(170%);
          -webkit-backdrop-filter: blur(28px) saturate(170%);
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow:
            0 8px 32px rgba(0,48,95,0.13),
            0 2px 8px rgba(0,48,95,0.07),
            inset 0 1px 0 rgba(255,255,255,0.95),
            inset 0 -1px 0 rgba(255,255,255,0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-card-deep:hover {
          transform: translateY(-3px);
          box-shadow:
            0 16px 48px rgba(0,48,95,0.17),
            0 4px 14px rgba(0,48,95,0.09),
            inset 0 1px 0 rgba(255,255,255,0.98),
            inset 0 -1px 0 rgba(255,255,255,0.35);
        }
        .glass-hero {
          background: rgba(0,48,95,0.82);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 24px 64px rgba(0,48,95,0.35),
            0 4px 16px rgba(0,48,95,0.2),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .stat-pill {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
        }
      `}</style>

      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d62839]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00305f]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#efb215]/6 rounded-full blur-3xl" />
      </div>

      {/* Mock data banner */}
      {isUsingMockData && (
        <div className="fixed top-4 right-4 z-50 max-w-md bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 shadow-md rounded-md">
          <p className="text-sm">Using mock data. Configure Supabase connection to use real data.</p>
        </div>
      )}

      {/* ── Hero Header ── */}
      <motion.div
        className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full pt-10 md:pt-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div className="glass-hero rounded-2xl overflow-hidden relative" variants={slideUp}>
          {/* Subtle light effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#d62839]/8 pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#0066CC]/15 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-20 w-48 h-48 bg-[#d62839]/10 -mb-20 blur-3xl pointer-events-none" />

          <div className="relative p-8 md:p-10">
            {/* Breadcrumb */}
            <motion.div
              className="flex items-center gap-2 mb-5"
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } } }}
            >
              <Link href="/schools/queens" className="text-white/60 hover:text-white/90 text-sm transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Courses
              </Link>
              <span className="text-white/30 text-sm">/</span>
              <span className="text-white/60 text-sm">{courseCode}</span>
            </motion.div>

            {/* Faculty badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } } }}
            >
              <span className="inline-block px-3 py-1 bg-[#d62839] text-white text-xs font-medium rounded-lg mb-4">
                {facultyName}
              </span>
            </motion.div>

            {/* Course code + name */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } } }}
            >
              {course.course_code}
            </motion.h1>
            <motion.h2
              className="text-xl md:text-2xl font-medium text-white/80 mb-6"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } } }}
            >
              {course.course_name}
            </motion.h2>

            {/* Description */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } } }}
            >
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Course Description</h3>
              </div>
              <div className="bg-white/8 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-white/85 text-sm leading-relaxed">
                  {course.description
                    ? (typeof course.description === 'string' ? course.description : String(course.description))
                    : 'No description available for this course.'}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Info Cards Row ── */}
      <motion.div
        className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full mt-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Course Details */}
          <motion.div className="glass-card-deep rounded-2xl p-6 flex flex-col" variants={slideUp}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#00305f]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#00305f]">Course Details</h3>
            </div>
            <ul className="space-y-2.5 flex-1">
              {[
                { label: 'Faculty', value: facultyName },
                { label: 'Credits', value: String(course.credits || 3) },
                { label: 'Available Terms', value: String(course.distributions?.length || 0) },
              ].map(({ label, value }) => (
                <li key={label} className="flex justify-between items-center p-2.5 rounded-xl bg-white/40 hover:bg-white/65 transition-colors">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm text-gray-900 font-medium text-right max-w-[60%] truncate">{value}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Prerequisites */}
          <motion.div className="glass-card-deep rounded-2xl p-6 flex flex-col" variants={slideUp}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#00305f]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#00305f]">Prerequisites</h3>
            </div>
            <div className="p-3.5 rounded-xl bg-white/40 text-gray-700 flex-1 flex items-start hover:bg-white/60 transition-colors">
              <p className="text-sm leading-relaxed text-gray-600">
                {course.description && course.description.toString().toLowerCase().includes('prerequisite')
                  ? course.description.toString().split(/\n/).find(line =>
                      line.toLowerCase().includes('prerequisite') || line.toLowerCase().includes('prereq')
                    )
                  : `Prerequisite Level 2 or above and a minimum grade of C- in ${department.toLowerCase()} 124.`}
              </p>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div className="glass-card-deep rounded-2xl p-6 flex flex-col" variants={slideUp}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#00305f]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#00305f]">Performance</h3>
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#00305f]">Average GPA</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    course.averageGPA >= 3.7 ? 'bg-green-100 text-green-800' :
                    course.averageGPA >= 3.0 ? 'bg-green-100 text-green-700' :
                    course.averageGPA >= 2.3 ? 'bg-yellow-100 text-yellow-800' :
                    course.averageGPA >= 1.7 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.averageGPA.toFixed(2)}
                  </span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-white/50">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(course.averageGPA / 4.3) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1.0</span>
                  <span>4.3</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/40 hover:bg-white/65 transition-colors">
                <span className="text-sm text-gray-500">Avg Enrollment</span>
                <span className="text-sm text-gray-900 font-medium">{Math.round(course.totalEnrollment)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Charts Section ── */}
      <motion.div
        className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* GPA Trend */}
        <motion.div className="glass-card-deep rounded-2xl p-5 flex flex-col" variants={slideUp}>
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#d62839] rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#00305f] leading-tight">GPA Trend</h3>
                <p className="text-xs text-gray-400">GPA across academic terms</p>
              </div>
            </div>
            <span className="text-[#00305f] text-xs px-3 py-1 rounded-full font-semibold bg-[#00305f]/8 border border-[#00305f]/15">
              {course.course_code}
            </span>
          </div>

          {hasDistributions ? (
            <div
              className="mt-4 rounded-xl overflow-hidden flex-1"
              style={{
                background: 'linear-gradient(160deg, rgba(0,48,95,0.04) 0%, rgba(76,175,80,0.06) 100%)',
                border: '1px solid rgba(255,255,255,0.7)',
              }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={termGpaData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
                  <defs>
                    <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.06)" />
                  <XAxis
                    dataKey="term"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    dy={6}
                  />
                  <YAxis
                    domain={[0, 4.3]}
                    ticks={[0, 1.0, 2.0, 3.0, 4.0]}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [value.toFixed(2), 'GPA']}
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 4px 20px rgba(0,48,95,0.12)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gpa"
                    stroke="#4CAF50"
                    strokeWidth={2.5}
                    fill="url(#gpaGradient)"
                    dot={{ fill: '#fff', stroke: '#4CAF50', strokeWidth: 2.5, r: 4 }}
                    activeDot={{ r: 6, fill: '#4CAF50', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 h-56 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.3)' }}>
              <p className="text-gray-400 text-sm">No historical GPA data available</p>
            </div>
          )}

          {/* Grade scale legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {[
              { label: 'A', range: '3.7–4.3', color: '#4CAF50' },
              { label: 'B', range: '2.7–3.3', color: '#CDDC39' },
              { label: 'C', range: '1.7–2.3', color: '#FF9800' },
              { label: 'D', range: '0.7–1.3', color: '#FF5722' },
              { label: 'F', range: '<0.7', color: '#D32F2F' },
            ].map(({ label, range, color }) => (
              <div key={label} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white/50 border border-white/70">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="text-gray-400">{range}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div className="glass-card-deep rounded-2xl p-5 flex flex-col" variants={slideUp}>
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#d62839] rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#00305f] leading-tight">Grade Distribution</h3>
                <p className="text-xs text-gray-400">Percentage of students per grade</p>
              </div>
            </div>
            <select
              className="text-xs bg-white/60 backdrop-blur-sm border border-white/75 rounded-full px-3 py-1.5 text-[#00305f] font-semibold focus:outline-none focus:ring-2 focus:ring-[#00305f]/20 cursor-pointer"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {course.distributions?.map(dist => (
                <option key={dist.term} value={dist.term}>{dist.term}</option>
              ))}
            </select>
          </div>

          {hasDistributions && selectedDistribution ? (
            <>
              <div
                className="mt-4 rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(160deg, rgba(214,40,57,0.03) 0%, rgba(0,48,95,0.04) 100%)',
                  border: '1px solid rgba(255,255,255,0.7)',
                }}
              >
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart key={`chart-${selectedTerm}`} data={gradeDistributionData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis
                      dataKey="grade"
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                      dy={4}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                      width={28}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <RechartsTooltip
                      formatter={(value) => [`${value}%`, 'Students']}
                      labelFormatter={(label) => `Grade ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 4px 20px rgba(0,48,95,0.12)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Students" animationDuration={1200} radius={[4, 4, 0, 0]}>
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                <div className="bg-white/45 border border-white/65 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Avg GPA</div>
                  <div className="text-base font-bold text-green-600">{selectedDistribution.average_gpa.toFixed(2)}</div>
                </div>
                <div className="bg-white/45 border border-white/65 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Enrollment</div>
                  <div className="text-base font-bold text-[#00305f]">{selectedDistribution.enrollment}</div>
                </div>
                <div className="bg-white/45 border border-white/65 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Term</div>
                  <div className="text-base font-bold text-[#00305f]">{selectedDistribution.term}</div>
                </div>
              </div>

              {/* Grade breakdown grid */}
              <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                {createDistributionBreakdown(selectedDistribution).map((item, index) => (
                  <div key={index} className="flex items-center gap-1 bg-white/50 px-2 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600 truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 h-56 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.3)' }}>
              <p className="text-gray-400 text-sm">No grade distribution data available</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ── Student Comments ── */}
      <CourseComments courseCode={courseCode} />
    </div>
  );
}
