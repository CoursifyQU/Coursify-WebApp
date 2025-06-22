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
      })
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-gradient">
      {/* Custom animations */}
      <style jsx global>{`
        .mesh-gradient {
          background-color: hsla(0, 0%, 100%, 1);
          background-image:
            radial-gradient(at 21% 33%, hsla(225, 100%, 19%, 0.05) 0px, transparent 50%),
            radial-gradient(at 79% 76%, hsla(352, 71%, 54%, 0.05) 0px, transparent 50%),
            radial-gradient(at 96% 10%, hsla(43, 83%, 51%, 0.05) 0px, transparent 50%);
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
        
        .gradient-text {
          background: linear-gradient(-45deg, #00305f, #d62839, #efb215, #00305f);
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .team-card-gradient {
          position: relative;
          overflow: hidden;
        }
        
        .team-card-gradient::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #00305f, #d62839, #efb215);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .team-card-gradient:hover::before {
          transform: scaleX(1);
        }
      `}</style>

      {/* Simple background elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00305f]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#efb215]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d62839]/5 rounded-full blur-3xl -top-10 -right-20"></div>
        <div className="absolute w-80 h-80 bg-[#00305f]/5 rounded-full blur-3xl -bottom-10 -left-20"></div>
        <div className="dot-pattern absolute inset-0 opacity-[0.08]"></div>
      </div>

      <div className="container py-12 px-4 md:px-6 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00305f]/10 mb-4">
            <span className="text-[#00305f] text-sm font-medium mr-2">Our Story</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d62839] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d62839]"></span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#00305f]">About</span> <span className="gradient-text">CourseCentral</span>
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
                CourseCentral was created to address a critical gap in the Queen's University student experience: the
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
            className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm card-hover-effect"
          >
            <h2 className="text-2xl font-bold mb-6 text-[#00305f]">Platform Stats</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#00305f]/5 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-[#00305f]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-5 w-5 text-[#00305f]" />
                </div>
                <p className="text-3xl font-bold text-[#d62839]">500+</p>
                <p className="text-sm text-gray-600">Courses Tracked</p>
              </div>
              <div className="bg-[#d62839]/5 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-[#d62839]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-5 w-5 text-[#d62839]" />
                </div>
                <p className="text-3xl font-bold text-[#00305f]">8+</p>
                <p className="text-sm text-gray-600">Semesters of Data</p>
              </div>
              <div className="bg-[#efb215]/5 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-[#efb215]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="h-5 w-5 text-[#efb215]" />
                </div>
                <p className="text-3xl font-bold text-[#d62839]">50+</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
              <div className="bg-[#00305f]/5 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-[#00305f]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-5 w-5 text-[#00305f]" />
                </div>
                <p className="text-3xl font-bold text-[#00305f]">1000s</p>
                <p className="text-sm text-gray-600">Students Helped</p>
              </div>
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
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#d62839]/10 mb-4">
              <span className="text-[#d62839] text-sm font-medium">Our Team</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-[#00305f]">Meet the Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're a group of passionate Queen's students dedicated to improving the academic experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="team-card-gradient card-hover-effect border-gray-100">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#00305f]/80 to-[#00305f] rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-2xl font-bold text-white">AJ</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#00305f]">Amaan Javed</h3>
                    <p className="text-[#d62839] mb-4">Software Engineer</p>
                    <p className="mb-6 text-gray-600">Queen's Computing '26</p>
                    <div className="flex space-x-4">
                      <a 
                        href="https://github.com/amaanjaved1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/amaan-javed/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <button 
                        onClick={() => copyToClipboard("amaanjaved2004@gmail.com", "Amaan")}
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Mail className="h-5 w-5" />
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
              <Card className="team-card-gradient card-hover-effect border-gray-100">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#d62839]/80 to-[#d62839] rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-2xl font-bold text-white">AA</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#00305f]">Aayush Aryal</h3>
                    <p className="text-[#d62839] mb-4">Software Engineer</p>
                    <p className="mb-6 text-gray-600">Queen's Computing '28.</p>
                    <div className="flex space-x-4">
                      <a 
                        href="https://github.com/aayusha59" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/aayush-aryal1/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <button 
                        onClick={() => copyToClipboard("1aryalaayush@gmail.com", "Aayush")}
                        className="text-gray-400 hover:text-[#00305f] transition-colors duration-300"
                      >
                        <Mail className="h-5 w-5" />
                      </button>
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
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#efb215]/10 mb-4">
            <span className="text-[#efb215] text-sm font-medium">Features</span>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-[#00305f]">How CourseCentral Helps</h2>
          <p className="mb-10 text-gray-600 max-w-3xl mx-auto">
            CourseCentral provides Queen's students with tools and insights that were previously unavailable:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHelpInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover-effect"
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
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover-effect"
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
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover-effect"
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
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#00305f] to-[#00305f]/90 rounded-2xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-96 h-96 bg-[#d62839]/20 rounded-full blur-3xl top-10 right-10"></div>
              <div className="absolute w-80 h-80 bg-[#efb215]/20 rounded-full blur-3xl -bottom-10 -left-10"></div>
              <div className="dot-pattern absolute inset-0 opacity-[0.1]"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
              <p className="mb-8 text-white/80 max-w-2xl mx-auto">
                We're always looking for passionate Queen's students to help improve CourseCentral. Whether you're
                interested in data analysis, software development, or user experience, we'd love to hear from you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild className="bg-[#d62839] hover:bg-[#d62839]/90 text-white">
                  <Link href="mailto:info@coursecentral.ca">
                    <span className="flex items-center">
                      <Mail className="mr-2 h-5 w-5" />
                      Contact Us
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#00305f]"
                >
                  <Link href="/queens-answers">
                    <span className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Try AI Assistant
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
