"use client"

<<<<<<< HEAD
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FloatingElements } from "@/components/floating-elements"
import {
  BookOpen,
  BarChart3,
  Brain,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Search,
  ArrowRight,
  Info,
  Star,
  Smartphone,
  RotateCcw,
  GraduationCap,
  Clock,
  Lightbulb,
  Zap,
  Users,
  Award,
  BarChart,
} from "lucide-react"
=======
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQAccordionItem from '@/components/FAQAccordionItem';
import FAQAccordionSection from '@/components/FAQAccordionSection';
>>>>>>> 134683d55ecd0fb79c936d8a5917d4323cae77a7

export default function Home() {
  const [hasSeenAnimation, setHasSeenAnimation] = useState(true)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  const isHeroInView = useInView(heroRef, { once: false, amount: 0.5 })
  const isFeaturesInView = useInView(featuresRef, { once: false, amount: 0.2 })
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.5 })
  const isTestimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.3 })
  const isFaqInView = useInView(faqRef, { once: false, amount: 0.3 })

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0)
    
    // Check if the user has seen the animation before
    const hasVisited = localStorage.getItem("hasSeenAIButtonAnimation")
    if (!hasVisited) {
      setHasSeenAnimation(false)
      // Set the flag in localStorage so animation only plays once
      localStorage.setItem("hasSeenAIButtonAnimation", "true")
    }

    setIsVisible(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleButtonHover = () => {
    if (!hasSeenAnimation) {
      setShouldAnimate(true)
      setHasSeenAnimation(true)
    }
  }

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const faqs = [
    {
      question: "Is CourseCentral connected to SOLUS?",
      answer:
        "CourseCentral is not officially connected to SOLUS, but we've collected grade distribution data from multiple reliable sources. You'll need to register for courses through SOLUS after researching them on our platform.",
    },
    {
      question: "Where does the chatbot get its information?",
      answer:
        "Our AI advisor is trained on thousands of student reviews from Queen's course catalogs, Reddit discussions, and RateMyProfessor reviews to provide you with comprehensive insights about courses and professors.",
    },
    {
      question: "How up-to-date is the grade data?",
      answer:
        "We update our database each semester with the latest grade distributions and course information to ensure you have access to the most current data for decision making.",
    },
    {
      question: "Is this tool free?",
      answer:
        "Yes, CourseCentral is completely free for all Queen's University students. We believe in making data-driven course selection accessible to everyone.",
    },
    {
      question: "What courses are supported?",
      answer:
        "Currently, CourseCentral only supports on-campus courses at Queen's University. We're working on adding support for online courses in the future, but for now, our data and AI assistant focus exclusively on in-person course offerings.",
    },
  ]

  const testimonials = [
    {
      quote:
        "The AI assistant recommended a professor whose teaching style matched how I learn. Best course experience I've had at Queen's!",
      name: "Queen's Engineering Student",
      program: "Class of 2024",
      initial: "E",
    },
    {
      quote: "The AI chatbot gave me insights about my professor's teaching style that I couldn't find anywhere else.",
      name: "Queen's Arts Student",
      program: "Class of 2026",
      initial: "A",
    },
    {
      quote:
        "Being able to see how course difficulty changed over different semesters helped me pick the best time to take COMM 151.",
      name: "Queen's Science Student",
      program: "Class of 2025",
      initial: "S",
    },
  ]

  const features = [
    {
      icon: <Brain className="h-7 w-7" />,
      title: "AI Course Assistant",
      description:
        "Our intelligent chatbot answers any question about Queen's courses, professors, and teaching styles instantly – like having a personal academic advisor.",
      color: "efb215",
    },
    {
      icon: <BookOpen className="h-7 w-7" />,
      title: "Real Grade Distributions",
      description:
        "Explore actual grade breakdowns across 10+ semesters to understand the true difficulty of any Queen's course.",
      color: "d62839",
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      title: "Course Analytics",
      description:
        "Visualize passing rates, grade averages, and enrollment trends to identify the most suitable courses for your goals.",
      color: "00305f",
    },
    {
      icon: <RotateCcw className="h-7 w-7" />,
      title: "Semester Tracking",
      description: "Compare how courses have evolved over time with historical course data going back to 2015.",
      color: "d62839",
    },
    {
      icon: <Smartphone className="h-7 w-7" />,
      title: "Mobile Access",
      description:
        "View course stats and chat with our AI assistant from any device — ideal for researching on the go.",
      color: "00305f",
    },
    {
      icon: <Star className="h-7 w-7" />,
      title: "Student-Powered Reviews",
      description:
        "See feedback based on student experiences pulled from Reddit and RateMyProfessor — filtered to be relevant to Queen's courses and instructors.",
      color: "efb215",
    },
  ]

  const stats = [
    { value: "500+", label: "Courses Tracked", icon: <BookOpen className="h-5 w-5" /> },
    { value: "10+", label: "Semesters of Data", icon: <Clock className="h-5 w-5" /> },
    { value: "50+", label: "Departments", icon: <GraduationCap className="h-5 w-5" /> },
    { value: "1000s", label: "Students Helped", icon: <Users className="h-5 w-5" /> },
  ]

  // Scroll to features section
  const handleScrollClick = () => {
    if (featuresRef.current) {
      const yOffset = -60;
      const element = featuresRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(214, 40, 57, 0.4)); }
          50% { filter: drop-shadow(0 0 20px rgba(214, 40, 57, 0.7)); }
        }
        
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 12s linear infinite;
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

        .moving-gradient {
          background: linear-gradient(-45deg, #00305f, #d62839, #efb215, #00305f);
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        
        .gradient-border {
          position: relative;
        }
        
        .gradient-border::before {
          content: "";
          position: absolute;
          inset: -2px;
          z-index: -1;
          background: linear-gradient(-45deg, #00305f, #d62839, #efb215, #00305f);
          background-size: 400% 400%;
          animation: gradient-shift 6s ease infinite;
          border-radius: inherit;
        }
        
        .mesh-gradient {
          background-color: hsla(0, 0%, 100%, 1);
          background-image:
            radial-gradient(at 21% 33%, hsla(225, 100%, 19%, 0.1) 0px, transparent 50%),
            radial-gradient(at 79% 76%, hsla(352, 71%, 54%, 0.1) 0px, transparent 50%),
            radial-gradient(at 96% 10%, hsla(43, 83%, 51%, 0.1) 0px, transparent 50%);
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

        @keyframes border-travel {
          0% {
            clip-path: polygon(0 0, 8% 0, 8% 100%, 0 100%);
            opacity: 1;
          }
          25% {
            clip-path: polygon(0 0, 100% 0, 100% 8%, 0 8%);
            opacity: 1;
          }
          50% {
            clip-path: polygon(92% 0, 100% 0, 100% 100%, 92% 100%);
            opacity: 1;
          }
          75% {
            clip-path: polygon(0 92%, 100% 92%, 100% 100%, 0 100%);
            opacity: 1;
          }
          100% {
            clip-path: polygon(0 0, 8% 0, 8% 100%, 0 100%);
            opacity: 1;
          }
        }
        .animate-border-travel {
          animation: border-travel 3s linear infinite;
          filter: drop-shadow(0 0 3px #efb215);
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.2;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }
        
        @keyframes shine {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shine {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(239, 178, 21, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shine 2s infinite;
        }
        
        @keyframes circle-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 178, 21, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 178, 21, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 178, 21, 0);
          }
        }
        
        .animate-circle-pulse {
          animation: circle-pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
        }

        @keyframes pop-out {
          0% { transform: scale(1); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        
        .animate-pop {
          animation: pop-out 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
        }
        
        @keyframes pop-hover {
          0% { transform: scale(1); }
          100% { transform: scale(1.03); }
        }
        
        .pop-on-hover:hover {
          animation: pop-hover 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <FloatingElements />

      <section ref={heroRef} className="relative bg-white h-[93vh] flex items-center justify-center overflow-hidden mesh-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-64 h-64 bg-[#d62839]/5 rounded-full blur-2xl -top-10 -right-20" />
          <div className="absolute w-64 h-64 bg-[#00305f]/5 rounded-full blur-2xl -bottom-10 -left-20" />
          <div className="dot-pattern absolute inset-0 opacity-[0.08]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 -mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#00305f]/10 mb-4">
              <span className="text-[#00305f] text-xs font-medium mr-2">Queen's University</span>
              <span className="flex h-1 w-1 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d62839] opacity-75" />
                <span className="relative inline-flex rounded-full h-1 w-1 bg-[#d62839]" />
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="gradient-text">Course selection,</span>
              <br />
              <span className="text-[#00305f]">powered by AI</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
              Make data-driven decisions with comprehensive grade distributions and AI-powered insights for all Queen's University courses.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Link 
                href="/queens-answers" 
                className="relative group bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white px-6 py-2.5 rounded-xl inline-block font-medium transition-all duration-500 ease-in-out w-full sm:w-auto text-center shadow-md hover:shadow-lg overflow-hidden hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center h-full">
                  <Brain className="mr-2 h-4 w-4" />
                  <span className="text-sm">Ask AI Assistant</span>
                </span>
              </Link>

              <Link 
                href="/schools/queens" 
                className="relative group bg-gradient-to-r from-[#00305f] to-[#00305f]/90 text-white px-6 py-2.5 rounded-xl inline-block font-medium transition-all duration-500 ease-in-out w-full sm:w-auto text-center shadow-md hover:shadow-lg overflow-hidden hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center h-full">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span className="text-sm">Browse Courses</span>
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div 
          className="absolute bottom-8 left-0 right-0 flex justify-center cursor-pointer"
          onClick={handleScrollClick}
        >
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-2 font-medium hover:text-[#d62839] transition-colors duration-300">
              Scroll to learn more
            </p>
            <div className="animate-bounce-slow bg-[#d62839]/10 rounded-full p-1.5 hover:bg-[#d62839]/20 transition-colors duration-300">
              <ChevronDown className="h-4 w-4 text-[#d62839]" />
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="bg-gray-50 py-8 sm:py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#efb215]/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d62839]/5 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#d62839]/10 mb-3">
              <span className="text-[#d62839] text-xs font-medium mr-2">Features</span>
              <span className="flex h-1 w-1 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d62839] opacity-75" />
                <span className="relative inline-flex rounded-full h-1 w-1 bg-[#d62839]" />
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="text-[#00305f]">Everything you need for</span>
              <br />
              <span className="gradient-text">smarter course decisions</span>
            </h2>
<<<<<<< HEAD
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              CourseCentral combines powerful data analytics with AI to help Queen's students make informed academic choices.
=======
            <div className="relative mx-auto w-24 mb-6">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] mb-8 rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Reason 1: Make Smarter Course Decisions */}
            <div className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-[#d62839]/30 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="bg-[#d62839] h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#d62839] transition-colors duration-300">Make Smarter Course Decisions</h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-[#d62839] font-medium">→</div>
                <p className="text-gray-600">Know what to expect before enrolling with insights from real grade data and past student reviews.</p>
              </div>
            </div>
            
            {/* Reason 2: Get Answers, Instantly */}
            <div className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-[#00305f]/30 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="bg-[#00305f] h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#00305f] transition-colors duration-300">Get Answers, Instantly</h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-[#00305f] font-medium">→</div>
                <p className="text-gray-600">No more guessing — use the chatbot to ask questions about classes and profs, 24/7.</p>
              </div>
            </div>
            
            {/* Reason 3: Built for Queen's */}
            <div className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-[#efb215]/30 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="bg-[#efb215] h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#efb215] transition-colors duration-300">Built for Queen's</h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-[#efb215] font-medium">→</div>
                <p className="text-gray-600">CourseCentral is made specifically for Queen's courses and students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-20 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f9f9fa] via-white to-white"></div>
        <div className="absolute h-96 w-96 bg-[#d62839]/5 rounded-full blur-3xl -left-20 top-20 transform rotate-45"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block relative mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-[#efb215]/10 text-[#efb215] text-sm font-medium">Testimonials</span>
              <div className="absolute -left-2 -bottom-2 w-5 h-5 bg-[#d62839]/20 rounded-full blur-md animate-pulse-slow"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">What Queen's students are saying</span>
            </h2>
            <div className="relative mx-auto w-24 mb-6">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#efb215] to-[#d6a215] mb-8 rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#00305f]/20 rounded-full blur-md animate-pulse-slow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transform transition-all duration-500 hover:scale-[1.02] group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#d62839]/0 group-hover:bg-[#d62839] rounded-t-xl transition-colors duration-300"></div>
              <div className="flex items-center mb-3">
                <div className="flex text-[#efb215]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="relative mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic mb-4 relative z-10">
                  "The AI assistant recommended a professor whose teaching style matched how I learn. Best course experience I've had at Queen's!"
                </p>
                <svg className="absolute text-[#00305f]/5 h-12 w-12 -top-4 -left-2 transform -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="relative h-12 w-12 mr-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00305f] to-[#00305f]/80 animate-pulse-slow"></div>
                  <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#00305f] font-bold">E</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Queen's Engineering Student</p>
                  <p className="text-xs text-gray-500">Class of 2024</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transform transition-all duration-500 hover:scale-[1.02] group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#efb215]/0 group-hover:bg-[#efb215] rounded-t-xl transition-colors duration-300"></div>
              <div className="flex items-center mb-3">
                <div className="flex text-[#efb215]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="relative mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic mb-4 relative z-10">
                  "The AI chatbot gave me insights about my professor's teaching style that I couldn't find anywhere else."
                </p>
                <svg className="absolute text-[#efb215]/5 h-12 w-12 -top-4 -left-2 transform -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="relative h-12 w-12 mr-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#efb215] to-[#efb215]/80 animate-pulse-slow"></div>
                  <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#efb215] font-bold">A</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Queen's Arts Student</p>
                  <p className="text-xs text-gray-500">Class of 2026</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transform transition-all duration-500 hover:scale-[1.02] group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00305f]/0 group-hover:bg-[#00305f] rounded-t-xl transition-colors duration-300"></div>
              <div className="flex items-center mb-3">
                <div className="flex text-[#efb215]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="relative mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic mb-4 relative z-10">
                  "Being able to see how course difficulty changed over different semesters helped me pick the best time to take COMM 151."
                </p>
                <svg className="absolute text-[#00305f]/5 h-12 w-12 -top-4 -left-2 transform -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="relative h-12 w-12 mr-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00305f] to-[#00305f]/80 animate-pulse-slow"></div>
                  <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#00305f] font-bold">S</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Queen's Science Student</p>
                  <p className="text-xs text-gray-500">Class of 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute h-96 w-96 bg-[#d62839]/5 rounded-full blur-3xl right-0 bottom-0 transform translate-x-1/2 translate-y-1/4"></div>
        <div className="absolute h-80 w-80 bg-[#00305f]/5 rounded-full blur-3xl left-0 top-0 transform -translate-x-1/3 -translate-y-1/4"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block relative mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-[#d62839]/10 text-[#d62839] text-sm font-medium">FAQs</span>
              <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#00305f]/10 rounded-full blur-md"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">Frequently Asked Questions</span>
            </h2>
          </div>
          
          <div className="min-h-[400px]">
            <FAQAccordionSection />
          </div>
        </div>
      </section>

      {/* Queen's University section */}
      <section className="bg-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/dot-pattern.png')] opacity-5"></div>
        <div className="absolute h-60 w-60 bg-[#efb215]/10 rounded-full blur-3xl left-20 top-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-3 transform transition-transform duration-500 hover:scale-105">
                <Image 
                  src="/images/QueensLogo.png" 
                  alt="Queen's University Logo" 
                  width={150} 
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#d62839] mb-2">Queen's University</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
              Helping students navigate the course selection process at Queen's University since 2023.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 italic max-w-md mx-auto">
              Note: CourseCentral is not affiliated with or endorsed by Queen's University.
>>>>>>> 134683d55ecd0fb79c936d8a5917d4323cae77a7
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto pb-8 sm:pb-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.4,
                    delay: index * 0.2 + 0.1
                  }
                }}
                viewport={{ once: true }}
                className="group relative bg-white p-0.5 rounded-xl transform shadow-sm hover:shadow-md pop-on-hover"
              >
                <motion.div 
                  className="bg-white rounded-xl p-4 sm:p-6 h-full"
                  initial={{ scale: 1 }}
                  whileInView={{
                    scale: [1, 1.02, 1],
                    transition: {
                      duration: 0.6,
                      delay: index * 0.2 + 0.3,
                      ease: [0.36, 0.07, 0.19, 0.97]
                    }
                  }}
                  viewport={{ once: true }}
                >
                  <div className={`bg-[#${feature.color}]/10 h-10 w-10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#${feature.color}] group-hover:shadow-md transition-all duration-300`}>
                    <div className={`text-[#${feature.color}] group-hover:text-white transition-all duration-300`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className={`font-bold text-base mb-2 group-hover:text-[#${feature.color}] transition-colors duration-300`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-6 sm:py-8 px-4 relative overflow-hidden mt-20 sm:mt-24">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#efb215]/10 mb-3">
              <span className="text-[#efb215] text-xs font-medium mr-2">How It Works</span>
              <Lightbulb className="h-3 w-3 text-[#efb215]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#00305f]">Your path to <span className="moving-gradient">academic success</span></h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              CourseCentral makes it easy to research courses, compare options, and make informed decisions.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="relative"
                initial={{ opacity: 0 }}
                whileInView={{ 
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.1 }
                }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#d62839] to-transparent md:hidden"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d62839] to-transparent hidden md:block"></div>

                <motion.div 
                  className="relative z-10 bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center pop-on-hover h-[220px] flex flex-col items-center justify-center"
                  initial={{ scale: 1 }}
                  whileInView={{ 
                    scale: [1, 1.04, 1],
                    transition: { 
                      duration: 0.8, 
                      delay: 0.2,
                      ease: [0.36, 0.07, 0.19, 0.97]
                    }
                  }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-[#d62839]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-5 w-5 text-[#d62839]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00305f] mb-3">1. Search Courses</h3>
                  <p className="text-gray-600">
                    Find any Queen's course and see detailed grade distributions and reviews.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0 }}
                whileInView={{ 
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.4 }
                }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#d62839] to-transparent md:hidden"></div>
                <motion.div 
                  className="relative z-10 bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center pop-on-hover h-[220px] flex flex-col items-center justify-center"
                  initial={{ scale: 1 }}
                  whileInView={{ 
                    scale: [1, 1.04, 1],
                    transition: { 
                      duration: 0.8, 
                      delay: 0.5,
                      ease: [0.36, 0.07, 0.19, 0.97]
                    }
                  }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-[#00305f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-5 w-5 text-[#00305f]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00305f] mb-3">2. Ask AI Assistant</h3>
                  <p className="text-gray-600">
                    Get personalized answers about professors, workload, and teaching styles.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0 }}
                whileInView={{ 
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.7 }
                }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="relative z-10 bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center pop-on-hover h-[220px] flex flex-col items-center justify-center"
                  initial={{ scale: 1 }}
                  whileInView={{ 
                    scale: [1, 1.04, 1],
                    transition: { 
                      duration: 0.8, 
                      delay: 0.8,
                      ease: [0.36, 0.07, 0.19, 0.97]
                    }
                  }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-[#efb215]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-5 w-5 text-[#efb215]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00305f] mb-3">3. Make Better Choices</h3>
                  <p className="text-gray-600">Select courses that match your learning style and academic goals.</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section ref={testimonialsRef} className="bg-gray-50 py-6 sm:py-8 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#00305f]/10 mb-3">
              <span className="text-[#00305f] text-xs font-medium mr-2">Student Success Stories</span>
              <Star className="h-3 w-3 text-[#00305f]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#00305f]">Trusted by <span className="moving-gradient">Queen's students</span></h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              See how CourseCentral has helped students make better academic decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const colorClasses = {
                topBorder: testimonial.initial === 'A' 
                  ? "group-hover:bg-[#00305f]"
                  : testimonial.initial === 'S'
                  ? "group-hover:bg-[#efb215]"
                  : "group-hover:bg-[#d62839]",
                circle: testimonial.initial === 'A'
                  ? "bg-gradient-to-br from-[#00305f] to-[#00305f]/80"
                  : testimonial.initial === 'S'
                  ? "bg-gradient-to-br from-[#efb215] to-[#efb215]/80"
                  : "bg-gradient-to-br from-[#d62839] to-[#d62839]/80",
                text: testimonial.initial === 'A'
                  ? "text-[#00305f]"
                  : testimonial.initial === 'S'
                  ? "text-[#efb215]"
                  : "text-[#d62839]"
              };
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transform transition-all duration-300 group relative pop-on-hover"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-transparent ${colorClasses.topBorder} rounded-t-xl transition-colors duration-300`}></div>
                  <div className="flex items-center mb-3">
                    <div className="flex text-[#efb215]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <p className="text-gray-600 italic mb-4 relative z-10">"{testimonial.quote}"</p>
                    <svg
                      className="absolute text-[#00305f]/5 h-12 w-12 -top-4 -left-2 transform -rotate-12"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <div className="relative h-12 w-12 mr-4">
                      <div className={`absolute inset-0 rounded-full ${colorClasses.circle} animate-pulse-slow`}></div>
                      <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                        <span className={`${colorClasses.text} font-bold`}>{testimonial.initial}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.program}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={faqRef} className="py-6 sm:py-8 px-4 relative overflow-hidden">
        <div className="container max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#d62839]/10 mb-3">
              <span className="text-[#d62839] text-xs font-medium mr-2">FAQs</span>
              <Info className="h-3 w-3 text-[#d62839]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#00305f]">Frequently Asked <span className="moving-gradient">Questions</span></h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">Find answers to common questions about CourseCentral.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              // Determine color based on index (0 = red, 1 = navy, 2 = gold, repeat)
              const colorClasses = index % 3 === 0 
                ? {
                    hoverBorder: "hover:border-[#d62839]/30",
                    iconBg: "bg-[#d62839]/10",
                    iconText: "text-[#d62839]",
                    iconHoverBg: "group-hover:bg-[#d62839]",
                    titleHover: "group-hover:text-[#d62839]"
                  }
                : index % 3 === 1
                ? {
                    hoverBorder: "hover:border-[#00305f]/30",
                    iconBg: "bg-[#00305f]/10",
                    iconText: "text-[#00305f]",
                    iconHoverBg: "group-hover:bg-[#00305f]",
                    titleHover: "group-hover:text-[#00305f]"
                  }
                : {
                    hoverBorder: "hover:border-[#efb215]/30",
                    iconBg: "bg-[#efb215]/10",
                    iconText: "text-[#efb215]",
                    iconHoverBg: "group-hover:bg-[#efb215]",
                    titleHover: "group-hover:text-[#efb215]"
                  };
                
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`group bg-white p-7 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out ${colorClasses.hoverBorder} hover:translate-y-[-2px]`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-start cursor-pointer">
                    <div className="mr-4 mt-1">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${colorClasses.iconBg} ${colorClasses.iconText} ${colorClasses.iconHoverBg} group-hover:text-white transition-colors duration-300`}>
                        {activeAccordion === index ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg text-[#00305f] ${colorClasses.titleHover} transition-colors duration-300 mb-2`}>
                        {faq.question}
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: activeAccordion === index ? 1 : 0,
                          height: activeAccordion === index ? "auto" : 0
                        }}
                        transition={{ 
                          duration: 0.3,
                          ease: "easeInOut"
                        }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#00305f] py-4 sm:py-6 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">Ready to make smarter course decisions?</h2>
            <p className="text-sm text-white/80 mb-6 max-w-2xl mx-auto">
              Join thousands of Queen's students who are using CourseCentral to plan their academic journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#d62839] hover:bg-[#c61e29] text-white px-8 py-6 rounded-xl font-medium transition-all duration-300 ease-in-out w-full sm:w-auto text-center shadow-md hover:shadow-lg"
              >
                <Link href="/queens-answers">
                  <span className="flex items-center text-lg">
                    <Brain className="mr-2 h-5 w-5" />
                    Try AI Assistant
                  </span>
                </Link>
              </Button>

              <Link 
                href="/schools/queens" 
                className="group relative bg-gradient-to-r from-[#00305f] to-[#00305f]/90 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl inline-block font-medium transition-all duration-500 ease-in-out w-full sm:w-auto text-center overflow-hidden hover:scale-105 shadow-md hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#efb215] group-hover:to-[#ff8a00] transition-all duration-500 ease-in-out">Browse Courses</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-500 ease-in-out group-hover:text-[#efb215]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t py-3 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-3 md:mb-0">
              <div className="inline-block mb-1">
                <span className="font-bold text-[#00305f] text-sm">Course</span>
                <span className="font-bold text-[#d62839] text-sm">Central</span>
              </div>
              <p className="text-xs text-gray-600">
                Platform for <span className="moving-gradient font-medium">Queen's Students</span> by <span className="moving-gradient font-medium">Queen's Students</span> 
              </p>
              <p className="text-xs text-gray-500 mt-1 italic">
                Not affiliated with or endorsed by Queen's University
              </p>
            </div>
            
            <div className="text-xs text-gray-600">
              <span className="moving-gradient font-medium">© 2025 CourseCentral</span>
              <span className="mx-2">•</span>
              <Link href="/about" className="text-[#00305f] hover:text-[#d62839] transition-colors duration-200">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
