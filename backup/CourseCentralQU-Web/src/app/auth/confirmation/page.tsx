'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ResendVerification from '@/components/auth/ResendVerification';

// Inner component that uses searchParams
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const errorCode = searchParams.get('error_code');
  const redirectTo = searchParams.get('redirect_to') || '/';
  
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // For successful confirmations, redirect to the success page
    if (status === 'success') {
      router.push('/auth/success-page');
      return;
    }
    
    // Only start countdown for success status
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(redirectTo);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, router, redirectTo]);

  // If it's a success, we'll redirect to success-page
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto"></div>
          <h1 className="text-2xl font-bold mb-2">Redirecting to Success Page...</h1>
          <p className="text-gray-600">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-red-200">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">
              Verification Issue
            </h1>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-600 mb-2 font-medium">
                {errorCode ? `Error ${errorCode}` : (error ? `Error: ${error}` : 'Error during verification')}
              </p>
              <p className="text-red-700 text-sm">
                {errorDescription || "There was an issue verifying your email. You may need to request a new verification email."}
              </p>
            </div>
            
            {/* Resend verification component */}
            <ResendVerification />
            
            <div className="text-center space-y-3 mt-6">
              <Link
                href="/auth/success-page"
                className="block w-full py-3 bg-blue-600 text-white font-medium rounded-lg transition-colors text-center"
              >
                Try Direct Success Page
              </Link>
              
              <Link
                href="/signup"
                className="block w-full py-3 bg-gradient-to-r from-[#d62839] to-[#a31e36] text-white font-medium rounded-lg transition-colors text-center"
              >
                Try Signing Up Again
              </Link>
              
              <Link
                href="/"
                className="inline-block text-[#00305f] hover:text-[#00305f]/80 font-medium transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00305f]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-center">
          <div className="mx-auto w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-6"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
} 