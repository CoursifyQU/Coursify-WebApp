'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function StandaloneSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200 animate-fade-in-up">
            {/* Success icon with animated confetti */}
            <div className="flex justify-center mb-6 relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse-slow">
                <svg className="h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Confetti elements */}
              <div className="absolute -top-12 left-0 right-0 flex justify-around">
                <div className="confetti-item bg-yellow-400"></div>
                <div className="confetti-item bg-blue-500 delay-150"></div>
                <div className="confetti-item bg-red-500 delay-300"></div>
                <div className="confetti-item bg-green-500 delay-450"></div>
                <div className="confetti-item bg-purple-500 delay-600"></div>
                <div className="confetti-item bg-pink-500 delay-750"></div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-3 animate-fade-in">Email Verified Successfully!</h1>
            
            <p className="text-center text-gray-600 mb-6 animate-fade-in delay-150">
              Your account has been successfully verified. You can now sign in with your Queen's University email and password to access all features.
            </p>

            <div className="space-y-2 my-8 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in delay-300">
              <h3 className="font-medium text-blue-700">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1.5">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Log in with your verified account</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Explore courses and access the AI Assistant</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Consider sharing a course distribution</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center animate-fade-in delay-450">              
              <div className="flex flex-col space-y-4">
                <Link
                  href="/login"
                  className="px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors text-center transform hover:scale-105 transition-transform"
                >
                  Go to Login
                </Link>
                <Link
                  href="/"
                  className="inline-block text-[#00305f] hover:text-[#00305f]/80 font-medium transition-colors text-center"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00305f]/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulseSlow {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
        
        @keyframes confettiFall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(60px) rotate(90deg);
            opacity: 0;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 2s infinite;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-450 {
          animation-delay: 450ms;
        }
        
        .delay-600 {
          animation-delay: 600ms;
        }
        
        .delay-750 {
          animation-delay: 750ms;
        }
        
        .confetti-item {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          animation: confettiFall 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 