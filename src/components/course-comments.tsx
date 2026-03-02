import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import Link from "next/link";
import { getCommentsForCourse } from "@/lib/db";
import type { RedditComment, RmpComment } from "@/lib/db";

interface CourseCommentsProps {
  courseCode: string;
}

export function CourseComments({ courseCode }: CourseCommentsProps) {
  const [redditComments, setRedditComments] = useState<RedditComment[]>([]);
  const [rmpComments, setRmpComments] = useState<RmpComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [redditCommentIndex, setRedditCommentIndex] = useState(0);
  const [rmpCommentIndex, setRmpCommentIndex] = useState(0);

  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      try {
        const { redditComments: reddit, rmpComments: rmp } = await getCommentsForCourse(courseCode);
        setRedditComments(reddit);
        setRmpComments(rmp);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    }
    if (courseCode) fetchComments();
  }, [courseCode]);

  const nextRedditComment = () => {
    setRedditCommentIndex((prev) => (prev + 1) % Math.max(redditComments.length, 1));
  };
  const prevRedditComment = () => {
    setRedditCommentIndex((prev) => (prev - 1 + redditComments.length) % Math.max(redditComments.length, 1));
  };
  const nextRmpComment = () => {
    setRmpCommentIndex((prev) => (prev + 1) % Math.max(rmpComments.length, 1));
  };
  const prevRmpComment = () => {
    setRmpCommentIndex((prev) => (prev - 1 + rmpComments.length) % Math.max(rmpComments.length, 1));
  };

  const currentRedditComment = redditComments[redditCommentIndex];
  const currentRmpComment = rmpComments[rmpCommentIndex];

  const sentimentColor = (label: string) => {
    if (label === "positive") return "text-green-600";
    if (label === "negative") return "text-red-600";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full mt-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00305f]"></div>
          <span className="ml-3 text-gray-500">Loading comments...</span>
        </div>
      </div>
    );
  }

  const hasComments = redditComments.length > 0 || rmpComments.length > 0;

  if (!hasComments) {
    return (
      <div className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full mt-6">
        <h2 className="text-xl font-bold text-[#00305f] mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Student Comments
        </h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No student comments found for this course yet.</p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center">
          <p className="text-base font-medium mb-4 text-gray-800">Talk with our chatbot to get more insights!</p>
          <Link
            href="/queens-answers"
            className="relative group bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white px-6 py-2.5 rounded-xl inline-block font-medium transition-all duration-500 ease-in-out w-full sm:w-auto text-center shadow-md hover:shadow-lg overflow-hidden hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center h-full">
              <Brain className="mr-2 h-4 w-4" />
              <span className="text-sm">Try AI Assistant</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-6 md:px-10 lg:px-20 max-w-full mt-6"
    >
      <motion.h2
        className="text-xl font-bold text-[#00305f] mb-6 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
        Wanna see what students are saying?
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Reddit Comments */}
        <motion.div
          className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden card-hover-effect relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut", opacity: { duration: 0.8 } }}
          whileHover={{
            y: -5,
            transition: { duration: 0.2, ease: "easeOut" },
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="bg-[#FF4500]/10 p-4 border-b border-[#FF4500]/20">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="h-8 w-8 text-[#FF4500]">
                  <g>
                    <circle fill="#FF4500" cx="10" cy="10" r="10"/>
                    <path fill="#FFFFFF" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23,1.46,1.46,0,1,0-1.61,2.39,2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"/>
                  </g>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#00305f]">Reddit Comments</h3>
              <div className="ml-auto text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                {redditComments.length > 0 ? (
                  <><span className="mr-1">{redditCommentIndex + 1}</span>/<span className="ml-1">{redditComments.length}</span></>
                ) : "0"}
              </div>
            </div>
          </div>

          <div className="h-[220px] relative">
            {redditComments.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 z-10">
                <motion.button
                  className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center opacity-80 hover:opacity-100 border border-gray-100"
                  onClick={prevRedditComment}
                  whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF4500]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.button>
                <motion.button
                  className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center opacity-80 hover:opacity-100 border border-gray-100"
                  onClick={nextRedditComment}
                  whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF4500]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            )}

            {currentRedditComment ? (
              <motion.div
                key={`reddit-${redditCommentIndex}`}
                className="p-6 h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                    <img src="/queens_reddit_icon.png" alt="Queen's Reddit" className="h-full w-full object-cover" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">r/queensuniversity</div>
                  <div className={`ml-auto text-xs capitalize ${sentimentColor(currentRedditComment.sentiment_label)}`}>
                    {currentRedditComment.sentiment_label}
                  </div>
                </div>

                {currentRedditComment.professor_name && currentRedditComment.professor_name !== "general_prof" && (
                  <div className="mb-3 flex items-center">
                    <span className="text-xs font-medium text-gray-500 mr-1">Professor:</span>
                    <span className="text-xs text-[#00305f] font-medium">{currentRedditComment.professor_name}</span>
                  </div>
                )}

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{currentRedditComment.text}</p>

                {currentRedditComment.tags && currentRedditComment.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {currentRedditComment.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="mr-3">{currentRedditComment.upvotes} upvotes</span>
                  {currentRedditComment.source_url && (
                    <motion.a
                      href={currentRedditComment.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF4500] hover:underline"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      View
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="p-6 h-full flex items-center justify-center text-gray-400">
                No Reddit comments for this course.
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center">
            <motion.a
              href="https://www.reddit.com/r/queensuniversity/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF4500] text-sm font-medium hover:underline flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              See more on Reddit
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </div>
        </motion.div>

        {/* RateMyProf Comments */}
        <motion.div
          className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden card-hover-effect relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut", opacity: { duration: 0.8 } }}
          whileHover={{
            y: -5,
            transition: { duration: 0.2, ease: "easeOut" },
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="bg-[#00305f]/10 p-4 border-b border-[#00305f]/20">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2 flex-shrink-0 bg-[#00305f] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#00305f]">RateMyProf Comments</h3>
              <div className="ml-auto text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                {rmpComments.length > 0 ? (
                  <><span className="mr-1">{rmpCommentIndex + 1}</span>/<span className="ml-1">{rmpComments.length}</span></>
                ) : "0"}
              </div>
            </div>
          </div>

          <div className="h-[220px] relative">
            {rmpComments.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 z-10">
                <motion.button
                  className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center opacity-80 hover:opacity-100 border border-gray-100"
                  onClick={prevRmpComment}
                  whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00305f]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.button>
                <motion.button
                  className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center opacity-80 hover:opacity-100 border border-gray-100"
                  onClick={nextRmpComment}
                  whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00305f]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            )}

            {currentRmpComment ? (
              <motion.div
                key={`rmp-${rmpCommentIndex}`}
                className="p-6 h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-700">Anonymous</div>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${i < Math.floor(currentRmpComment.quality_rating) ? "text-yellow-400" : i < currentRmpComment.quality_rating ? "text-yellow-300" : "text-gray-300"}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className={`ml-auto text-xs capitalize ${sentimentColor(currentRmpComment.sentiment_label)}`}>
                    {currentRmpComment.sentiment_label}
                  </div>
                </div>

                <div className="mb-3 flex items-center">
                  <span className="text-xs font-medium text-gray-500 mr-1">Professor:</span>
                  <a
                    href={currentRmpComment.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00305f] hover:underline font-medium flex items-center"
                  >
                    {currentRmpComment.professor_name}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>

                <p className="text-sm text-gray-700 mb-2 line-clamp-3">{currentRmpComment.text}</p>

                {currentRmpComment.tags && currentRmpComment.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {currentRmpComment.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-2 text-xs">
                  <motion.span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.1 }}>
                    Quality: {currentRmpComment.quality_rating}/5
                  </motion.span>
                  <motion.span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.1 }}>
                    Difficulty: {currentRmpComment.difficulty_rating}/5
                  </motion.span>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 h-full flex items-center justify-center text-gray-400">
                No RateMyProfessor comments for this course.
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center">
            <motion.a
              href="https://www.ratemyprofessors.com/school/1466"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00305f] text-sm font-medium hover:underline flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              See more on RateMyProfessor
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* See All Comments */}
      <motion.div
        className="mt-8 mb-4 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        <Link
          href={`/course-comments?courseCode=${encodeURIComponent(courseCode)}`}
          className="bg-[#00305f] hover:bg-[#00305f]/90 text-white flex items-center gap-2 px-8 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          See All Comments
        </Link>
      </motion.div>

      <motion.div
        className="text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      >
        <p>Comments are aggregated from public sources and may not reflect current course structure.</p>
      </motion.div>

      {/* Chatbot CTA */}
      <div className="mt-10 flex flex-col items-center justify-center">
        <p className="text-base font-medium mb-4 text-gray-800">Talk with our chatbot to get more insights!</p>
        <Link
          href="/queens-answers"
          className="relative group bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white px-6 py-2.5 rounded-xl inline-block font-medium transition-all duration-500 ease-in-out w-full sm:w-auto text-center shadow-md hover:shadow-lg overflow-hidden hover:scale-105"
        >
          <span className="relative z-10 flex items-center justify-center h-full">
            <Brain className="mr-2 h-4 w-4" />
            <span className="text-sm">Try AI Assistant</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
