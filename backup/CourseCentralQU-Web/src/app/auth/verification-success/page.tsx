'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

// Inner component that uses searchParams
function VerificationSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirect_to') || '/';
  const { user, isLoading: authLoading } = useAuth();
  
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Log page load
    console.log('Verification success page loaded');
    console.log('Redirect parameter:', redirectTo);
    console.log('User authenticated:', !!user);
    
    try {
      // Start countdown to auto-redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          console.log('Countdown:', prev);
          if (prev <= 1) {
            clearInterval(timer);
            // If user is already logged in, go directly to home or the redirect URL
            if (user) {
              console.log('User already logged in, redirecting to:', redirectTo);
              router.push(redirectTo);
            } else {
              console.log('Redirecting to login page with verified=true parameter');
              router.push('/login?verified=true');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        console.log('Cleaning up timer');
        clearInterval(timer);
      };
    } catch (err) {
      console.error('Error in countdown timer:', err);
      setError('An error occurred while setting up the page. Please try again.');
    }
  }, [router, redirectTo, user]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
            <h1 className="text-xl font-bold text-red-700 mb-3">Error Loading Page</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link 
              href="/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go to Login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
            {/* Celebration animation */}
            <div className="flex justify-center mb-6 relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Animated confetti effect */}
              <div className="absolute -top-5 left-0 right-0 flex justify-center">
                <div className="animate-bounce-slow delay-75">
                  <div className="h-10 w-10 transform rotate-12">
                    <div className="h-2 w-2 rounded-full bg-yellow-400 absolute"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-500 absolute" style={{ top: '18px', left: '15px' }}></div>
                    <div className="h-2 w-2 rounded-full bg-red-500 absolute" style={{ top: '8px', left: '25px' }}></div>
                  </div>
                </div>
                <div className="animate-bounce-slow delay-150">
                  <div className="h-10 w-10 transform -rotate-12">
                    <div className="h-2 w-2 rounded-full bg-purple-500 absolute"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500 absolute" style={{ top: '18px', left: '15px' }}></div>
                    <div className="h-2 w-2 rounded-full bg-pink-500 absolute" style={{ top: '8px', left: '25px' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">Email Verified Successfully!</h1>
            
            <p className="text-center text-gray-600 mb-6">
              Your account has been successfully verified. 
              {!user && " You can now sign in with your Queen's University email and password to access all features."}
            </p>

            <div className="space-y-2 my-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-700">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1.5">
                {!user && (
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Log in with your verified account</span>
                  </li>
                )}
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
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Redirecting to {user ? redirectTo === '/' ? 'home' : 'your destination' : 'login'} in {countdown} seconds...
              </p>
              
              <div className="flex flex-col space-y-4">
                {user ? (
                  <button
                    onClick={() => {
                      console.log('Home button clicked');
                      router.push(redirectTo);
                    }}
                    className="px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
                  >
                    Continue to {redirectTo === '/' ? 'Home' : 'Destination'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      console.log('Login button clicked');
                      router.push('/login?verified=true');
                    }}
                    className="px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
                  >
                    Log in now
                  </button>
                )}
                {redirectTo !== '/' && !user && (
                  <button
                    onClick={() => {
                      console.log('Destination button clicked, going to:', redirectTo);
                      router.push(redirectTo);
                    }}
                    className="px-4 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go directly to destination
                  </button>
                )}
                <Link
                  href="/"
                  className="inline-block text-[#00305f] hover:text-[#00305f]/80 font-medium transition-colors"
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
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-10%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .delay-75 {
          animation-delay: 0.75s;
        }
        .delay-150 {
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
}

// Main component wrapped in Suspense
export default function VerificationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-center">
          <div className="mx-auto w-24 h-24 border-t-4 border-green-500 border-solid rounded-full animate-spin mb-6"></div>
          <p className="text-gray-600">Loading verification success...</p>
        </div>
      </div>
    }>
      <VerificationSuccessContent />
    </Suspense>
  );
} 