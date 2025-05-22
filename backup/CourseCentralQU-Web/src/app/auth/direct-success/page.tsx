'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DirectSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Log that we're on this page
    console.log('Direct success page loaded');

    // Immediately redirect to verification success
    router.push('/auth/verification-success?redirect_to=/');
    
    // No cleanup needed since we're redirecting immediately
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Taking you to the verification success page.</p>
      </div>
    </div>
  );
} 