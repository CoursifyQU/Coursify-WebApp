"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Github,
  Linkedin,
  Mail,
  ChevronRight,
  BookOpen,
  Users,
  GraduationCap,
  Brain,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
// import { FloatingElements } from "@/components/floating-elements"

export default function About() {
  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const helpRef = useRef<HTMLDivElement>(null)
  const involvedRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 })
  const isMissionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.5 })
  const isTeamInView = useInView(teamRef, { once: true, amount: 0.3 })
  const isHelpInView = useInView(helpRef, { once: true, amount: 0.3 })
  const isInvolvedInView = useInView(involvedRef, { once: true, amount: 0.5 })

  const copyToClipboard = (email: string, name: string) => {
    navigator.clipboard.writeText(email).then(() => {
      toast({
        title: "Email copied!",
        description: `${name}'s email has been copied to your clipboard.`,
        duration: 3000,
        variant: "success",
      })
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden max-w-[100vw] pt-20">
      {/* Custom animations */}
      <style jsx global>{`
        .card-hover-effect {
          transition: all 0.3s ease;
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

        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Subtle fixed blobs behind page */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="liquid-blob w-[500px] h-[440px] bg-[#d62839] top-0 right-0 opacity-[0.05]" style={{ animationDelay: '0s' }} />
        <div className="liquid-blob-alt w-[420px] h-[480px] bg-[#00305f] bottom-0 left-0 opacity-[0.05]" style={{ animationDelay: '-6s' }} />
        <div className="liquid-blob w-[300px] h-[300px] bg-[#efb215] top-1/3 left-1/2 opacity-[0.04]" style={{ animationDelay: '-12s' }} />
      </div>

      <div className="container py-12 px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full glass-pill mb-4">
            <span className="text-[#00305f] text-sm font-semibold mr-2">Our Story</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d62839] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d62839]"></span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#00305f]">About</span> <span className="gradient-text">Coursify</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Helping Queen's University students make informed academic decisions through data and AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 max-w-5xl mx-auto">
          <motion.div
            ref={missionRef}
            initial={{ opacity: 0, x: -30 }}
            animate={isMissionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#efb215]/20 rounded-full blur-lg"></div>
              <h2 className="text-2xl font-bold mb-6 text-[#00305f] relative z-10">Our Mission</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Coursify was created to address a critical gap in the Queen's University student experience: the
                lack of comprehensive, accessible data about courses and their historical performance.
              </p>
              <p className="text-gray-700">
                We believe that students should have access to detailed information about courses, including grade
                distributions, professor performance, and peer experiences, to make informed decisions about their
                academic journey.
              </p>
              <p className="text-gray-700">
                By combining official university data with cutting-edge AI technology, we've built a platform that
                empowers students to optimize their course selections and academic planning.
              </p>
            </div>
            <div className="mt-6">
              <Button
                asChild
                variant="outline"
                className="group border-[#00305f] text-[#00305f] hover:bg-[#00305f] hover:text-white"
              >
                <Link href="/schools/queens">
                  <span className="flex items-center">
                    Explore Courses
                    <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, x: 30 }}
            animate={isStatsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-[#00305f]">Platform Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <BookOpen className="h-5 w-5 text-[#00305f]" />, value: "500+", label: "Courses Tracked", valueColor: "text-[#d62839]", bg: "rgba(0,48,95,0.07)" },
                { icon: <BarChart3 className="h-5 w-5 text-[#d62839]" />, value: "8+", label: "Semesters of Data", valueColor: "text-[#00305f]", bg: "rgba(214,40,57,0.07)" },
                { icon: <GraduationCap className="h-5 w-5 text-[#efb215]" />, value: "50+", label: "Departments", valueColor: "text-[#d62839]", bg: "rgba(239,178,21,0.07)" },
                { icon: <Users className="h-5 w-5 text-[#00305f]" />, value: "1000s", label: "Students Helped", valueColor: "text-[#00305f]", bg: "rgba(0,48,95,0.07)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-5 text-center"
                  style={{ background: stat.bg }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: stat.bg }}>
                    {stat.icon}
                  </div>
                  <p className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={teamRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full glass-pill mb-4">
              <span className="text-[#d62839] text-sm font-semibold">Our Team</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-[#00305f]">Meet the Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're a group of passionate Queen's students dedicated to improving the academic experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card rounded-2xl border-0 h-full overflow-hidden">
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00305f]/80 to-[#00305f] rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-xl font-bold text-white">AJ</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#00305f]">Amaan Javed</h3>
                    <p className="text-[#d62839] mb-3">Team Lead</p>
                    <p className="mb-4 text-gray-600 text-sm flex-grow">Queen's Computing '26</p>
                    <div className="flex space-x-3 mt-auto">
                      <a 
                        href="https://github.com/amaanjaved1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/amaan-javed/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <button 
                        onClick={() => copyToClipboard("amaan.javed@queensu.ca", "Amaan")}
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card rounded-2xl border-0 h-full overflow-hidden">
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#d62839]/80 to-[#d62839] rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-xl font-bold text-white">AA</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#00305f]">Aayush Aryal</h3>
                    <p className="text-[#d62839] mb-3">Lead Web Developer</p>
                    <p className="mb-4 text-gray-600 text-sm flex-grow">Queen's Computing '28</p>
                    <div className="flex space-x-3 mt-auto">
                      <a 
                        href="https://github.com/aayusha59" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/aayush-aryal1/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <button 
                        onClick={() => copyToClipboard("23wv35@queensu.ca", "Aayush")}
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="glass-card rounded-2xl border-0 h-full overflow-hidden">
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#efb215]/80 to-[#efb215] rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-xl font-bold text-white">ZA</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#00305f]">Zaid Alam</h3>
                    <p className="text-[#d62839] mb-3">Outreach and Web Developer</p>
                    <p className="mb-4 text-gray-600 text-sm flex-grow">Queen's Computing '28</p>
                    <div className="flex space-x-3 mt-auto">
                      <div className="text-gray-400">
                        <Github className="h-4 w-4" />
                      </div>
                      <div className="text-gray-400">
                        <Linkedin className="h-4 w-4" />
                      </div>
                      <div className="text-gray-400">
                        <Mail className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="glass-card rounded-2xl border-0 h-full overflow-hidden">
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00305f]/80 to-[#00305f] rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-xl font-bold text-white">AI</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#00305f]">Ayaan Iqbal</h3>
                    <p className="text-[#d62839] mb-3">AI Engineer</p>
                    <p className="mb-4 text-gray-600 text-sm flex-grow">Waterloo Biomedical Engineering '27</p>
                    <div className="flex space-x-3 mt-auto">
                      <div className="text-gray-400">
                        <Github className="h-4 w-4" />
                      </div>
                      <div className="text-gray-400">
                        <Linkedin className="h-4 w-4" />
                      </div>
                      <div className="text-gray-400">
                        <Mail className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={helpRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHelpInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full glass-pill mb-4">
            <span className="text-[#efb215] text-sm font-semibold">Features</span>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-[#00305f]">How Coursify Helps</h2>
          <p className="mb-10 text-gray-600 max-w-3xl mx-auto">
            Coursify provides Queen's students with tools and insights that were previously unavailable:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHelpInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="w-12 h-12 bg-[#00305f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-5 w-5 text-[#00305f]" />
              </div>
              <h3 className="font-bold text-lg text-[#00305f] mb-3">Data-Driven Decisions</h3>
              <p className="text-gray-600">
                Access historical grade data to understand course difficulty and make informed choices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHelpInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="w-12 h-12 bg-[#d62839]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-5 w-5 text-[#d62839]" />
              </div>
              <h3 className="font-bold text-lg text-[#00305f] mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get instant answers to specific questions about courses, professors, and requirements.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHelpInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="w-12 h-12 bg-[#efb215]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-5 w-5 text-[#efb215]" />
              </div>
              <h3 className="font-bold text-lg text-[#00305f] mb-3">Academic Planning</h3>
              <p className="text-gray-600">
                Plan your academic journey with comprehensive information about course sequences and prerequisites.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={involvedRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInvolvedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="relative w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] py-8" style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)' }}>
            <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                  <span className="gradient-text">Get Involved</span>
                </h2>

                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  We're always looking for passionate Queen's students to help improve Coursify. Whether you're
                  interested in data analysis, software development, or user experience, we'd love to hear from you.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                  <Link
                    href="mailto:info@coursify.ca"
                    className="liquid-btn-red text-white px-6 py-2.5 rounded-xl inline-block font-medium w-full sm:w-auto text-center"
                  >
                    <span className="flex items-center justify-center">
                      <Mail className="mr-2 h-4 w-4" />
                      <span className="text-sm">Contact Us</span>
                    </span>
                  </Link>

                  <Link
                    href="/queens-answers"
                    className="liquid-btn-blue text-white px-6 py-2.5 rounded-xl inline-block font-medium w-full sm:w-auto text-center"
                  >
                    <span className="flex items-center justify-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span className="text-sm">Try AI Assistant</span>
                    </span>
                  </Link>
                </div>

                {/* Key benefits */}
                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[#00305f] rounded-full mr-2"></div>
                    <span>Real grade distributions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[#d62839] rounded-full mr-2"></div>
                    <span>AI-powered insights</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[#efb215] rounded-full mr-2"></div>
                    <span>Queen's focused</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[#00305f] rounded-full mr-2"></div>
                    <span>Completely free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
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
  )
}
