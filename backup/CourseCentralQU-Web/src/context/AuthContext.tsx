'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { isQueensEmail } from '@/utils/validation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
  resendVerificationEmail: (email: string) => Promise<{ error: any; data?: any }>;
  resetPassword: (email: string) => Promise<{ error: any; data?: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
        }

        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    try {
      // Listen for changes on auth state
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          if (session) {
            setSession(session);
            setUser(session.user);
          } else {
            setSession(null);
            setUser(null);
          }
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Auth state change subscription error:', error);
      setIsLoading(false);
      return () => {};
    }
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      if (!isQueensEmail(email)) {
        console.error('Only @queensu.ca email addresses are allowed');
        return { error: { message: 'Only @queensu.ca email addresses are allowed' } };
      }

      // First, attempt to sign up - Supabase will return error if email exists
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
          data: {
            confirmed_at: null,
          },
        },
      });

      if (error) {
        // Error code 422 means email already exists
        if (error.status === 400 && error.message.includes('already registered')) {
          console.error('Email already registered');
          return { error: { message: 'This email is already registered. Please use the login page or reset your password.' } };
        }
        
        console.error('Sign up error:', error.message);
        return { error };
      }

      // Check if user.identities array is empty (another way to detect existing accounts)
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        console.error('Email already registered (empty identities)');
        return { error: { message: 'This email is already registered. Please use the login page or reset your password.' } };
      }

      console.log('Sign up successful, confirmation email sent');
      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected sign up error:', error);
      return { error: { message: error.message } };
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email: string) => {
    try {
      if (!isQueensEmail(email)) {
        console.error('Only @queensu.ca email addresses are allowed');
        return { error: { message: 'Only @queensu.ca email addresses are allowed' } };
      }

      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) {
        console.error('Error resending verification email:', error.message);
        return { error };
      }

      console.log('Verification email resent');
      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected error resending verification email:', error);
      return { error: { message: error.message } };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      // Validate Queen's email
      if (!isQueensEmail(email)) {
        return { 
          error: { 
            message: 'Only Queen\'s University email addresses (@queensu.ca) are allowed'
          } 
        };
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('Unexpected signin error:', err);
      return { error: { message: 'An unexpected error occurred during sign in' } };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // First manually clear our local state
      setUser(null);
      setSession(null);
      
      // Clear localStorage items related to Supabase
      if (typeof window !== 'undefined') {
        // Clear localStorage items that might be related to auth
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Then try to sign out from Supabase (but don't worry if it fails due to missing session)
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error (non-critical):', error);
      }
      
      // Always return success since we've cleared the local state
      return { success: true };
    } catch (error: any) {
      console.error('Error during sign out:', error);
      // Still consider it a success if we've cleared the local state
      return { success: true };
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      if (!isQueensEmail(email)) {
        console.error('Only @queensu.ca email addresses are allowed');
        return { 
          error: { message: 'Only @queensu.ca email addresses are allowed' },
          data: null
        };
      }
      
      // Try to get user information through a sign-in attempt
      // We'll use the error message to determine if the user exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'this-is-a-fake-password-to-check-existence'
      });
      
      // Check error message to determine if user doesn't exist
      // Note: Different auth providers may have different error messages
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          // This error happens when the password is wrong but the email exists
          // In this case, we can proceed with the password reset
          console.log('User exists, sending password reset email');
        } else if (
          signInError.message.includes('user not found') || 
          signInError.message.includes('Email not confirmed')
        ) {
          // Email is not registered or not confirmed
          console.error('Email not found or not confirmed');
          return { 
            error: { message: 'This email is not registered or not confirmed. Please sign up or verify your email first.' },
            data: null
          };
        }
      } else {
        // This shouldn't happen with a fake password, but just in case
        // Sign out immediately if the login somehow succeeds
        await supabase.auth.signOut();
      }
      
      // If we get here, attempt to send the reset email
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        console.error('Reset password error:', error.message);
        return { error, data: null };
      }
      
      console.log('Password reset email sent');
      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected reset password error:', error);
      return { 
        error: { message: error.message },
        data: null
      };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resendVerificationEmail,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 