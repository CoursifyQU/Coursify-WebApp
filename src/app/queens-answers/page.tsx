"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth/auth-context"
import { QUEENS_ANSWERS_DRAFT_STORAGE_KEY } from "@/constants/queens-answers"
import { AuthModal } from "@/components/auth-modal"
import { Bot, Search, MessageSquare, Target, ArrowRight } from "lucide-react"

export default function AIFeatures() {
  const [question, setQuestion] = useState("")
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const { user } = useAuth()

  useEffect(() => {
    const stored = sessionStorage.getItem(QUEENS_ANSWERS_DRAFT_STORAGE_KEY)
    if (stored) {
      setQuestion(stored)
      sessionStorage.removeItem(QUEENS_ANSWERS_DRAFT_STORAGE_KEY)
    }
  }, [])
  const howItWorksItems = [
    {
      icon: Search,
      title: "Ask specific course or professor questions",
      description: "Type anything you want to know about Queen's courses, workloads, grading, or teaching styles.",
    },
    {
      icon: Bot,
      title: "Get AI-assisted answers instantly",
      description: "The system combines structured course data with AI reasoning to return useful, readable guidance.",
    },
    {
      icon: MessageSquare,
      title: "Pull in relevant student sentiment",
      description: "Responses are informed by student discussions, review sources, and real course context where available.",
    },
    {
      icon: Target,
      title: "Make more confident decisions",
      description: "Use the output to compare options and choose courses that better match your goals and learning style.",
    },
  ]

  // Disable scrolling on component mount
  useEffect(() => {
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling on component unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Sample questions with emojis
  const sampleQuestions = [
    { emoji: "📊", text: "best electives for first-years" },
    { emoji: "🧑‍🏫", text: "easiest profs for MATH 121" },
    { emoji: "💬", text: "professor reviews for PSYC 100" },
    { emoji: "📈", text: "grade distribution for BIOL 102" },
    { emoji: "🕒", text: "average workload for CHEM 112" },
    { emoji: "🏆", text: "courses with highest average" },
    { emoji: "👨‍🎓", text: "best profs for CISC 124" },
    { emoji: "🔍", text: "hidden gem electives" },
    { emoji: "🗣️", text: "prof teaching style for COMM 151" },
    { emoji: "💡", text: "tips for surviving ENGL 100" },
    { emoji: "🧑‍🤝‍🧑", text: "group project courses" },
    { emoji: "🧑‍🏫", text: "strictest graders" },
  ]

  // Duplicate the array to create a seamless loop effect
  const duplicatedQuestions = [...sampleQuestions, ...sampleQuestions, ...sampleQuestions]

  // Set up continuous animation
  useEffect(() => {
    const startAnimation = async () => {
      await controls.start({
        x: [0, -3000],
        transition: {
          duration: 60,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      })
    }

    startAnimation()

    return () => {
      controls.stop()
    }
  }, [controls])

  // Function to handle click on sample questions (just set the question text, no auth check)
  const handleSampleQuestionClick = (questionText: string) => {
    setQuestion(questionText);
  };

  // Function to actually submit a question (includes auth check)
  const handleSubmitQuestion = (questionText: string = question) => {
    if (!user) {
      // If not authenticated, show auth modal
      setShowAuthModal(true);
      return;
    }

    // Handle question submission (only when authenticated)
    console.log("Question submitted:", questionText);
    // Implement your actual submission logic here
  };

  // Function to handle input focus
  const handleInputFocus = () => {
    setShowComingSoon(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-[var(--page-bg)] pt-20">
      <div className="h-full flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Header */}
          <h1 className="text-5xl font-extrabold text-center mb-3 tracking-tight animated-title">
            <span className="gradient-text">Queen's Answers</span>
          </h1>
          <p className="text-xl font-semibold text-center mb-10 text-brand-navy dark:text-white max-w-2xl">
            Got a question? Ask it and get answers, perspectives, and recommendations from all of Queen's
          </p>

          {/* Continuous Carousel */}
          <div className="w-full mb-8 overflow-hidden relative carousel-container" ref={containerRef}>
            <motion.div className="flex gap-4 px-4" animate={controls} style={{ width: "max-content" }}>
              {duplicatedQuestions.map((q, i) => (
                <motion.button
                  key={i}
                  type="button"
                  tabIndex={0}
                  onClick={() => {
                    handleSampleQuestionClick(q.text);
                  }}
                  className="carousel-item flex items-center bg-white dark:bg-[#262626] border border-gray-200 dark:border-white/10 rounded-full px-6 py-3 text-base font-medium shadow-sm text-brand-navy dark:text-white whitespace-nowrap hover:bg-gray-50 dark:hover:bg-[#2e2e2e]"
                  style={{ lineHeight: "1.2" }}
                  aria-label={q.text}
                  whileHover={{
                    scale: 1.06,
                    y: -4,
                    zIndex: 20,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    mass: 0.9,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="mr-2 text-lg">{q.emoji}</span>
                  {q.text}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* How it works link */}
          <button
            type="button"
            onClick={() => setShowHowItWorks(true)}
            className="text-brand-navy dark:text-white underline text-base hover:text-brand-red transition cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            Learn how Queen's Answers works &gt;
          </button>

          {/* How it works modal */}
          <AnimatePresence>
            {showHowItWorks && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowHowItWorks(false)
                }}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="glass-modal-panel modal-content relative max-w-xl w-full rounded-[1.75rem] p-6 sm:p-7"
                >
                  <button
                    className="glass-modal-close absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl font-bold text-brand-navy/55 dark:text-white/55 hover:text-brand-red"
                    onClick={() => setShowHowItWorks(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <div className="glass-modal-accent h-1.5 w-24 rounded-full mb-5 mx-auto opacity-90" />
                  <h2 className="text-3xl font-bold mb-3 text-center text-brand-navy dark:text-white">
                    How <span className="gradient-text">Queen's Answers</span> Works
                  </h2>
                  <p className="mx-auto max-w-md text-center text-sm leading-6 text-brand-navy/68 dark:text-white/68">
                    A quick overview of how the feature is designed to turn scattered course information into practical recommendations.
                  </p>
                  <ul className="space-y-3 mt-6">
                    {howItWorksItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.title} className="glass-card rounded-2xl p-4 flex items-start gap-4">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/55 dark:bg-white/[0.06] ring-1 ring-white/70 dark:ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:shadow-none">
                            <Icon className="h-4.5 w-4.5 text-brand-navy dark:text-white" strokeWidth={1.9} />
                          </div>
                          <div>
                            <div className="font-semibold text-brand-navy dark:text-white">{item.title}</div>
                            <div className="text-brand-navy/70 dark:text-white/70 text-sm mt-1 leading-6">
                              {item.description}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ask a Question Input at the bottom */}
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl flex items-center bg-[#f5f6f7] dark:bg-[#262626] dark:border dark:border-white/10 rounded-full px-4 py-3 shadow-lg transition-all duration-500 ${
            showHowItWorks || showComingSoon ? "opacity-30 pointer-events-none filter blur-[1px]" : "opacity-100 hover:shadow-xl"
          }`}
          style={{ zIndex: 30 }}
        >
          <input
            type="text"
            className="flex-grow bg-transparent outline-none px-2 py-2 text-lg text-[#222] dark:text-gray-100 placeholder:text-[#b0b3b8] dark:placeholder:text-gray-500 placeholder:font-medium"
            placeholder="Ask a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmitQuestion();
              }
            }}
            disabled={showHowItWorks}
          />
          <button
            type="button"
            onClick={() => handleSubmitQuestion()}
            className="ml-2 bg-brand-red hover:bg-red-800 text-white rounded-full w-12 h-10 flex items-center justify-center font-semibold text-lg transition-all duration-300 ease-in-out shadow hover:shadow-lg hover:scale-105"
            style={{ minWidth: "48px" }}
            disabled={showHowItWorks}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-modal-overlay fixed inset-0 z-40 flex flex-col items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="glass-modal-panel relative max-w-xl w-full rounded-[1.75rem] p-6 sm:p-7"
            >
              <button
                className="glass-modal-close absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl font-bold text-brand-navy/55 dark:text-white/55 hover:text-brand-red"
                onClick={() => setShowComingSoon(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center">
                <div className="glass-modal-accent h-1.5 w-24 rounded-full mb-5 opacity-90" />
                <h2 className="text-3xl font-bold text-brand-navy dark:text-white mb-2 text-center">Coming Soon</h2>
                <p className="text-lg text-center text-brand-navy/72 dark:text-white/72 mb-5 leading-8">
                  We're working hard to bring Queen's Answers to life. This feature will be available in the near future.
                </p>
                <div className="glass-card w-full h-3 rounded-full overflow-hidden mb-6 p-0.5">
                  <motion.div 
                    className="glass-modal-accent h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-sm text-center text-brand-navy/60 dark:text-white/60 italic">
                  Queen's Answers will provide AI-powered insights on courses, professors, and more!
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2, duration: 0.25 }}
              className="mt-8 text-center"
            >
              <a 
                href="/" 
                className="liquid-btn-blue inline-flex items-center justify-center rounded-2xl px-6 py-3 font-medium text-white"
              >
                Return to Home
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        title="Sign in to use Queen's Answers"
        description="You need to sign in with your Queen's University email to access this feature."
      />

      {/* All styles in one place */}
      <style jsx>{`
        .carousel-container {
          position: relative;
          margin: 0 auto;
          overflow: hidden;
          padding: 12px 0;
          border-radius: 8px;
        }
        
        .carousel-item {
          position: relative;
          transition-property: box-shadow, border-color, color, background, background-color;
          transition-duration: 0.35s;
          transition-timing-function: cubic-bezier(0.2, 0.85, 0.3, 1.1);
          transform-origin: center;
          will-change: transform, box-shadow, border-color;
          margin: 0 3px;
          backface-visibility: hidden;
          -webkit-font-smoothing: subpixel-antialiased;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          overflow: visible;
        }
        
        :is(.dark) .carousel-item {
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .carousel-item:hover {
          z-index: 20;
          border-color: rgba(214, 40, 57, 0.35);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }

        :is(.dark) .carousel-item:hover {
          border-color: rgba(252, 165, 165, 0.25);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }

        .animated-title {
          position: relative;
          overflow: hidden;
          padding: 0.2em 0;
        }
        
        .gradient-text {
          background: linear-gradient(
            90deg, 
            #00305f 0%, 
            #d62839 30%, 
            #efb215 60%, 
            #00305f 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          animation: shine 8s linear infinite, float 3s ease-in-out infinite;
          display: inline-block;
          text-shadow: 0 0 3px rgba(0, 48, 95, 0.1);
        }
        
        :is(.dark) .gradient-text {
          background: linear-gradient(
            90deg,
            #e5e7eb 0%,
            #ff4d5e 28%,
            #ffc940 58%,
            #e5e7eb 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-shadow: none;
        }
        
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        .animated-title::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d62839, transparent);
          animation: shimmer 3s infinite;
          transform: translateX(-100%);
          opacity: 0.2;
        }
        
        :is(.dark) .animated-title::before {
          background: linear-gradient(90deg, transparent, #ff4d5e, transparent);
          opacity: 0.35;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-fade-in {
          animation: fadeInModal 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .modal-backdrop {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .modal-content {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes fadeInModal {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
