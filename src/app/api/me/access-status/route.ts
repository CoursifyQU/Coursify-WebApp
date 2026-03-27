import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { AccessStatus } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

export async function GET(request: NextRequest) {
  if (!supabaseServiceKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  // Run both queries in parallel
  const [profileResult, uploadCountResult] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("distribution_uploads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "processed"),
  ]);

  const profile = profileResult.data;
  const upload_count = uploadCountResult.count ?? 0;

  const needs_onboarding =
    !profile || !profile.onboarding_completed || profile.current_semester === null;

  const required_uploads = needs_onboarding
    ? 0
    : Math.min((profile.year_of_study - 1) * 2 + (profile.current_semester - 1), 6);

  const is_exempt = required_uploads === 0;
  const has_access = needs_onboarding ? false : upload_count >= required_uploads;

  const status: AccessStatus = {
    has_access,
    is_exempt,
    upload_count,
    required_uploads,
    needs_onboarding,
  };

  return NextResponse.json(status);
}
