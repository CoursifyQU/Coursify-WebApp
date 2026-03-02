'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getCommentsForCourse } from '@/lib/db';
import type { RedditComment, RmpComment } from '@/lib/db';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const commentVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function CourseCommentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseCode = searchParams.get('courseCode') || '';
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [redditComments, setRedditComments] = useState<RedditComment[]>([]);
  const [rmpComments, setRmpComments] = useState<RmpComment[]>([]);

  useEffect(() => {
    async function fetchComments() {
      if (!courseCode) {
        setLoading(false);
        return;
      }
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
    fetchComments();
  }, [courseCode]);

  const allComments: Array<(RedditComment & { _type: 'reddit' }) | (RmpComment & { _type: 'rmp' })> = [
    ...redditComments.map(c => ({ ...c, _type: 'reddit' as const })),
    ...rmpComments.map(c => ({ ...c, _type: 'rmp' as const })),
  ];

  const filteredComments = activeTab === 'all'
    ? allComments
    : activeTab === 'reddit'
      ? allComments.filter(c => c._type === 'reddit')
      : allComments.filter(c => c._type === 'rmp');

  const sentimentColor = (label: string) => {
    if (label === "positive") return "text-green-600";
    if (label === "negative") return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex items-center mb-4">
            <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-[#00305f]">
              Student Comments for {courseCode || 'Unknown Course'}
            </h1>
          </div>
          <p className="text-gray-600">
            View all student feedback from Reddit and RateMyProfessor for this course.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex mb-6 border-b"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-[#00305f] border-b-2 border-[#00305f]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Comments
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center ${activeTab === 'reddit' ? 'text-[#FF4500] border-b-2 border-[#FF4500]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('reddit')}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <circle fill={activeTab === 'reddit' ? "#FF4500" : "currentColor"} cx="10" cy="10" r="10"/>
              <path fill="white" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23,1.46,1.46,0,1,0-1.61,2.39,2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"/>
            </svg>
            Reddit ({redditComments.length})
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center ${activeTab === 'rmp' ? 'text-[#00305f] border-b-2 border-[#00305f]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('rmp')}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            RateMyProfessor ({rmpComments.length})
          </button>
        </motion.div>

        {/* Comments List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00305f]"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filteredComments.map((comment, index) => {
              const isReddit = comment._type === 'reddit';

              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
                  variants={commentVariant}
                >
                  {isReddit ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full mr-2 flex items-center justify-center overflow-hidden bg-[#FF4500]">
                            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23,1.46,1.46,0,1,0-1.61,2.39,2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium">r/queensuniversity</div>
                          </div>
                        </div>
                        <span className={`text-xs capitalize ${sentimentColor(comment.sentiment_label)}`}>
                          {comment.sentiment_label}
                        </span>
                      </div>

                      {comment.professor_name && comment.professor_name !== "general_prof" && (
                        <div className="mb-2 flex items-center">
                          <span className="text-xs font-medium text-gray-500 mr-1">Professor:</span>
                          <span className="text-xs text-[#00305f] font-medium">{comment.professor_name}</span>
                        </div>
                      )}

                      <p className="text-sm text-gray-700 mb-3">{comment.text}</p>

                      {comment.tags && comment.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {comment.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                          <span>{(comment as RedditComment).upvotes} upvotes</span>
                        </div>
                        {comment.source_url && (
                          <a
                            href={comment.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#FF4500] hover:underline flex items-center"
                          >
                            View on Reddit
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-700">Anonymous</div>
                          <div className="ml-2 flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${i < Math.floor((comment as RmpComment).quality_rating) ? "text-yellow-400" : i < (comment as RmpComment).quality_rating ? "text-yellow-300" : "text-gray-300"}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className={`text-xs capitalize ${sentimentColor(comment.sentiment_label)}`}>
                          {comment.sentiment_label}
                        </span>
                      </div>

                      <div className="mb-2 flex items-center">
                        <span className="text-xs font-medium text-gray-500 mr-1">Professor:</span>
                        <a
                          href={comment.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#00305f] hover:underline font-medium flex items-center"
                        >
                          {comment.professor_name}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </a>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{comment.text}</p>

                      {comment.tags && comment.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {comment.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          Quality: {(comment as RmpComment).quality_rating}/5
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Difficulty: {(comment as RmpComment).difficulty_rating}/5
                        </span>
                        <div className="flex-grow"></div>
                        {comment.source_url && (
                          <a
                            href={comment.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#00305f] hover:underline flex items-center"
                          >
                            View on RMP
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!loading && filteredComments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {courseCode ? "No comments found for this filter." : "No course code provided. Please navigate from a course page."}
            </p>
            {courseCode && (
              <Button onClick={() => setActiveTab('all')} variant="outline">
                View All Comments
              </Button>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Comments are aggregated from public sources and may not reflect current course structure.</p>
        </div>
      </div>
    </div>
  );
}
