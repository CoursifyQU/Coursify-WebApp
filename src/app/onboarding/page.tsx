"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  UploadCloud,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import type { UploadDistributionResponse } from "@/types";
import Link from "next/link";

type UploadPhase = "idle" | "uploading" | "validating" | "processing" | "done" | "error";

export default function OnboardingPage() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const router = useRouter();
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadDistributionResponse | null>(null);
  const [showSkipped, setShowSkipped] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, isLoading, router]);

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setUploadPhase("error");
      setUploadError("Please upload a PDF file.");
      return;
    }

    setUploadPhase("uploading");
    setUploadError(null);
    setUploadResult(null);

    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Not authenticated. Please sign in again.");
      }

      const formData = new FormData();
      formData.append("file", file);
      setUploadPhase("validating");

      const response = await fetch("/api/upload-distribution", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });

      const result: UploadDistributionResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.errors?.[0] || "Upload failed.");
      }

      setUploadPhase("done");
      setUploadResult(result);

      if (result.inserted > 0) {
        await refreshProfile();
        toast({
          title: "Distribution uploaded!",
          description: `${result.inserted} course${result.inserted !== 1 ? "s" : ""} added. You've unlocked AI features.`,
          variant: "success",
        });
      }
    } catch (error) {
      setUploadPhase("error");
      setUploadError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setUploadPhase("idle");
    setUploadError(null);
    setUploadResult(null);
    setShowSkipped(false);
    setShowDuplicates(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-navy/20 border-t-brand-navy rounded-full animate-spin" />
      </div>
    );
  }

  const isFirstYear = profile?.is_first_year ?? profile?.year_of_study === 1;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-20">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="liquid-blob w-[500px] h-[400px] bg-brand-navy" style={{ top: "-5%", left: "-8%", animationDelay: "0s" }} />
        <div className="liquid-blob-alt w-[400px] h-[450px] bg-brand-red" style={{ bottom: "-10%", right: "-5%", animationDelay: "-4s" }} />
        <div className="liquid-blob w-[350px] h-[350px] bg-brand-gold" style={{ top: "40%", left: "45%", animationDelay: "-8s" }} />
      </div>

      <motion.div
        className="w-full max-w-lg relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Welcome header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-navy/10 dark:bg-white/10 text-brand-navy dark:text-white text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Welcome to Coursify
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-navy dark:text-white mb-2">
            {isFirstYear ? "You're all set!" : "One more step"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isFirstYear
              ? "As a first-year student, you have full access to all features."
              : "Upload a grade distribution to unlock AI-powered features."}
          </p>
        </div>

        {isFirstYear ? (
          /* First-year welcome */
          <div className="glass-card rounded-3xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-navy dark:text-white mb-2">
                Full access, no contribution needed
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                We know you're just starting out — enjoy exploring course data and AI insights freely.
                Once you complete a semester, you can contribute your grade distributions to help the community.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/">
                <Button className="liquid-btn-red text-white rounded-2xl px-8 py-3 font-medium w-full">
                  Explore Coursify
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Upper-year upload prompt */
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-navy/5 dark:bg-white/5">
              <AlertCircle className="w-5 h-5 text-brand-navy dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-sm text-brand-navy/80 dark:text-white/80">
                Upload your SOLUS grade distribution to unlock AI features. This helps the whole Queen's student community make better course decisions.
              </p>
            </div>

            {uploadPhase === "done" && uploadResult ? (
              /* Result state */
              <div className="space-y-3">
                {uploadResult.inserted > 0 && (
                  <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 shrink-0" />
                    <p className="text-sm text-green-800 font-medium">
                      {uploadResult.inserted} course{uploadResult.inserted !== 1 ? "s" : ""} added for {uploadResult.term}
                    </p>
                  </div>
                )}

                {uploadResult.inserted === 0 && (
                  <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 shrink-0" />
                    <p className="text-sm text-yellow-800">
                      No new distributions added — data may already exist for this term.
                    </p>
                  </div>
                )}

                {uploadResult.duplicates.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <button onClick={() => setShowDuplicates(!showDuplicates)} className="flex items-center justify-between w-full text-left">
                      <span className="text-sm text-yellow-800 font-medium">{uploadResult.duplicates.length} already uploaded</span>
                      {showDuplicates ? <ChevronUp className="h-4 w-4 text-yellow-600" /> : <ChevronDown className="h-4 w-4 text-yellow-600" />}
                    </button>
                    {showDuplicates && <div className="mt-1 pl-2 text-xs text-yellow-700">{uploadResult.duplicates.join(", ")}</div>}
                  </div>
                )}

                {uploadResult.skipped.length > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <button onClick={() => setShowSkipped(!showSkipped)} className="flex items-center justify-between w-full text-left">
                      <span className="text-sm text-orange-800 font-medium">{uploadResult.skipped.length} not in database yet</span>
                      {showSkipped ? <ChevronUp className="h-4 w-4 text-orange-500" /> : <ChevronDown className="h-4 w-4 text-orange-500" />}
                    </button>
                    {showSkipped && <div className="mt-1 pl-2 text-xs text-orange-700">{uploadResult.skipped.join(", ")}</div>}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Button onClick={handleReset} variant="outline" className="flex-1 rounded-2xl border-brand-navy/20 dark:border-white/20">
                    Upload Another
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button className="liquid-btn-red text-white rounded-2xl w-full font-medium">
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* Upload dropzone */
              <div className="relative">
                {(uploadPhase === "uploading" || uploadPhase === "validating" || uploadPhase === "processing") && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col items-center justify-center z-10 rounded-2xl">
                    <div className="w-10 h-10 border-4 border-brand-navy/20 border-t-brand-navy dark:border-t-blue-400 rounded-full animate-spin mb-3" />
                    <p className="text-brand-navy dark:text-white font-medium text-sm">
                      {uploadPhase === "uploading" ? "Uploading..." : uploadPhase === "validating" ? "Validating..." : "Processing..."}
                    </p>
                  </div>
                )}

                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 flex flex-col items-center text-center hover:border-brand-navy dark:hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-14 h-14 bg-brand-navy/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="h-7 w-7 text-brand-navy dark:text-white" />
                  </div>
                  <p className="text-sm font-medium text-brand-navy dark:text-white mb-1">Drop your SOLUS PDF here</p>
                  <p className="text-xs text-gray-400 mb-4">or click to browse</p>
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  <Button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    variant="outline"
                    className="rounded-xl border-brand-navy/30 dark:border-blue-400/30 text-brand-navy dark:text-white text-sm"
                  >
                    Select PDF File
                  </Button>
                </div>

                {uploadPhase === "error" && uploadError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                )}

                <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-400/30 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">Only on-campus courses are currently supported.</p>
                </div>
              </div>
            )}

            {/* Skip option */}
            {uploadPhase !== "done" && (
              <div className="text-center pt-1">
                <Link
                  href="/"
                  className="text-xs text-gray-400 hover:text-brand-red transition-colors duration-200"
                >
                  Skip for now — AI features will be locked until you contribute
                </Link>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
