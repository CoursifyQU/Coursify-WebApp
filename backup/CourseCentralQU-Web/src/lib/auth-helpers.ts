import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// This is an adapter to replace the functionality from @supabase/auth-helpers-nextjs
// without requiring the additional package

export const createRouteHandlerClient = ({ cookies: getCookies }: { cookies: () => any }) => {
  // First try to use our pre-initialized supabase client
  if (supabase) {
    return supabase;
  }
  
  // Fallback to creating a new client if needed
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in createRouteHandlerClient');
    throw new Error('Missing Supabase environment variables. Please check your environment configuration.');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}; 