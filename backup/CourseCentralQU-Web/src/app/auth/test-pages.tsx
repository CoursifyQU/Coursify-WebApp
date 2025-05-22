'use client';

/**
 * Utility functions for testing verification flows
 * This can be imported in other components to trigger test redirects
 */

import { useRouter } from 'next/navigation';

/**
 * Helper function to navigate to the verification success page
 */
export function goToVerificationSuccess(router: any) {
  console.log('Navigating to verification success page');
  router.push('/auth/verification-success?redirect_to=/');
}

/**
 * Helper function to simulate the verification callback with a test code
 */
export function simulateVerificationCallback(router: any) {
  console.log('Simulating verification callback');
  router.push('/auth/callback?code=test_code');
} 