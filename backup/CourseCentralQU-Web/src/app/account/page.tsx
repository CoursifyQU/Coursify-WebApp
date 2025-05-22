'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import AuthGate from '@/components/auth/AuthGate';
import UserAvatar from '@/components/UserAvatar';

export default function AccountPage() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      
      // Clear all localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      // Force a complete page reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <AuthGate>
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">
                Account Settings
              </h1>
              <div className="relative mx-auto w-24 mb-6 mt-2">
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] rounded-full mx-auto"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
              </div>
              <p className="text-gray-600">
                Manage your CourseCentral account
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 bg-[#00305f]/5 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <UserAvatar size="lg" />
                  <div>
                    <h2 className="text-xl font-semibold text-[#00305f]">me</h2>
                    <p className="text-sm text-gray-600">Queen's University Account</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email verified</p>
                      <p className="mt-1 text-gray-900">
                        {user?.email_confirmed_at ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account created</p>
                      <p className="mt-1 text-gray-900">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/forgot-password"
                      className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-center text-gray-700 font-medium transition-colors"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>
                
                <div>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg transition-colors shadow-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {isSigningOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AuthGate>
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