"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Brain,
  BarChart3,
  BarChart,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  Star,
  Zap,
  Award,
  UserPlus,
  Upload,
  Eye,
  Sparkles,
} from "lucide-react";
import {
  GradeDistributionMockup,
  StudentReviewsMockup,
  AIAssistantMockup,
  CourseAnalyticsMockup,
} from "@/components/landing-mockups";

const revealEase = [0.22, 1, 0.36, 1] as const;

const heroRevealVariants = {
  hidden: { opacity: 0.88, y: 10, scale: 0.998 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.42, ease: revealEase, staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

const heroChildVariants = {
  hidden: { opacity: 0.82, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: revealEase } },
};

function SectionGlow({ className, gradient }: { className: string; gradient: string }) {
  return <div aria-hidden className={`pointer-events-none absolute rounded-full ${className}`} style={{ background: gradient }} />;
}

export default function Home() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHeroProgress = useSpring(heroScrollProgress, { stiffness: 110, damping: 26, mass: 0.35 });
  const heroContentY = useTransform(smoothHeroProgress, [0, 1], ["0%", "18%"]);
  const heroContentOpacity = useTransform(smoothHeroProgress, [0, 0.75], [1, 0.4]);
  const heroBackgroundY = useTransform(smoothHeroProgress, [0, 1], ["0%", "24%"]);
  const heroBackgroundScale = useTransform(smoothHeroProgress, [0, 1], [1, 1.08]);
  const heroArrowY = useTransform(smoothHeroProgress, [0, 1], ["0%", "80%"]);
  const heroArrowOpacity = useTransform(smoothHeroProgress, [0, 0.55], [1, 0]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const toggleAccordion = (index: number) => setActiveAccordion(activeAccordion === index ? null : index);

  const handleScrollClick = () => {
    if (stepsRef.current) {
      const y = stepsRef.current.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const steps = [
    { num: "01", title: "Create an Account", desc: "Sign up for free and personalize your course planning experience.", icon: <UserPlus className="h-6 w-6" />, color: "#d62839" },
    { num: "02", title: "Upload Grade Distributions", desc: "Contribute data to help the community make smarter decisions.", icon: <Upload className="h-6 w-6" />, color: "#00305f" },
    { num: "03", title: "View Course Data", desc: "Explore real grade breakdowns, enrollment trends, and student reviews.", icon: <Eye className="h-6 w-6" />, color: "#efb215" },
    { num: "04", title: "Ask Our AI", desc: "Chat with the AI assistant for personalized course and professor recommendations.", icon: <Sparkles className="h-6 w-6" />, color: "#d62839" },
  ];

  const featureTabs = [
    {
      label: "Grade Distributions",
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Real grade data across 10+ semesters",
      description: "See actual grade breakdowns for every Queen's course. Compare how difficulty has changed over time, identify trends, and understand what to expect before you enroll.",
    },
    {
      label: "Student Reviews",
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Aggregated student feedback from across the web",
      description: "Read comments pulled from Reddit and RateMyProfessors, filtered for relevance to Queen's courses. Get the full picture of what students actually think.",
    },
    {
      label: "AI Assistant",
      icon: <Brain className="h-5 w-5" />,
      title: "Your personal course advisor, powered by AI",
      description: "Ask anything about courses, professors, teaching styles, and workload. Our AI is trained on thousands of student experiences to give you personalized, instant answers.",
    },
    {
      label: "Course Analytics",
      icon: <BarChart className="h-5 w-5" />,
      title: "Visualize trends and make informed decisions",
      description: "Track GPA trends, passing rates, and enrollment numbers across semesters. Identify the best time to take a course and which sections to target.",
    },
  ];

  const testimonials = [
    {
      quote: "The AI assistant recommended a professor whose teaching style matched how I learn. Best course experience I've had at Queen's!",
      name: "Queen's Engineering Student",
      program: "Class of 2024",
      initial: "E",
      color: "#d62839",
    },
    {
      quote: "The AI chatbot gave me insights about my professor's teaching style that I couldn't find anywhere else.",
      name: "Queen's Arts Student",
      program: "Class of 2026",
      initial: "A",
      color: "#00305f",
    },
    {
      quote: "Being able to see how course difficulty changed over different semesters helped me pick the best time to take COMM 151.",
      name: "Queen's Science Student",
      program: "Class of 2025",
      initial: "S",
      color: "#efb215",
    },
  ];

  const faqs = [
    { question: "Is Coursify connected to SOLUS?", answer: "Coursify is not officially connected to SOLUS, but we've collected grade distribution data from multiple reliable sources. You'll need to register for courses through SOLUS after researching them on our platform." },
    { question: "Where does the chatbot get its information?", answer: "Our AI advisor is trained on thousands of student reviews from Queen's course catalogs, Reddit discussions, and RateMyProfessors reviews to provide you with comprehensive insights about courses and professors." },
    { question: "How up-to-date is the grade data?", answer: "We update our database each semester with the latest grade distributions and course information to ensure you have access to the most current data for decision making." },
    { question: "Is this tool free?", answer: "Yes, Coursify is completely free for all Queen's University students. We believe in making data-driven course selection accessible to everyone." },
    { question: "What courses are supported?", answer: "Currently, Coursify only supports on-campus courses at Queen's University. We're working on adding support for online courses in the future, but for now, our data and AI assistant focus exclusively on in-person course offerings." },
  ];

  const activeTab = featureTabs[activeFeatureTab];

  return (
    <div className="relative overflow-hidden">
      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
        :is(.dark) .gradient-text {
          background: linear-gradient(-45deg, #4a9eff, #ff4d5e, #ffc940, #4a9eff);
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
        :is(.dark) .moving-gradient {
          background: linear-gradient(-45deg, #4a9eff, #ff4d5e, #ffc940, #4a9eff);
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden pt-24 sm:pt-28">
        <motion.div
          className="absolute pointer-events-none overflow-hidden"
          style={{ inset: "-80px 0 0 0", y: heroBackgroundY, scale: heroBackgroundScale, willChange: "transform" }}
        >
          <div className="liquid-blob w-[480px] h-[380px] bg-brand-navy opacity-[0.07]" style={{ top: 0, left: "-6rem", animationDelay: "0s" }} />
          <div className="liquid-blob-alt w-[360px] h-[420px] bg-brand-red opacity-[0.06]" style={{ top: 0, right: 0, animationDelay: "-4s" }} />
          <div className="liquid-blob w-[300px] h-[300px] bg-brand-gold opacity-[0.05]" style={{ bottom: 0, left: "33%", animationDelay: "-8s" }} />
        </motion.div>

        <SectionGlow className="left-[6%] top-28 h-72 w-72 blur-[145px] opacity-90" gradient="radial-gradient(circle, rgba(0,48,95,0.18) 0%, rgba(0,48,95,0.07) 48%, transparent 76%)" />
        <SectionGlow className="right-[8%] top-[18%] h-64 w-64 blur-[135px] opacity-80" gradient="radial-gradient(circle, rgba(214,40,57,0.16) 0%, rgba(214,40,57,0.06) 42%, transparent 74%)" />
        <SectionGlow className="bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 blur-[150px] opacity-75" gradient="radial-gradient(circle, rgba(239,178,21,0.12) 0%, rgba(239,178,21,0.04) 45%, transparent 72%)" />

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 min-h-[calc(100svh-6rem)] sm:min-h-[calc(100svh-7rem)] flex items-center">
          <motion.div
            initial={false}
            style={{ y: heroContentY, opacity: heroContentOpacity, willChange: "transform" }}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* Left — text */}
            <motion.div initial="hidden" animate="visible" variants={heroRevealVariants}>
              <motion.div variants={heroChildVariants} className="inline-flex items-center gap-2 rounded-full glass-pill px-4 py-2 mb-6">
                <Zap className="h-3.5 w-3.5 text-brand-red" />
                <span className="text-xs font-semibold text-brand-navy dark:text-white">Built for Queen&apos;s Students</span>
              </motion.div>

              <motion.h1 variants={heroChildVariants} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 leading-[1.05] tracking-tight">
                <span className="gradient-text">Course selection</span>
                <br />
                <span className="text-brand-navy dark:text-white">powered by</span>
                <br />
                <span className="gradient-text">AI</span>
              </motion.h1>

              <motion.p variants={heroChildVariants} className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                Make data-driven decisions with real grade distributions, student reviews, and an AI assistant — all for Queen&apos;s University courses.
              </motion.p>

              <motion.div variants={heroChildVariants} className="flex flex-col sm:flex-row items-start gap-3 mb-8">
                <Link href="/queens-answers" className="liquid-btn-red text-white px-7 py-3 rounded-xl inline-block font-medium w-full sm:w-auto text-center">
                  <span className="relative z-10 flex items-center justify-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Ask AI Assistant
                  </span>
                </Link>
                <Link href="/schools/queens" className="glass-pill text-brand-navy dark:text-white px-7 py-3 rounded-xl inline-block font-medium w-full sm:w-auto text-center border border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200">
                  Browse Courses
                </Link>
              </motion.div>

              <motion.div variants={heroChildVariants} className="flex flex-wrap gap-3">
                {["Real grade data", "AI-powered insights", "Queen's focused", "Completely free"].map((label) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — three staggered UI mockup cards */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroRevealVariants}
              className="relative hidden lg:flex flex-col gap-4"
            >
              {/* Grade Distribution — right-aligned, slight clockwise tilt */}
              <motion.div
                variants={heroChildVariants}
                className="w-full max-w-[400px] ml-auto shadow-xl"
                style={{ transform: "rotate(1.5deg)" }}
              >
                <GradeDistributionMockup />
              </motion.div>

              {/* Student Reviews — left-aligned, slight counter-tilt */}
              <motion.div
                variants={heroChildVariants}
                className="w-full max-w-[400px] mr-auto shadow-xl"
                style={{ transform: "rotate(-1.5deg)" }}
              >
                <StudentReviewsMockup compact />
              </motion.div>

              {/* AI Assistant — right-aligned, slight clockwise tilt */}
              <motion.div
                variants={heroChildVariants}
                className="w-full max-w-[400px] ml-auto shadow-2xl"
                style={{ transform: "rotate(1deg)" }}
              >
                <AIAssistantMockup compact />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-center cursor-pointer"
          style={{ y: heroArrowY, opacity: heroArrowOpacity, willChange: "transform" }}
          onClick={handleScrollClick}
        >
          <div className="animate-bounce-slow glass-pill rounded-full p-2 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300">
            <ChevronDown className="h-4 w-4 text-brand-red" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section ref={stepsRef} className="section-glass py-12 sm:py-16 px-4 relative overflow-hidden">
        <SectionGlow className="left-1/2 top-12 h-80 w-80 -translate-x-1/2 blur-[155px] opacity-75" gradient="radial-gradient(circle, rgba(239,178,21,0.16) 0%, rgba(239,178,21,0.05) 44%, transparent 74%)" />
        <SectionGlow className="right-0 bottom-6 h-72 w-72 blur-[145px] opacity-70" gradient="radial-gradient(circle, rgba(0,48,95,0.14) 0%, rgba(0,48,95,0.04) 46%, transparent 74%)" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 rounded-full glass-pill px-4 py-2 mb-3">
              <Award className="h-3.5 w-3.5 text-brand-gold" />
              <span className="text-brand-gold text-xs font-semibold">How It Works</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-brand-navy dark:text-white">
              Your path to{" "}
              <span className="moving-gradient">smarter decisions</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes. Here&apos;s how Coursify helps you plan your courses.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step) => (
              <div key={step.num} className="glass-card glass-shine rounded-2xl p-6 relative overflow-hidden group">
                <span className="absolute top-3 right-4 text-6xl font-black opacity-[0.04] text-brand-navy dark:text-white select-none">{step.num}</span>
                <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: step.color }}>{step.num}</div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: `${step.color}15`, color: step.color }}
                >
                  {step.icon}
                </div>
                <h3 className="font-bold text-base mb-2 text-brand-navy dark:text-white">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TABBED FEATURES ═══════════════ */}
      <section className="section-glass py-12 sm:py-16 relative overflow-hidden">
        <SectionGlow className="-left-20 top-14 h-72 w-72 blur-[140px] opacity-80" gradient="radial-gradient(circle, rgba(214,40,57,0.14) 0%, rgba(214,40,57,0.05) 44%, transparent 74%)" />
        <SectionGlow className="right-[-4rem] top-24 h-80 w-80 blur-[150px] opacity-80" gradient="radial-gradient(circle, rgba(0,48,95,0.16) 0%, rgba(0,48,95,0.05) 48%, transparent 76%)" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 rounded-full glass-pill px-4 py-2 mb-3">
              <Zap className="h-3.5 w-3.5 text-brand-red" />
              <span className="text-brand-red text-xs font-semibold">Features</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="text-brand-navy dark:text-white">Built for </span>
              <span className="gradient-text">smarter decisions</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to research, compare, and choose the best courses at Queen&apos;s.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Tab buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {featureTabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveFeatureTab(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    i === activeFeatureTab
                      ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                      : "glass-pill text-gray-600 dark:text-gray-400 hover:text-brand-navy dark:hover:text-white"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content — keep the switch animation since it's a UI interaction */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeatureTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: revealEase }}
                className="glass-card rounded-3xl p-6 sm:p-10 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-brand-navy dark:text-white mb-4 leading-snug">{activeTab.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{activeTab.description}</p>
                    <Link
                      href={activeFeatureTab === 2 ? "/queens-answers" : "/schools/queens"}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:gap-3 transition-all duration-200"
                    >
                      {activeFeatureTab === 2 ? "Try AI Assistant" : "Explore Courses"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="rounded-2xl flex items-center justify-center">
                    {activeFeatureTab === 0 && <GradeDistributionMockup compact />}
                    {activeFeatureTab === 1 && <StudentReviewsMockup compact />}
                    {activeFeatureTab === 2 && <AIAssistantMockup compact />}
                    {activeFeatureTab === 3 && <CourseAnalyticsMockup compact />}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="section-glass py-12 sm:py-16 px-4 relative overflow-hidden">
        <SectionGlow className="left-[-3rem] top-16 h-80 w-80 blur-[145px] opacity-75" gradient="radial-gradient(circle, rgba(214,40,57,0.14) 0%, rgba(214,40,57,0.05) 42%, transparent 74%)" />
        <SectionGlow className="right-[-2rem] top-28 h-80 w-80 blur-[145px] opacity-70" gradient="radial-gradient(circle, rgba(0,48,95,0.15) 0%, rgba(0,48,95,0.05) 46%, transparent 76%)" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 rounded-full glass-pill px-4 py-2 mb-3">
              <Star className="h-3.5 w-3.5 text-brand-navy dark:text-white" />
              <span className="text-brand-navy dark:text-white text-xs font-semibold">Testimonials</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-brand-navy dark:text-white">
              Trusted by{" "}
              <span className="moving-gradient">Queen&apos;s students</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See how Coursify has helped students make better academic decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card glass-shine rounded-2xl p-6 sm:p-7 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" style={{ background: t.color }} />
                <div className="flex items-center gap-1 text-brand-gold mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="text-brand-navy/90 dark:text-slate-200 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-5 border-t border-white/40 dark:border-white/[0.06]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: t.color }}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-navy dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.program}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="section-glass py-12 sm:py-16 px-4 relative overflow-hidden">
        <SectionGlow className="left-1/2 top-8 h-72 w-72 -translate-x-1/2 blur-[145px] opacity-80" gradient="radial-gradient(circle, rgba(214,40,57,0.12) 0%, rgba(214,40,57,0.04) 44%, transparent 76%)" />
        <SectionGlow className="right-[-2rem] bottom-10 h-72 w-72 blur-[140px] opacity-70" gradient="radial-gradient(circle, rgba(0,48,95,0.12) 0%, rgba(0,48,95,0.04) 46%, transparent 76%)" />

        <div className="container max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full glass-pill mb-3">
              <span className="text-brand-red text-xs font-semibold mr-2">FAQs</span>
              <Info className="h-3 w-3 text-brand-red" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-brand-navy dark:text-white">
              Your questions,{" "}
              <span className="moving-gradient">answered</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get quick answers to the most common questions about Coursify.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const colorClasses = index % 3 === 0
                ? { iconBg: "bg-brand-red/10", iconText: "text-brand-red", iconHoverBg: "group-hover:bg-brand-red", titleHover: "group-hover:text-brand-red" }
                : index % 3 === 1
                ? { iconBg: "bg-brand-navy/10", iconText: "text-brand-navy dark:text-white", iconHoverBg: "group-hover:bg-brand-navy", titleHover: "group-hover:text-brand-navy dark:text-white" }
                : { iconBg: "bg-brand-gold/10", iconText: "text-brand-gold", iconHoverBg: "group-hover:bg-brand-gold", titleHover: "group-hover:text-brand-gold" };

              return (
                <div
                  key={index}
                  className="group glass-accordion rounded-2xl p-6 transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${colorClasses.iconBg} ${colorClasses.iconText} ${colorClasses.iconHoverBg} group-hover:text-white transition-colors duration-300`}>
                        {activeAccordion === index ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg text-brand-navy dark:text-white ${colorClasses.titleHover} transition-colors duration-300 mb-2`}>
                        {faq.question}
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: activeAccordion === index ? 1 : 0, height: activeAccordion === index ? "auto" : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="section-glass py-14 sm:py-20 px-4 relative overflow-hidden">
        <SectionGlow className="left-[10%] top-10 h-72 w-72 blur-[145px] opacity-80" gradient="radial-gradient(circle, rgba(0,48,95,0.14) 0%, rgba(0,48,95,0.05) 46%, transparent 76%)" />
        <SectionGlow className="right-[10%] bottom-6 h-80 w-80 blur-[155px] opacity-75" gradient="radial-gradient(circle, rgba(214,40,57,0.14) 0%, rgba(214,40,57,0.05) 44%, transparent 76%)" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
          <div className="text-center max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
              <span className="gradient-text">Ready to make smarter</span>
              <br />
              <span className="text-brand-navy dark:text-white">course decisions?</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-7">
              Join thousands of Queen&apos;s students who are using Coursify to plan their academic journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
              <Link href="/queens-answers" className="liquid-btn-red text-white px-7 py-3 rounded-xl inline-block font-medium w-full sm:w-auto text-center">
                <span className="flex items-center justify-center">
                  <Brain className="mr-2 h-4 w-4" />
                  <span className="text-sm">Try AI Assistant</span>
                </span>
              </Link>
              <Link href="/schools/queens" className="liquid-btn-blue text-white px-7 py-3 rounded-xl inline-block font-medium w-full sm:w-auto text-center">
                <span className="flex items-center justify-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span className="text-sm">Browse Courses</span>
                </span>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {["Real grade distributions", "AI-powered insights", "Queen's focused", "Completely free"].map((label) => (
                <div key={label} className="flex items-center glass-pill px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 bg-brand-red" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative overflow-hidden border-t border-white/60 dark:border-white/5 py-4 bg-white/45 dark:bg-slate-900/45 backdrop-blur-[28px]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="mb-1 md:mb-0">
              <div className="inline-block mb-1">
                <span className="font-bold text-brand-navy dark:text-white text-sm tracking-tight">Cours</span>
                <span className="font-bold text-brand-red text-sm tracking-tight">ify</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Platform for{" "}
                <span className="moving-gradient font-medium">Queen&apos;s Students</span>{" "}
                by{" "}
                <span className="moving-gradient font-medium">Queen&apos;s Students</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">
                Not affiliated with or endorsed by Queen&apos;s University
              </p>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span className="moving-gradient font-medium">© {new Date().getFullYear()} Coursify</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link href="/about" className="text-brand-navy dark:text-white hover:text-brand-red transition-colors duration-200 font-medium">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
