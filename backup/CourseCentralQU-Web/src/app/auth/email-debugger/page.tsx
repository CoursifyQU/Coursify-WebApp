'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Inner component that uses searchParams
function EmailDebuggerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [urlInfo, setUrlInfo] = useState<{
    fullUrl: string;
    params: Record<string, string>;
    hash: string;
  }>({
    fullUrl: '',
    params: {},
    hash: ''
  });
  
  useEffect(() => {
    // Log all URL information
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    const fullUrl = window.location.href;
    const hash = window.location.hash;
    
    setUrlInfo({
      fullUrl,
      params,
      hash
    });
    
    // Extract all hash parameters if present
    let hashParams: Record<string, string> = {};
    if (hash) {
      const searchParamsFromHash = new URLSearchParams(hash.substring(1));
      searchParamsFromHash.forEach((value, key) => {
        hashParams[key] = value;
      });
    }
    
    console.log('Full URL:', fullUrl);
    console.log('URL Params:', params);
    console.log('Hash:', hash);
    console.log('Hash Params:', hashParams);
    
  }, [searchParams]);
  
  // Function to forward to verification page
  const forwardToVerification = () => {
    // Construct the verification URL with all parameters
    const verifyUrl = new URL('/verify-email', window.location.origin);
    
    // Add all search params
    searchParams.forEach((value, key) => {
      verifyUrl.searchParams.append(key, value);
    });
    
    // Add hash if present
    if (window.location.hash) {
      verifyUrl.hash = window.location.hash;
    }
    
    // Navigate to the verification page
    router.push(verifyUrl.toString());
  };
  
  return (
    <div className="min-h-screen flex flex-col py-12 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Email Verification Debugger</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">URL Information</h2>
          <div className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-40 mb-4">
            <p className="text-xs font-mono break-all whitespace-pre-wrap">Full URL: {urlInfo.fullUrl}</p>
          </div>
          
          <h3 className="font-medium mb-1 text-gray-700">URL Parameters:</h3>
          <div className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-40 mb-4">
            <pre className="text-xs font-mono">{JSON.stringify(urlInfo.params, null, 2)}</pre>
          </div>
          
          {urlInfo.hash && (
            <>
              <h3 className="font-medium mb-1 text-gray-700">URL Hash:</h3>
              <div className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-40">
                <p className="text-xs font-mono break-all">{urlInfo.hash}</p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={forwardToVerification}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Proceed to Verification
          </button>
          
          <Link href="/auth/success-page" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Go to Success Page
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function EmailDebuggerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-center">
          <div className="mx-auto w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-6"></div>
          <p className="text-gray-600">Loading debugger...</p>
        </div>
      </div>
    }>
      <EmailDebuggerContent />
    </Suspense>
  );
} 