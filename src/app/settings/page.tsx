"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  User,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Save,
  BarChart3,
  BookOpen,
} from "lucide-react";
import type { UploadDistributionResponse } from "@/types";

const YEAR_OPTIONS = [
  { value: 1, label: "1st Year" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
  { value: 4, label: "4th Year" },
  { value: 5, label: "5th Year+" },
];

type UploadPhase = "idle" | "uploading" | "validating" | "done" | "error";

export default function SettingsPage() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const supabaseClient = getSupabaseClient();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setYearOfStudy(profile.year_of_study);
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
      if (!currentSession?.access_token) throw new Error("Not authenticated.");
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentSession.access_token}`,
        },
        body: JSON.stringify({ display_name: displayName, year_of_study: yearOfStudy }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      await refreshProfile();
      toast({ title: "Settings saved", variant: "success" });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession?.access_token) throw new Error("Not authenticated.");

      const formData = new FormData();
      formData.append("file", file);
      setUploadPhase("validating");

      const response = await fetch("/api/upload-distribution", {
        method: "POST",
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
        body: formData,
      });

      const result: UploadDistributionResponse = await response.json();
      if (!response.ok) throw new Error(result.errors?.[0] || "Upload failed.");

      setUploadPhase("done");
      setUploadResult(result);

      if (result.inserted > 0) {
        await refreshProfile();
        toast({
          title: `${result.inserted} course${result.inserted !== 1 ? "s" : ""} added`,
          description: result.term ? `For ${result.term}` : undefined,
          variant: "success",
        });
      }
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

  const contributionCount = profile?.contribution_count ?? 0;
  const maxRequests = contributionCount >= 4 ? 5 : contributionCount >= 2 ? 4 : 3;

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 pb-16 px-6">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="liquid-blob w-[500px] h-[400px] bg-brand-navy" style={{ top: "-5%", left: "-8%", animationDelay: "0s" }} />
        <div className="liquid-blob-alt w-[300px] h-[300px] bg-brand-gold" style={{ bottom: "10%", right: "-5%", animationDelay: "-4s" }} />
      </div>

      <motion.div
        className="max-w-2xl mx-auto space-y-6 relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-navy dark:text-white tracking-tight">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and contributions</p>
        </div>

        {/* Account Info */}
        <section className="glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-brand-navy/10 dark:bg-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-navy dark:text-white" />
            </div>
            <h2 className="text-lg font-semibold text-brand-navy dark:text-white">Account Info</h2>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Email</label>
            <div className="glass-card rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-gray-400 select-all">
              {user.email}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Display Name</label>
            <div className="glass-card rounded-xl transition-all focus-within:border-brand-navy/30 dark:focus-within:border-blue-400/30">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full bg-transparent text-sm text-brand-navy dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-3 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Year of Study */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Year of Study</label>
            <div className="glass-card rounded-xl relative transition-all focus-within:border-brand-navy/30 dark:focus-within:border-blue-400/30">
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(Number(e.target.value))}
                className="w-full bg-transparent text-sm text-brand-navy dark:text-white px-4 py-3 pr-10 rounded-xl focus:outline-none appearance-none cursor-pointer"
              >
                {YEAR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {yearOfStudy === 1 && (
              <p className="text-xs text-brand-gold dark:text-yellow-400 mt-1.5 px-1">First-year — you have full access to all features.</p>
            )}
          </div>

          <div className="pt-1">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="liquid-btn-red text-white rounded-2xl px-6 py-2.5 font-medium"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
              )}
            </Button>
          </div>
        </section>

        {/* Contribution Stats */}
        <section className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-brand-navy/10 dark:bg-white/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-brand-navy dark:text-white" />
            </div>
            <h2 className="text-lg font-semibold text-brand-navy dark:text-white">Contribution Stats</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-brand-navy dark:text-white">{contributionCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Distributions contributed</div>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-brand-navy dark:text-white">{maxRequests}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Daily AI requests</div>
            </div>
          </div>

          {!profile?.is_first_year && (
            <div className="rounded-2xl bg-brand-navy/5 dark:bg-white/5 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <strong className="text-brand-navy dark:text-white">Rate limit tiers:</strong>{" "}
                0–1 contributions → 3 requests/day · 2–3 → 4/day · 4+ → 5/day
              </p>
            </div>
          )}
        </section>

        {/* Upload Distribution */}
        <section className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-brand-navy/10 dark:bg-white/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-brand-navy dark:text-white" />
            </div>
            <h2 className="text-lg font-semibold text-brand-navy dark:text-white">Upload Distribution</h2>
          </div>

          {uploadPhase === "done" && uploadResult ? (
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
                  <p className="text-sm text-yellow-800">No new distributions — data may already exist for this term.</p>
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
              <Button onClick={handleReset} variant="outline" className="rounded-2xl border-brand-navy/20 dark:border-white/20">
                Upload Another
              </Button>
            </div>
          ) : (
            <div className="relative">
              {(uploadPhase === "uploading" || uploadPhase === "validating") && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col items-center justify-center z-10 rounded-2xl">
                  <div className="w-10 h-10 border-4 border-brand-navy/20 border-t-brand-navy dark:border-t-blue-400 rounded-full animate-spin mb-3" />
                  <p className="text-brand-navy dark:text-white font-medium text-sm">
                    {uploadPhase === "uploading" ? "Uploading..." : "Validating..."}
                  </p>
                </div>
              )}

              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 flex flex-col items-center text-center hover:border-brand-navy dark:hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-brand-navy/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mb-3">
                  <UploadCloud className="h-6 w-6 text-brand-navy dark:text-white" />
                </div>
                <p className="text-sm font-medium text-brand-navy dark:text-white mb-1">Drop SOLUS PDF here</p>
                <p className="text-xs text-gray-400 mb-3">or click to browse</p>
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

              <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-400/30 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-200">Only on-campus courses are currently supported.</p>
              </div>
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}
