"use client";

import { useState, useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  BookOpen,
  BarChart3,
  Brain,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
} from "lucide-react";

const revealEase = [0.22, 1, 0.36, 1] as const;

const sectionRevealVariants = {
  hidden: {
    opacity: 0.18,
    y: 24,
    scale: 0.992,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: revealEase,
      when: "beforeChildren",
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const sectionChildVariants = {
  hidden: {
    opacity: 0.12,
    y: 18,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      ease: revealEase,
    },
  },
};

const heroRevealVariants = {
  hidden: {
    opacity: 0.88,
    y: 10,
    scale: 0.998,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: revealEase,
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

const heroChildVariants = {
  hidden: {
    opacity: 0.82,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: revealEase,
    },
  },
};

const sectionCollectionVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const sectionCardVariants = {
  hidden: {
    opacity: 0.12,
    y: 20,
    scale: 0.985,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: revealEase,
    },
  },
};

function SectionGlow({
  className,
  gradient,
  style,
}: {
  className: string;
  gradient: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{ background: gradient, ...style }}
    />
  );
}

function SectionReveal({
  children,
  className,
  amount = 0.01,
  initial = "hidden",
  margin = "0px 0px 28% 0px",
  trigger = "inView",
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  initial?: "hidden" | "visible";
  margin?: string;
  trigger?: "inView" | "mount";
}) {
  return (
    <motion.div
      initial={initial}
      animate={trigger === "mount" ? "visible" : undefined}
      whileInView={trigger === "inView" ? "visible" : undefined}
      viewport={trigger === "inView" ? { once: true, amount, margin } : undefined}
      variants={sectionRevealVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function useSectionGlide<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  intensity = 36,
) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });

  return {
    y: useTransform(
      smoothProgress,
      [0, 0.5, 1],
      [`${intensity}px`, "0px", `${-intensity}px`],
    ),
    opacity: useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.75, 1, 1, 0.82]),
    willChange: "transform",
  };
}

export default function Home() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [testimonialPositions, setTestimonialPositions] = useState([0, 1, 2]);
  const [isTestimonialAnimating, setIsTestimonialAnimating] = useState(false);
  const testimonialTouchStartX = useRef<number | null>(null);

  // Refs for scroll animations
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smoothHeroProgress = useSpring(heroScrollProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.35,
  });
  const heroContentY = useTransform(smoothHeroProgress, [0, 1], ["0%", "18%"]);
  const heroContentOpacity = useTransform(smoothHeroProgress, [0, 0.75], [1, 0.4]);
  const heroBackgroundY = useTransform(smoothHeroProgress, [0, 1], ["0%", "24%"]);
  const heroBackgroundScale = useTransform(smoothHeroProgress, [0, 1], [1, 1.08]);
  const heroArrowY = useTransform(smoothHeroProgress, [0, 1], ["0%", "80%"]);
  const heroArrowOpacity = useTransform(smoothHeroProgress, [0, 0.55], [1, 0]);

  const featuresGlide = useSectionGlide(featuresRef, 34);
  const processGlide = useSectionGlide(processRef, 30);
  const testimonialsGlide = useSectionGlide(testimonialsRef, 28);
  const faqGlide = useSectionGlide(faqRef, 24);
  const ctaGlide = useSectionGlide(ctaRef, 20);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleTestimonialSwipe = (direction: 1 | -1) => {
    if (isTestimonialAnimating) return;
    setIsTestimonialAnimating(true);

    setTestimonialPositions((prev) => {
      if (direction === 1) {
        return prev.map((p) => (p === 0 ? 2 : p - 1));
      }
      return prev.map((p) => (p === 2 ? 0 : p + 1));
    });

    setTimeout(() => {
      setIsTestimonialAnimating(false);
    }, 500);
  };

  const handleTestimonialTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    testimonialTouchStartX.current = e.changedTouches[0]?.screenX ?? null;
  };

  const handleTestimonialTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (testimonialTouchStartX.current === null) return;

    const touchEndX = e.changedTouches[0]?.screenX ?? 0;
    const delta = touchEndX - testimonialTouchStartX.current;

    testimonialTouchStartX.current = null;

    if (delta <= -50) handleTestimonialSwipe(1);
    else if (delta >= 50) handleTestimonialSwipe(-1);
  };

  const faqs = [
    {
      question: "Is Coursify connected to SOLUS?",
      answer:
        "Coursify is not officially connected to SOLUS, but we've collected grade distribution data from multiple reliable sources. You'll need to register for courses through SOLUS after researching them on our platform.",
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
        "Yes, Coursify is completely free for all Queen's University students. We believe in making data-driven course selection accessible to everyone.",
    },
    {
      question: "What courses are supported?",
      answer:
        "Currently, Coursify only supports on-campus courses at Queen's University. We're working on adding support for online courses in the future, but for now, our data and AI assistant focus exclusively on in-person course offerings.",
    },
  ];

  const testimonials = [
    {
      quote:
        "The AI assistant recommended a professor whose teaching style matched how I learn. Best course experience I've had at Queen's!",
      name: "Queen's Engineering Student",
      program: "Class of 2024",
      initial: "E",
    },
    {
      quote:
        "The AI chatbot gave me insights about my professor's teaching style that I couldn't find anywhere else.",
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
  ];

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
      description:
        "Compare how courses have evolved over time with historical course data going back to 2015.",
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
  ];

  const stats = [
    {
      value: "Queen's",
      label: "University Focus",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      value: "Real",
      label: "Grade Data",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      value: "AI",
      label: "Powered Assistant",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      value: "Free",
      label: "For Students",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  // Scroll to features section
  const handleScrollClick = () => {
    if (featuresRef.current) {
      const yOffset = -60;
      const element = featuresRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 5px rgba(214, 40, 57, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(214, 40, 57, 0.7));
          }
        }

        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
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
          background: linear-gradient(
            -45deg,
            #00305f,
            #d62839,
            #efb215,
            #00305f
          );
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        .moving-gradient {
          background: linear-gradient(
            -45deg,
            #00305f,
            #d62839,
            #efb215,
            #00305f
          );
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
          background: linear-gradient(
            -45deg,
            #00305f,
            #d62839,
            #efb215,
            #00305f
          );
          background-size: 400% 400%;
          animation: gradient-shift 6s ease infinite;
          border-radius: inherit;
        }

        .mesh-gradient {
          background-color: hsla(0, 0%, 100%, 1);
          background-image: radial-gradient(
              at 21% 33%,
              hsla(225, 100%, 19%, 0.1) 0px,
              transparent 50%
            ),
            radial-gradient(
              at 79% 76%,
              hsla(352, 71%, 54%, 0.1) 0px,
              transparent 50%
            ),
            radial-gradient(
              at 96% 10%,
              hsla(43, 83%, 51%, 0.1) 0px,
              transparent 50%
            );
        }

        .card-hover-effect {
          transition: all 0.3s ease;
        }

        .card-hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .dot-pattern {
          background-image: radial-gradient(
            circle,
            #00305f 1px,
            transparent 1px
          );
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
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
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
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-pop {
          animation: pop-out 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
        }

        @keyframes pop-hover {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.03);
          }
        }

        .pop-on-hover:hover {
          animation: pop-hover 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97)
            forwards;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden pt-24 sm:pt-28"
      >
        {/* Liquid background blobs — extend above to fill behind navbar */}
        <motion.div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            inset: "-80px 0 0 0",
            y: heroBackgroundY,
            scale: heroBackgroundScale,
            willChange: "transform",
          }}
        >
          <div
            className="liquid-blob w-[480px] h-[380px] bg-[#00305f] opacity-[0.07]"
            style={{ top: 0, left: "-6rem", animationDelay: '0s' }}
          />
          <div
            className="liquid-blob-alt w-[360px] h-[420px] bg-[#d62839] opacity-[0.06]"
            style={{ top: 0, right: 0, animationDelay: '-4s' }}
          />
          <div
            className="liquid-blob w-[300px] h-[300px] bg-[#efb215] opacity-[0.05]"
            style={{ bottom: 0, left: "33%", animationDelay: '-8s' }}
          />
        </motion.div>

        <SectionGlow
          className="left-[6%] top-28 h-72 w-72 blur-[145px] opacity-90"
          gradient="radial-gradient(circle, rgba(0,48,95,0.18) 0%, rgba(0,48,95,0.07) 48%, transparent 76%)"
        />
        <SectionGlow
          className="right-[8%] top-[18%] h-64 w-64 blur-[135px] opacity-80"
          gradient="radial-gradient(circle, rgba(214,40,57,0.16) 0%, rgba(214,40,57,0.06) 42%, transparent 74%)"
        />
        <SectionGlow
          className="bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 blur-[150px] opacity-75"
          gradient="radial-gradient(circle, rgba(239,178,21,0.12) 0%, rgba(239,178,21,0.04) 45%, transparent 72%)"
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 min-h-[calc(100svh-6rem)] sm:min-h-[calc(100svh-7rem)] flex items-center justify-center">
          <div className="flex flex-col items-center w-full">
            <motion.div
              initial={false}
              style={{ y: heroContentY, opacity: heroContentOpacity, willChange: "transform" }}
              className="text-center max-w-2xl"
            >
              <motion.div initial="hidden" animate="visible" variants={heroRevealVariants}>
                <motion.h1 variants={heroChildVariants} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 leading-tight">
                  <span className="gradient-text">Coursify</span>
                </motion.h1>

                <motion.h2 variants={heroChildVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  <span className="gradient-text">Course selection</span>
                  <span className="text-[#00305f]"> powered by AI</span>
                </motion.h2>

                <motion.p variants={heroChildVariants} className="text-base sm:text-lg text-gray-700 mb-6">
                  Make data-driven decisions with comprehensive insights for all
                  Queen&apos;s University courses.
                </motion.p>

                <motion.div
                  variants={heroChildVariants}
                  className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-8"
                >
                  <Link
                    href="/queens-answers"
                    className="liquid-btn-red text-white px-6 py-2.5 rounded-xl inline-block font-medium w-full sm:w-auto text-center overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center h-full">
                      <Brain className="mr-2 h-4 w-4" />
                      <span className="text-sm">Ask AI Assistant</span>
                    </span>
                  </Link>

                  <Link
                    href="/schools/queens"
                    className="liquid-btn-blue text-white px-6 py-2.5 rounded-xl inline-block font-medium w-full sm:w-auto text-center overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center h-full">
                      <BarChart className="mr-2 h-4 w-4" />
                      <span className="text-sm">Browse Courses</span>
                    </span>
                  </Link>
                </motion.div>

                <motion.div variants={heroChildVariants} className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                  {[
                    { color: "#00305f", label: "Real grade distributions" },
                    { color: "#d62839", label: "AI-powered insights" },
                    { color: "#efb215", label: "Queen's focused" },
                    { color: "#00305f", label: "Completely free" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center glass-pill px-3 py-1 rounded-full">
                      <div
                        className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-center cursor-pointer"
          style={{ y: heroArrowY, opacity: heroArrowOpacity, willChange: "transform" }}
          onClick={handleScrollClick}
        >
          <div className="animate-bounce-slow glass-pill rounded-full p-2 hover:bg-white/70 transition-all duration-300">
            <ChevronDown className="h-4 w-4 text-[#d62839]" />
          </div>
        </motion.div>
      </section>

      <motion.section
        ref={featuresRef}
        className="section-glass py-8 sm:py-10 relative scroll-mt-24 overflow-hidden"
        style={featuresGlide}
      >
        <SectionGlow
          className="-left-20 top-14 h-72 w-72 blur-[140px] opacity-80"
          gradient="radial-gradient(circle, rgba(214,40,57,0.14) 0%, rgba(214,40,57,0.05) 44%, transparent 74%)"
        />
        <SectionGlow
          className="right-[-4rem] top-24 h-80 w-80 blur-[150px] opacity-80"
          gradient="radial-gradient(circle, rgba(0,48,95,0.16) 0%, rgba(0,48,95,0.05) 48%, transparent 76%)"
        />
        <SectionReveal className="container mx-auto px-4 relative z-10">
          <motion.div variants={sectionChildVariants} className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 rounded-full glass-pill px-4 py-2 mb-3">
              <Zap className="h-3.5 w-3.5 text-[#d62839]" />
              <span className="text-[#d62839] text-xs font-semibold">
                Features
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              <span className="text-[#00305f]">Everything you need for</span>
              <br />
              <span className="gradient-text">smarter course decisions</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Coursify combines powerful data analytics with AI to help Queen&apos;s
              students make informed academic choices.
            </p>
          </motion.div>

          <motion.div
            variants={sectionCollectionVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto pb-8 sm:pb-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={sectionCardVariants}
                className="group glass-card glass-shine rounded-2xl p-5 sm:p-6 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-[#${feature.color}] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`}
                />
                <div
                  className={`bg-[#${feature.color}]/10 h-11 w-11 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#${feature.color}] group-hover:shadow-lg transition-all duration-300`}
                >
                  <div className={`text-[#${feature.color}] group-hover:text-white transition-all duration-300`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`font-bold text-base mb-2 text-[#00305f] group-hover:text-[#${feature.color}] transition-colors duration-300`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </SectionReveal>
      </motion.section>

      <motion.section
        ref={processRef}
        className="section-glass py-8 sm:py-10 px-4 relative overflow-hidden mt-16 sm:mt-20"
        style={processGlide}
      >
        <SectionGlow
          className="left-1/2 top-12 h-80 w-80 -translate-x-1/2 blur-[155px] opacity-75"
          gradient="radial-gradient(circle, rgba(239,178,21,0.16) 0%, rgba(239,178,21,0.05) 44%, transparent 74%)"
        />
        <SectionGlow
          className="right-0 bottom-6 h-72 w-72 blur-[145px] opacity-70"
          gradient="radial-gradient(circle, rgba(0,48,95,0.14) 0%, rgba(0,48,95,0.04) 46%, transparent 74%)"
        />
        <SectionReveal className="container mx-auto relative z-10" amount={0} margin="0px 0px 40% 0px">
          <motion.div variants={sectionChildVariants} className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 rounded-full glass-pill px-4 py-2 mb-3">
              <Award className="h-3.5 w-3.5 text-[#efb215]" />
              <span className="text-[#efb215] text-xs font-semibold">
                Success
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#00305f]">
              Your path to{" "}
              <span className="moving-gradient">academic success</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Coursify makes it easy to research courses, compare options, and
              make informed decisions.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.04,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {[
                { color: "#d62839", icon: <Search className="h-5 w-5" />, step: "1", title: "Search Courses", desc: "Find any Queen's course and see detailed grade distributions and reviews." },
                { color: "#00305f", icon: <MessageSquare className="h-5 w-5" />, step: "2", title: "Ask AI Assistant", desc: "Get personalized answers about professors, workload, and teaching styles." },
                { color: "#efb215", icon: <Award className="h-5 w-5" />, step: "3", title: "Make Better Choices", desc: "Select courses that match your learning style and academic goals." },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  variants={sectionCardVariants}
                  className="glass-card glass-shine rounded-2xl p-6 text-center h-[220px] flex flex-col items-center justify-center relative overflow-hidden group"
                >
                  <span className="absolute top-3 right-4 text-5xl font-black opacity-[0.04] text-[#00305f] select-none">
                    {item.step}
                  </span>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ background: `${item.color}18`, color: item.color }}
                  >
                    <div style={{ color: item.color }}>{item.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-[#00305f] mb-2">
                    {item.step}. {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionReveal>
      </motion.section>

      <motion.section
        ref={testimonialsRef}
        className="section-glass py-8 sm:py-10 px-4 relative overflow-hidden"
        style={testimonialsGlide}
      >
        <SectionGlow
          className="left-[-3rem] top-16 h-80 w-80 blur-[145px] opacity-75"
          gradient="radial-gradient(circle, rgba(214,40,57,0.14) 0%, rgba(214,40,57,0.05) 42%, transparent 74%)"
        />
        <SectionGlow
          className="right-[-2rem] top-28 h-80 w-80 blur-[145px] opacity-70"
          gradient="radial-gradient(circle, rgba(0,48,95,0.15) 0%, rgba(0,48,95,0.05) 46%, transparent 76%)"
        />
        <SectionReveal className="container mx-auto relative z-10" amount={0.1}>
          <motion.div variants={sectionChildVariants} className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 rounded-full glass-pill px-4 py-2 mb-3">
              <Star className="h-3.5 w-3.5 text-[#00305f]" />
              <span className="text-[#00305f] text-xs font-semibold">
                Testimonials
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#00305f]">
              Trusted by{" "}
              <span className="moving-gradient">Queen&apos;s students</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              See how Coursify has helped students make better academic
              decisions.
            </p>
          </motion.div>

          <motion.div
            variants={sectionChildVariants}
            className="relative max-w-[1200px] mx-auto mt-12 flex flex-col overflow-hidden md:block md:h-[650px] pt-12 pb-12"
            style={{ perspective: "1200px" }}
            onTouchStart={handleTestimonialTouchStart}
            onTouchEnd={handleTestimonialTouchEnd}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] md:block z-0" style={{ background: "radial-gradient(circle, rgba(0,48,95,0.12) 0%, rgba(214,40,57,0.08) 45%, rgba(239,178,21,0.06) 72%, transparent 100%)" }} />

            {testimonials.map((testimonial, index) => {
              const slot = testimonialPositions[index];
              const accent =
                index === 0
                  ? {
                      color: "#d62839",
                      glow: "rgba(214, 40, 57, 0.18)",
                      tint: "rgba(214, 40, 57, 0.10)",
                      label: "Engineering Pick",
                    }
                  : index === 1
                  ? {
                      color: "#00305f",
                      glow: "rgba(0, 48, 95, 0.16)",
                      tint: "rgba(0, 48, 95, 0.10)",
                      label: "Most Loved",
                    }
                  : {
                      color: "#efb215",
                      glow: "rgba(239, 178, 21, 0.20)",
                      tint: "rgba(239, 178, 21, 0.11)",
                      label: "Science Favorite",
                    };

              const slotClasses =
                slot === 0
                  ? "transition-all duration-500 ease-out w-full mb-6 md:mb-0 md:absolute md:top-1/2 md:left-1/2 group cursor-pointer md:w-[400px] md:-translate-x-[125%] md:-translate-y-[60%] md:-rotate-[6deg] md:scale-75 z-10 md:opacity-50 hover:md:opacity-100 hover:md:z-40"
                  : slot === 1
                  ? "transition-all duration-500 ease-out w-full mb-6 md:mb-0 md:absolute md:top-1/2 md:left-1/2 group cursor-pointer md:w-[480px] md:-translate-x-1/2 md:-translate-y-[65%] z-30 opacity-100 md:rotate-0 md:scale-110"
                  : "transition-all duration-500 ease-out w-full mb-6 md:mb-0 md:absolute md:top-1/2 md:left-1/2 group cursor-pointer md:w-[400px] md:translate-x-[25%] md:-translate-y-[60%] md:rotate-[6deg] md:scale-75 z-10 md:opacity-50 hover:md:opacity-100 hover:md:z-40";
              const isFeatured = slot === 1;

              return (
                <div
                  key={index}
                  className={slotClasses}
                >
                  <div
                    className="relative rounded-[2rem] p-[1.5px] shadow-[0_24px_60px_-30px_rgba(0,48,95,0.28)] transition-all duration-500 md:hover:-translate-y-2"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.85), ${accent.tint}, rgba(255,255,255,0.65))`,
                      boxShadow: isFeatured
                        ? `0 36px 80px -36px ${accent.glow}, 0 20px 50px -28px rgba(0, 48, 95, 0.28)`
                        : `0 28px 56px -36px ${accent.glow}, 0 14px 32px -24px rgba(0, 48, 95, 0.20)`,
                    }}
                  >
                    <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] border border-white/60 bg-[rgba(255,255,255,0.52)] p-6 backdrop-blur-2xl sm:p-7">
                      <div
                        className="pointer-events-none absolute inset-0 opacity-60"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px)",
                          backgroundSize: "34px 34px",
                        }}
                      />
                      <div
                        className="pointer-events-none absolute inset-x-8 top-0 h-px"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${accent.color}, transparent)`,
                          opacity: isFeatured ? 0.95 : 0.75,
                        }}
                      />
                      <div
                        className="pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full blur-3xl"
                        style={{ background: accent.glow }}
                      />
                      <div
                        className="pointer-events-none absolute -bottom-12 -left-12 h-24 w-24 rounded-full blur-3xl"
                        style={{ background: accent.glow }}
                      />

                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[#efb215]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`${isFeatured ? "h-[18px] w-[18px]" : "h-4 w-4"} fill-current`} />
                            ))}
                          </div>
                          <span
                            className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]"
                            style={{
                              color: accent.color,
                              background: `${accent.tint}`,
                              borderColor: `${accent.color}35`,
                            }}
                          >
                            {accent.label}
                          </span>
                        </div>

                        <div className="relative flex-1">
                          <svg
                            className="absolute -left-1 -top-3 h-12 w-12"
                            fill="currentColor"
                            viewBox="0 0 32 32"
                            style={{ color: `${accent.color}20` }}
                          >
                            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                          </svg>

                          <blockquote
                            className={`relative pl-7 pr-2 text-[#00305f]/88 ${
                              isFeatured ? "text-lg leading-8 sm:text-[1.35rem]" : "text-base leading-7"
                            }`}
                          >
                            &ldquo;{testimonial.quote}&rdquo;
                          </blockquote>
                        </div>

                        <div className="mt-8 flex items-center gap-4 border-t border-white/45 pt-5">
                          <div
                            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full p-[1.5px]"
                            style={{
                              background: `linear-gradient(135deg, ${accent.color}, rgba(255,255,255,0.9))`,
                            }}
                          >
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-white/80 text-sm font-bold backdrop-blur-md" style={{ color: accent.color }}>
                              {testimonial.initial}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#00305f]">{testimonial.name}</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#00305f]/55">
                              {testimonial.program}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 gap-6 z-40">
              <button
                type="button"
                onClick={() => handleTestimonialSwipe(-1)}
                disabled={isTestimonialAnimating}
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/55 text-[#00305f] shadow-[0_8px_20px_-5px_rgba(0,48,95,0.35)] backdrop-blur-xl transition-all duration-300 hover:bg-white/75 hover:text-[#d62839] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:hover:text-[#00305f]"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => handleTestimonialSwipe(1)}
                disabled={isTestimonialAnimating}
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/55 text-[#00305f] shadow-[0_8px_20px_-5px_rgba(0,48,95,0.35)] backdrop-blur-xl transition-all duration-300 hover:bg-white/75 hover:text-[#d62839] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:hover:text-[#00305f]"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </SectionReveal>
      </motion.section>

      <motion.section
        ref={faqRef}
        className="section-glass py-8 sm:py-10 px-4 relative overflow-hidden"
        style={faqGlide}
      >
        <SectionGlow
          className="left-1/2 top-8 h-72 w-72 -translate-x-1/2 blur-[145px] opacity-80"
          gradient="radial-gradient(circle, rgba(214,40,57,0.12) 0%, rgba(214,40,57,0.04) 44%, transparent 76%)"
        />
        <SectionGlow
          className="right-[-2rem] bottom-10 h-72 w-72 blur-[140px] opacity-70"
          gradient="radial-gradient(circle, rgba(0,48,95,0.12) 0%, rgba(0,48,95,0.04) 46%, transparent 76%)"
        />
        <SectionReveal className="container max-w-4xl mx-auto relative z-10" amount={0} margin="0px 0px 40% 0px">
          <motion.div variants={sectionChildVariants} className="text-center mb-8">
            <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full glass-pill mb-3">
              <span className="text-[#d62839] text-xs font-semibold mr-2">
                FAQs
              </span>
              <Info className="h-3 w-3 text-[#d62839]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#00305f]">
              Frequently Asked{" "}
              <span className="moving-gradient">Questions</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about Coursify.
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.04,
                },
              },
            }}
            className="space-y-3"
          >
            {faqs.map((faq, index) => {
              // Determine color based on index (0 = red, 1 = navy, 2 = gold, repeat)
              const colorClasses =
                index % 3 === 0
                  ? {
                      hoverBorder: "hover:border-[#d62839]/30",
                      iconBg: "bg-[#d62839]/10",
                      iconText: "text-[#d62839]",
                      iconHoverBg: "group-hover:bg-[#d62839]",
                      titleHover: "group-hover:text-[#d62839]",
                    }
                  : index % 3 === 1
                  ? {
                      hoverBorder: "hover:border-[#00305f]/30",
                      iconBg: "bg-[#00305f]/10",
                      iconText: "text-[#00305f]",
                      iconHoverBg: "group-hover:bg-[#00305f]",
                      titleHover: "group-hover:text-[#00305f]",
                    }
                  : {
                      hoverBorder: "hover:border-[#efb215]/30",
                      iconBg: "bg-[#efb215]/10",
                      iconText: "text-[#efb215]",
                      iconHoverBg: "group-hover:bg-[#efb215]",
                      titleHover: "group-hover:text-[#efb215]",
                    };

              return (
                <motion.div
                  key={index}
                  variants={sectionCardVariants}
                  className={`group glass-accordion rounded-2xl p-6 transition-all duration-300 ease-in-out cursor-pointer`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-start cursor-pointer">
                    <div className="mr-4 mt-1">
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full ${colorClasses.iconBg} ${colorClasses.iconText} ${colorClasses.iconHoverBg} group-hover:text-white transition-colors duration-300`}
                      >
                        {activeAccordion === index ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-lg text-[#00305f] ${colorClasses.titleHover} transition-colors duration-300 mb-2`}
                      >
                        {faq.question}
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: activeAccordion === index ? 1 : 0,
                          height: activeAccordion === index ? "auto" : 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
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
          </motion.div>
        </SectionReveal>
      </motion.section>

      <motion.section
        ref={ctaRef}
        className="section-glass py-10 sm:py-14 px-4 relative overflow-hidden"
        style={ctaGlide}
      >
        <SectionGlow
          className="left-[10%] top-10 h-72 w-72 blur-[145px] opacity-80"
          gradient="radial-gradient(circle, rgba(0,48,95,0.14) 0%, rgba(0,48,95,0.05) 46%, transparent 76%)"
        />
        <SectionGlow
          className="right-[10%] bottom-6 h-80 w-80 blur-[155px] opacity-75"
          gradient="radial-gradient(circle, rgba(214,40,57,0.14) 0%, rgba(214,40,57,0.05) 44%, transparent 76%)"
        />
        <SectionReveal className="container mx-auto px-4 sm:px-6 relative z-10" amount={0} margin="0px 0px 40% 0px">
          <div className="flex flex-col items-center">
            <div className="text-center max-w-2xl">
              <motion.h2 variants={sectionChildVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
                <span className="gradient-text">Ready to make smarter</span>
                <br />
                <span className="text-[#00305f]">course decisions?</span>
              </motion.h2>

              <motion.p variants={sectionChildVariants} className="text-sm sm:text-base text-gray-700 mb-7">
                Join thousands of Queen&apos;s students who are using Coursify to plan their academic journey.
              </motion.p>

              <motion.div
                variants={sectionChildVariants}
                className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-7"
              >
                <Link
                  href="/queens-answers"
                  className="liquid-btn-red text-white px-7 py-3 rounded-xl inline-block font-medium w-full sm:w-auto text-center"
                >
                  <span className="flex items-center justify-center">
                    <Brain className="mr-2 h-4 w-4" />
                    <span className="text-sm">Try AI Assistant</span>
                  </span>
                </Link>

                <Link
                  href="/schools/queens"
                  className="liquid-btn-blue text-white px-7 py-3 rounded-xl inline-block font-medium w-full sm:w-auto text-center"
                >
                  <span className="flex items-center justify-center">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span className="text-sm">Browse Courses</span>
                  </span>
                </Link>
              </motion.div>

              <motion.div variants={sectionChildVariants} className="flex flex-wrap justify-center gap-2.5">
                {[
                  { color: "#00305f", label: "Real grade distributions" },
                  { color: "#d62839", label: "AI-powered insights" },
                  { color: "#efb215", label: "Queen's focused" },
                  { color: "#00305f", label: "Completely free" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center glass-pill px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </SectionReveal>
      </motion.section>

      <footer className="relative overflow-hidden border-t border-white/60 py-4" style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="mb-1 md:mb-0">
              <div className="inline-block mb-1">
                <span className="font-bold text-[#00305f] text-sm tracking-tight">Cours</span>
                <span className="font-bold text-[#d62839] text-sm tracking-tight">ify</span>
              </div>
              <p className="text-xs text-gray-600">
                Platform for{" "}
                <span className="moving-gradient font-medium">
                  Queen&apos;s Students
                </span>{" "}
                by{" "}
                <span className="moving-gradient font-medium">
                  Queen&apos;s Students
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5 italic">
                Not affiliated with or endorsed by Queen&apos;s University
              </p>
            </div>

            <div className="text-xs text-gray-600 flex items-center gap-2">
              <span className="moving-gradient font-medium">
                © {new Date().getFullYear()} Coursify
              </span>
              <span className="text-gray-300">•</span>
              <Link
                href="/about"
                className="text-[#00305f] hover:text-[#d62839] transition-colors duration-200 font-medium"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
