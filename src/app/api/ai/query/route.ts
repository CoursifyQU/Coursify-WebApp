import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, logAiRequest } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  // Parse request body
  let body: { question?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.question?.trim()) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  // Fetch profile and contribution count
  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("year_of_study")
    .eq("id", user.id)
    .single();

  const { count: contributionCount } = await supabase
    .from("user_contributions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const yearOfStudy = profileData?.year_of_study ?? 1;
  const isFirstYear = yearOfStudy === 1;
  const contributions = contributionCount ?? 0;

  // Gate: non-first-years need at least 1 contribution
  if (!isFirstYear && contributions === 0) {
    return NextResponse.json(
      {
        error: "contribution_required",
        message: "Upload a grade distribution to unlock AI features.",
      },
      { status: 403 }
    );
  }

  // Rate limit check
  const rateLimit = await checkRateLimit(user.id, contributions);
  if (!rateLimit.allowed) {
    const retryAfterSeconds = rateLimit.resetAt
      ? Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000)
      : 86400;

    return NextResponse.json(
      {
        error: "rate_limit_exceeded",
        message: `You've used all ${rateLimit.max} requests for today. Try again later.`,
        resetAt: rateLimit.resetAt?.toISOString() ?? null,
        retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(rateLimit.max),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Log the request before processing
  await logAiRequest(user.id);

  // TODO: Connect to the actual RAG backend (CourseCentralQU-RAG) here.
  // For now, return a placeholder response so the gating/rate-limiting
  // infrastructure is fully wired up and ready.
  return NextResponse.json({
    answer: "Queen's Answers is coming soon! The AI backend is being connected. Your request has been counted.",
    question: body.question,
    remainingRequests: rateLimit.remaining - 1,
    maxRequests: rateLimit.max,
  });
}
