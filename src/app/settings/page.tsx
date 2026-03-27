"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Check, X, UploadCloud } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { UserProfile, AccessStatus } from "@/types";

type UploadRow = {
  id: string;
  original_filename: string;
  status: string;
  uploaded_at: string | null;
  processed_at: string | null;
};

const YEAR_LABELS: Record<number, string> = {
  1: "1st Year",
  2: "2nd Year",
  3: "3rd Year",
  4: "4th Year",
  5: "5th Year",
  6: "6th+ Year",
};

const SEMESTER_LABELS: Record<number, string> = {
  1: "1st Semester",
  2: "2nd Semester",
};

const YEAR_OPTIONS = [1, 2, 3, 4, 5, 6];
const SEMESTER_OPTIONS = [1, 2];

function StatusBadge({ status }: { status: AccessStatus }) {
  if (status.is_exempt) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Exempt · First Year
      </span>
    );
  }
  if (status.upload_count > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Contributor · {status.upload_count} {status.upload_count === 1 ? "upload" : "uploads"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Locked · Upload to Unlock
    </span>
  );
}

function UploadStatusBadge({ status }: { status: string }) {
  if (status === "processed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5">
        <Check className="w-3 h-3" />
        Processed
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium px-2.5 py-0.5">
        <X className="w-3 h-3" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2.5 py-0.5">
      Pending
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editYear, setEditYear] = useState<number | null>(null);
  const [editSemester, setEditSemester] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const { data: session } = await getSupabaseClient().auth.getSession();
        const token = session?.session?.access_token;
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, statusRes, uploadsRes] = await Promise.all([
          fetch("/api/me/academic-profile", { headers }),
          fetch("/api/me/access-status", { headers }),
          getSupabaseClient()
            .from("distribution_uploads")
            .select("id, original_filename, status, uploaded_at, processed_at")
            .eq("user_id", user.id)
            .order("uploaded_at", { ascending: false }),
        ]);

        if (profileRes.ok) {
          const { profile: p } = await profileRes.json();
          setProfile(p);
        }
        if (statusRes.ok) {
          const s = await statusRes.json();
          setAccessStatus(s);
        }
        if (!uploadsRes.error) {
          setUploads(uploadsRes.data ?? []);
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user]);

  const startEdit = () => {
    setEditYear(profile?.year_of_study ?? null);
    setEditSemester(profile?.current_semester ?? null);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveProfile = async () => {
    if (!editYear || !editSemester) return;
    setSaving(true);
    try {
      const { data: session } = await getSupabaseClient().auth.getSession();
      const token = session?.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/me/academic-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ year_of_study: editYear, current_semester: editSemester }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      const { profile: updated } = await res.json();
      setProfile(updated);
      setEditing(false);

      // Re-fetch access status since year/semester change affects exemption
      const statusRes = await fetch("/api/me/access-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statusRes.ok) setAccessStatus(await statusRes.json());

      toast({ title: "Profile updated", variant: "success" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-navy/20 border-t-brand-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy dark:text-white tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
        </div>

        {/* Section 1: Access Status */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Queen&apos;s Answers Access
          </h2>
          {accessStatus ? (
            <div className="flex flex-col gap-3">
              <StatusBadge status={accessStatus} />
              {!accessStatus.has_access && !accessStatus.needs_onboarding && (
                <p className="text-sm text-brand-navy/70 dark:text-white/70">
                  Upload a SOLUS grade distribution PDF to unlock Queen&apos;s Answers.{" "}
                  <Link href="/add-courses" className="text-brand-red hover:underline font-medium">
                    Upload now →
                  </Link>
                </p>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400">Loading…</span>
          )}
        </div>

        {/* Section 2: Academic Profile */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Academic Profile
            </h2>
            {profile && !editing && (
              <button
                type="button"
                onClick={startEdit}
                className="flex items-center gap-1.5 text-xs text-brand-navy dark:text-white/70 hover:text-brand-red transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          {!profile ? (
            <div className="text-sm text-brand-navy/70 dark:text-white/70">
              Profile not set up.{" "}
              <Link href="/onboarding" className="text-brand-red hover:underline font-medium">
                Complete your profile →
              </Link>
            </div>
          ) : !editing ? (
            <div className="flex gap-6">
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Year</div>
                <div className="text-sm font-semibold text-brand-navy dark:text-white">
                  {YEAR_LABELS[profile.year_of_study] ?? `Year ${profile.year_of_study}`}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Semester</div>
                <div className="text-sm font-semibold text-brand-navy dark:text-white">
                  {profile.current_semester
                    ? SEMESTER_LABELS[profile.current_semester]
                    : "—"}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2.5">Year</div>
                <div className="grid grid-cols-3 gap-2">
                  {YEAR_OPTIONS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setEditYear(y)}
                      className={`rounded-full px-3 py-2.5 text-sm font-semibold border transition-all duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/40
                        ${editYear === y
                          ? "bg-brand-navy text-white border-brand-navy shadow-md scale-[1.03]"
                          : "bg-brand-navy/5 dark:bg-white/[0.07] border-brand-navy/15 dark:border-white/10 text-brand-navy dark:text-white hover:bg-brand-navy/10 dark:hover:bg-white/[0.12] hover:border-brand-navy/25"
                        }`}
                    >
                      {YEAR_LABELS[y]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2.5">Semester</div>
                <div className="grid grid-cols-2 gap-2">
                  {SEMESTER_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditSemester(s)}
                      className={`rounded-full px-3 py-2.5 text-sm font-semibold border transition-all duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/40
                        ${editSemester === s
                          ? "bg-brand-navy text-white border-brand-navy shadow-md scale-[1.03]"
                          : "bg-brand-navy/5 dark:bg-white/[0.07] border-brand-navy/15 dark:border-white/10 text-brand-navy dark:text-white hover:bg-brand-navy/10 dark:hover:bg-white/[0.12] hover:border-brand-navy/25"
                        }`}
                    >
                      {SEMESTER_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={!editYear || !editSemester || saving}
                  className="liquid-btn-red rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-full px-5 py-2 text-sm font-semibold border border-brand-navy/15 dark:border-white/10 bg-brand-navy/5 dark:bg-white/[0.07] text-brand-navy dark:text-white hover:bg-brand-navy/10 dark:hover:bg-white/[0.12] transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Upload History */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Upload History
            </h2>
            <Link
              href="/add-courses"
              className="flex items-center gap-1.5 text-xs text-brand-navy dark:text-white/70 hover:text-brand-red transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload
            </Link>
          </div>

          {uploads.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-brand-navy/60 dark:text-white/50 mb-3">
                No uploads yet — upload your SOLUS distribution to unlock Queen&apos;s Answers.
              </p>
              <Link
                href="/add-courses"
                className="liquid-btn-red inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium text-white"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Distribution
              </Link>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
              {uploads.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3 gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-brand-navy dark:text-white truncate">
                      {u.original_filename}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {formatDate(u.uploaded_at)}
                    </div>
                  </div>
                  <UploadStatusBadge status={u.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
