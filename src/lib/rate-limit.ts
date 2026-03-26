import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

export function getMaxRequests(contributionCount: number): number {
  if (contributionCount >= 4) return 5;
  if (contributionCount >= 2) return 4;
  return 3;
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  max: number;
  resetAt: Date | null;
}

export async function checkRateLimit(userId: string, contributionCount: number): Promise<RateLimitStatus> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const max = getMaxRequests(contributionCount);
  const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: requests, count } = await supabase
    .from("ai_request_log")
    .select("requested_at", { count: "exact" })
    .eq("user_id", userId)
    .gte("requested_at", windowStart)
    .order("requested_at", { ascending: true });

  const requestCount = count ?? 0;
  const allowed = requestCount < max;
  const remaining = Math.max(0, max - requestCount);

  // If at limit, compute when the oldest request falls out of the 24h window
  let resetAt: Date | null = null;
  if (!allowed && requests && requests.length > 0) {
    const oldest = new Date(requests[0].requested_at);
    resetAt = new Date(oldest.getTime() + 24 * 60 * 60 * 1000);
  }

  return { allowed, remaining, max, resetAt };
}

export async function logAiRequest(userId: string): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  await supabase.from("ai_request_log").insert({
    user_id: userId,
    requested_at: new Date().toISOString(),
  });
}
