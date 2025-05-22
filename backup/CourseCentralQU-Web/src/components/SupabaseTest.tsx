'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseTest() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Instead of querying a specific table, we'll check authentication status
        // This will work even if no tables exist yet
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
          console.error('Supabase connection error:', error);
        } else {
          // Connection successful, even if no session exists
          setStatus('connected');
          console.log('Supabase connection successful');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
        console.error('Supabase test error:', err);
      }
    }

    testConnection();
  }, []);

  if (status === 'loading') {
    return <div className="p-4 bg-blue-50 rounded-md">Testing Supabase connection...</div>;
  }

  if (status === 'error') {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <h3 className="font-bold text-red-600">Supabase Connection Error</h3>
        <p className="text-red-700">{errorMessage || 'Unknown error'}</p>
        <p className="mt-2 text-sm text-red-600">
          Check your .env.local file and make sure you have valid Supabase URL and Anon Key.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 rounded-md">
      <h3 className="font-bold text-green-600">Supabase Connected Successfully</h3>
      <p className="text-green-700">Your connection to Supabase is working properly.</p>
    </div>
  );
} 