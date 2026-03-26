import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getMaxRequests } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch profile
  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("year_of_study")
    .eq("id", user.id)
    .single();

  // Fetch contribution count
  const { count: contributionCount } = await supabase
    .from("user_contributions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const yearOfStudy = profileData?.year_of_study ?? 1;
  const isFirstYear = yearOfStudy === 1;
  const contributions = contributionCount ?? 0;

  // Access is allowed if: first year OR has at least 1 contribution
  const canAccess = isFirstYear || contributions > 0;

  // Check rate limit
  const rateLimit = await checkRateLimit(user.id, contributions);
  const max = isFirstYear ? getMaxRequests(0) : rateLimit.max;

  return NextResponse.json({
    canAccess,
    isFirstYear,
    contributionCount: contributions,
    remainingRequests: rateLimit.remaining,
    maxRequests: max,
    resetAt: rateLimit.resetAt?.toISOString() ?? null,
  });
}
