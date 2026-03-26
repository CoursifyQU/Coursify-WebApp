"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  display_name: string | null;
  year_of_study: number;
  last_semester_prompted: string | null;
  is_first_year: boolean;
  contribution_count: number;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  profile: UserProfile | null;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, yearOfStudy: number) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const supabase = getSupabaseClient();

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession?.access_token) {
        setProfile(null);
        return;
      }
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile ?? null);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        await fetchProfile();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        await fetchProfile();
      } else {
        setProfile(null);
      }
    });

    setData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signUp = async (email: string, password: string, yearOfStudy: number = 1) => {
    // First try to clear any existing session or metadata for this user
    try {
      // This helps clear out any lingering sessions
      await supabase.auth.signOut();
      
      // Force a refresh of the auth state
      const { error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.error("Failed to refresh session:", sessionError);
      }
    } catch (err) {
      console.error("Error clearing previous auth state:", err);
    }

    // Now attempt to sign up, storing year_of_study in user metadata
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          year_of_study: yearOfStudy,
        },
      },
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      console.error("Sign out error:", error);
    }
    // Clear local state immediately regardless of error
    setUser(null);
    setSession(null);
    setProfile(null);
    window.location.href = "/";
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    return { error };
  };

  const value = {
    user,
    session,
    isLoading,
    profile,
    profileLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 