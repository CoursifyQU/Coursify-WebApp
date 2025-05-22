'use client';

import { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function CatchAllVerificationRoute() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get the path parts
    console.log('Catch-all route hit with params:', params);
    console.log('All search params:', Object.fromEntries(searchParams.entries()));
    console.log('Current URL:', window.location.href);
    
    // Redirect to the verification page with all parameters
    const verifyUrl = new URL('/verify-email', window.location.origin);
    
    // Add all search params
    searchParams.forEach((value, key) => {
      verifyUrl.searchParams.append(key, value);
    });
    
    // Add hash if present
    if (window.location.hash) {
      verifyUrl.hash = window.location.hash;
    }
    
    console.log('Redirecting to:', verifyUrl.toString());
    
    // Navigate to the verification page
    router.push(verifyUrl.toString());
  }, [params, router, searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
        <div className="mb-4 w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto"></div>
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we verify your email.</p>
      </div>
    </div>
  );
} 