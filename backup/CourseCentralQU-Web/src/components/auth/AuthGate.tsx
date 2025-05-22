'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthGateProps {
  children: React.ReactNode;
  redirectUrl?: string;
  message?: string;
}

export default function AuthGate({ 
  children, 
  redirectUrl = '/login', 
  message = 'Please log in to access this feature'
}: AuthGateProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  // If logged in, just show the children
  if (user) {
    return <>{children}</>;
  }

  // If still loading auth state, show children with no interaction
  if (isLoading) {
    return <div className="relative opacity-70 pointer-events-none">{children}</div>;
  }

  // If not logged in, show overlay when interacted with
  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Either show overlay or redirect immediately
    setShowOverlay(true);
  };
  
  const handleLogin = () => {
    router.push(`${redirectUrl}?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  const handleSignup = () => {
    router.push(`/signup?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  return (
    <div className="relative">
      {/* Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-gray-200">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-[#00305f]/10 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00305f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Sign in required</h3>
              <p className="mt-2 text-gray-600">{message}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleLogin}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#00305f] to-[#00305f]/90 text-white font-medium rounded-lg transition-colors hover:from-[#00305f]/90 hover:to-[#00305f]/80"
              >
                Log in
              </button>
              <button
                onClick={handleSignup}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#d62839] to-[#a31e36] text-white font-medium rounded-lg transition-colors hover:from-[#c61e29] hover:to-[#8a1a2e]"
              >
                Sign up
              </button>
            </div>
            
            <button
              onClick={() => setShowOverlay(false)}
              className="mt-4 w-full py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Semi-transparent overlay to indicate interactivity */}
      <div 
        className="absolute inset-0 z-5 cursor-pointer bg-gray-900/0 hover:bg-gray-900/5 transition-colors duration-200"
        onClick={handleInteraction}
      />
      
      {/* Original content */}
      <div className="relative">
        {children}
      </div>
      
      {/* Add animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 