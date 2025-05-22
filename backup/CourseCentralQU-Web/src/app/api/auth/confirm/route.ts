import { createRouteHandlerClient } from '@/lib/auth-helpers';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Auth confirm route hit:', request.url);
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code') || '';
  const redirectUrl = new URL('/verify-email', request.url);
  
  // Add the original query parameters to the redirect URL
  requestUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.append(key, value);
  });
  
  console.log('Redirecting to verify-email page with params:', redirectUrl.toString());
  
  return NextResponse.redirect(redirectUrl);
} 