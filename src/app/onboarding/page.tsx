"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useMotionTier } from "@/lib/motion-prefs";

const YEAR_OPTIONS = [
  { label: "1st Year", value: 1 },
  { label: "2nd Year", value: 2 },
  { label: "3rd Year", value: 3 },
  { label: "4th Year", value: 4 },
  { label: "5th Year", value: 5 },
  { label: "6th+ Year", value: 6 },
];

const SEMESTER_OPTIONS = [
  { label: "1st Semester", value: 1 },
  { label: "2nd Semester", value: 2 },
];

export default function OnboardingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const lite = useMotionTier() === "lite";

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/sign-in");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      try {
        const { data: session } = await getSupabaseClient().auth.getSession();
        const token = session?.session?.access_token;
        if (!token) return;
        const res = await fetch("/api/me/access-status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.needs_onboarding) router.push("/");
        }
      } finally {
        setChecking(false);
      }
    };
    void check();
  }, [user, router]);

  const handleSubmit = async () => {
    if (!selectedYear || !selectedSemester || !user) return;
    setIsSubmitting(true);
    try {
      const { data: session } = await getSupabaseClient().auth.getSession();
      const token = session?.session?.access_token;
      if (!token) throw new Error("Not authenticated");
      const res = await fetch("/api/me/academic-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ year_of_study: selectedYear, current_semester: selectedSemester }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save profile");
      }
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-navy/20 border-t-brand-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="liquid-blob w-[500px] h-[400px] bg-brand-navy" style={{ top: "-5%", left: "-8%", animationDelay: "0s" }} />
        <div className="liquid-blob-alt w-[400px] h-[450px] bg-brand-red" style={{ bottom: "-10%", right: "-5%", animationDelay: "-4s" }} />
        <div className="liquid-blob w-[350px] h-[350px] bg-brand-gold" style={{ top: "40%", left: "45%", animationDelay: "-8s" }} />
      </div>

      {/* Card */}
      <motion.div
        className="relative z-10 glass-modal-panel w-full max-w-md rounded-[1.75rem] p-7 sm:p-8"
        initial={false}
        animate={lite ? undefined : { opacity: 1, y: 0 }}
        transition={lite ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Accent bar */}
        <div className="glass-modal-accent mx-auto mb-5 h-1.5 w-20 rounded-full opacity-90" />

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "glass-modal-accent opacity-90" : "bg-brand-navy/10 dark:bg-white/10"}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "glass-modal-accent opacity-90" : "bg-brand-navy/10 dark:bg-white/10"}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={lite ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={lite ? undefined : { opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white mb-1.5 tracking-tight">
                What year are you in?
              </h1>
              <p className="text-sm text-brand-navy/60 dark:text-white/55 mb-6 leading-relaxed">
                This tells us whether you&apos;re required to contribute grade data.
              </p>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {YEAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedYear(opt.value)}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200
                      border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/40
                      ${selectedYear === opt.value
                        ? "bg-brand-navy dark:bg-brand-navy text-white border-brand-navy shadow-md scale-[1.03]"
                        : "bg-brand-navy/5 dark:bg-white/[0.07] border-brand-navy/15 dark:border-white/10 text-brand-navy dark:text-white hover:bg-brand-navy/10 dark:hover:bg-white/[0.12] hover:border-brand-navy/25"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={selectedYear === null}
                onClick={() => setStep(2)}
                className="liquid-btn-red w-full rounded-full py-3.5 font-semibold text-white text-sm disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              >
                Continue →
              </button>

              <p className="mt-4 text-xs text-center text-brand-navy/40 dark:text-white/35">
                First-year, first-semester students are exempt from contributing.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={lite ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={lite ? undefined : { opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white mb-1.5 tracking-tight">
                Which semester?
              </h1>
              <p className="text-sm text-brand-navy/60 dark:text-white/55 mb-6 leading-relaxed">
                We use this to understand your current academic stage.
              </p>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {SEMESTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedSemester(opt.value)}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200
                      border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/40
                      ${selectedSemester === opt.value
                        ? "bg-brand-navy dark:bg-brand-navy text-white border-brand-navy shadow-md scale-[1.03]"
                        : "bg-brand-navy/5 dark:bg-white/[0.07] border-brand-navy/15 dark:border-white/10 text-brand-navy dark:text-white hover:bg-brand-navy/10 dark:hover:bg-white/[0.12] hover:border-brand-navy/25"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={selectedSemester === null || isSubmitting}
                onClick={handleSubmit}
                className="liquid-btn-red w-full rounded-full py-3.5 font-semibold text-white text-sm disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Getting started…
                  </span>
                ) : "Get Started →"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-3 w-full text-sm text-brand-navy/45 dark:text-white/35 hover:text-brand-navy dark:hover:text-white transition-colors text-center py-1"
              >
                ← Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
