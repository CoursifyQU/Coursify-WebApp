"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, ArrowRight, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { UploadDistributionResponse } from "@/types";

const COUNTDOWN_SECONDS = 60;

interface SemesterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismissed: () => void;
}

export function SemesterPromptModal({ isOpen, onClose, onDismissed }: SemesterPromptModalProps) {
  const { refreshProfile } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [canSkip, setCanSkip] = useState(false);
  const [uploadPhase, setUploadPhase] = useState<"idle" | "uploading" | "validating" | "done" | "error">("idle");
  const [uploadResult, setUploadResult] = useState<UploadDistributionResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(COUNTDOWN_SECONDS);
      setCanSkip(false);
      setUploadPhase("idle");
      setUploadResult(null);
      setUploadError(null);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || canSkip) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, canSkip]);

  const markPrompted = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch("/api/profile/semester-prompt", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      await refreshProfile();
    } catch {
      // silently fail
    }
  }, [refreshProfile]);

  const handleSkip = async () => {
    await markPrompted();
    onDismissed();
    onClose();
  };

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setUploadPhase("error");
      setUploadError("Please upload a PDF file.");
      return;
    }

    setUploadPhase("uploading");
    setUploadError(null);

    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated.");

      const formData = new FormData();
      formData.append("file", file);
      setUploadPhase("validating");

      const response = await fetch("/api/upload-distribution", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });

      const result: UploadDistributionResponse = await response.json();
      if (!response.ok) throw new Error(result.errors?.[0] || "Upload failed.");

      setUploadPhase("done");
      setUploadResult(result);
      await refreshProfile();
      await markPrompted();
    } catch (error) {
      setUploadPhase("error");
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleUpload(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]);
  };

  const handleDoneClose = async () => {
    onDismissed();
    onClose();
  };

  const circumference = 2 * Math.PI * 26; // r=26
  const strokeDashoffset = circumference * (1 - secondsLeft / COUNTDOWN_SECONDS);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-modal-overlay modal-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={(e) => {
            // Only allow backdrop close after timer expires
            if (canSkip && e.target === e.currentTarget) handleSkip();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-modal-panel relative max-w-md w-full rounded-[1.75rem] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Skip button — only visible after countdown */}
            <AnimatePresence>
              {canSkip && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  type="button"
                  className="glass-modal-close absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold text-brand-navy/55 dark:text-white/55 hover:text-brand-red"
                  onClick={handleSkip}
                  aria-label="Skip"
                >
                  &times;
                </motion.button>
              )}
            </AnimatePresence>

            <div className="glass-modal-accent h-1.5 w-24 rounded-full mb-5 opacity-90" />

            {uploadPhase === "done" && uploadResult ? (
              /* Success state */
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-brand-navy dark:text-white">Thank you!</h2>
                {uploadResult.inserted > 0 && (
                  <p className="text-sm text-brand-navy/70 dark:text-white/70">
                    {uploadResult.inserted} course{uploadResult.inserted !== 1 ? "s" : ""} added for {uploadResult.term}.
                    You've helped the Queen's community!
                  </p>
                )}
                {uploadResult.inserted === 0 && (
                  <p className="text-sm text-brand-navy/70 dark:text-white/70">
                    No new data added — distributions for this term may already exist.
                  </p>
                )}
                <button
                  onClick={handleDoneClose}
                  className="w-full liquid-btn-red text-white rounded-2xl px-6 py-3 font-medium flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Upload prompt state */
              <>
                {/* Countdown timer ring */}
                {!canSkip && (
                  <div className="flex justify-center mb-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" className="text-brand-navy/10 dark:text-white/10" strokeWidth="4" />
                        <circle
                          cx="30" cy="30" r="26"
                          fill="none"
                          stroke="currentColor"
                          className="text-brand-red transition-all duration-1000"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-brand-navy dark:text-white tabular-nums">{secondsLeft}</span>
                      </div>
                    </div>
                  </div>
                )}

                <h2 className="text-xl font-bold text-brand-navy dark:text-white mb-2 text-center">
                  New semester, new data!
                </h2>
                <p className="text-sm text-brand-navy/70 dark:text-white/70 leading-relaxed mb-5 text-center">
                  Help the Queen's student community by uploading your latest SOLUS grade distribution.
                  {!canSkip && (
                    <span className="block mt-1 text-xs text-gray-400">
                      Skip option available in {secondsLeft}s
                    </span>
                  )}
                </p>

                {/* Dropzone */}
                <div className="relative mb-4">
                  {(uploadPhase === "uploading" || uploadPhase === "validating") && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col items-center justify-center z-10 rounded-2xl">
                      <div className="w-8 h-8 border-4 border-brand-navy/20 border-t-brand-navy dark:border-t-blue-400 rounded-full animate-spin mb-2" />
                      <p className="text-sm text-brand-navy dark:text-white font-medium">
                        {uploadPhase === "uploading" ? "Uploading..." : "Validating..."}
                      </p>
                    </div>
                  )}

                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-5 flex flex-col items-center text-center hover:border-brand-navy dark:hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-10 h-10 bg-brand-navy/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mb-2">
                      <UploadCloud className="h-5 w-5 text-brand-navy dark:text-white" />
                    </div>
                    <p className="text-sm font-medium text-brand-navy dark:text-white">Drop SOLUS PDF or click</p>
                    <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>

                {uploadPhase === "error" && uploadError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <AnimatePresence>
                    {canSkip && (
                      <motion.button
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleSkip}
                        className="flex-1 px-4 py-2.5 rounded-2xl border border-brand-navy/15 dark:border-white/15 text-sm font-medium text-brand-navy/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        Skip for now
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 liquid-btn-red text-white px-4 py-2.5 rounded-2xl text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload PDF
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
