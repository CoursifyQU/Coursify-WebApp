"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { SemesterPromptModal } from "@/components/semester-prompt-modal";
import { shouldShowSemesterPrompt } from "@/lib/semester";

// Delay showing the prompt so the page can load first
const PROMPT_DELAY_MS = 2500;

export function SemesterPromptProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, profileLoading, isLoading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompted, setPrompted] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading || profileLoading) return;
    // No user = no prompt
    if (!user) return;
    // No profile yet = no prompt
    if (!profile) return;
    // Already shown this session
    if (prompted) return;
    // First-year students are exempt
    if (profile.is_first_year) return;
    // Check if this semester's prompt has been shown
    if (!shouldShowSemesterPrompt(profile.last_semester_prompted)) return;

    // Delay prompt slightly so page loads first
    const timeout = setTimeout(() => {
      setShowPrompt(true);
    }, PROMPT_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [user, profile, profileLoading, isLoading, prompted]);

  const handleClose = () => {
    setShowPrompt(false);
  };

  const handleDismissed = () => {
    setPrompted(true);
  };

  return (
    <>
      {children}
      <SemesterPromptModal
        isOpen={showPrompt}
        onClose={handleClose}
        onDismissed={handleDismissed}
      />
    </>
  );
}
