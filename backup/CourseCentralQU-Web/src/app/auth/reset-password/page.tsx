'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import { isValidPassword } from '@/utils/validation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!isValidPassword(password)) {
      setError('Password should be at least 6 characters long');
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Show success message
      setSuccess('Your password has been successfully reset.');
      
      // Clear the form
      setPassword('');
      setConfirmPassword('');
      
      // Redirect to login after 5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch (err) {
      console.error('Password update error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is in a valid password recovery flow
  useEffect(() => {
    const checkRecoveryFlow = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error.message);
          setError('Unable to verify your session. Please try the password reset process again.');
          return;
        }
        
        // If no active session or not in a recovery flow, redirect to forgot password
        if (!data.session) {
          setError('Invalid or expired password reset link. Please request a new password reset email.');
          setTimeout(() => {
            router.push('/forgot-password');
          }, 3000);
          return;
        }
        
        // Check if user is in the middle of a password reset (recovery) flow
        // We can't reliably detect this with Supabase's current API, so we'll
        // rely on the route checking that was done in the auth callback route
        
      } catch (e) {
        console.error('Error checking recovery flow:', e);
        setError('There was a problem verifying your session. Please try again.');
        setTimeout(() => {
          router.push('/forgot-password');
        }, 3000);
      }
    };
    
    checkRecoveryFlow();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">
              Create New Password
            </h1>
            <div className="relative mx-auto w-24 mb-6 mt-2">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
            </div>
            <p className="text-gray-600">
              Enter and confirm your new password below
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00305f] focus:border-[#00305f] transition-colors text-gray-900 bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00305f] focus:border-[#00305f] transition-colors text-gray-900 bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 bg-gradient-to-r from-[#d62839] to-[#a31e36] text-white font-medium rounded-lg transition-colors shadow-md hover:from-[#c61e29] hover:to-[#8a1a2e] ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Updating Password...' : 'Reset Password'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link href="/login" className="text-[#00305f] hover:text-[#00305f]/80 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.95; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 