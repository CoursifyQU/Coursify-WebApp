import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { UserProfile } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

async function authenticate(request: NextRequest) {
  if (!supabaseServiceKey) return { user: null, error: "Server configuration error" };
  const supabase = getServiceClient();
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return { user: null, error: "Unauthorized" };
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return { user: null, error: "Authentication failed" };
  return { user, error: null, supabase };
}

export async function GET(request: NextRequest) {
  const { user, error, supabase } = await authenticate(request);
  if (error || !user || !supabase) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return NextResponse.json({ profile: profile ?? null });
}

export async function POST(request: NextRequest) {
  const { user, error, supabase } = await authenticate(request);
  if (error || !user || !supabase) {
    return NextResponse.json({ error }, { status: 401 });
  }

  let body: { year_of_study: number; current_semester: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { year_of_study, current_semester } = body;

  if (!Number.isInteger(year_of_study) || year_of_study < 1 || year_of_study > 6) {
    return NextResponse.json({ error: "year_of_study must be 1–6" }, { status: 400 });
  }
  if (current_semester !== 1 && current_semester !== 2) {
    return NextResponse.json({ error: "current_semester must be 1 or 2" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data: profile, error: upsertError } = await supabase
    .from("user_profiles")
    .upsert(
      {
        id: user.id,
        year_of_study,
        current_semester,
        onboarding_completed: true,
        updated_at: now,
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ profile: profile as UserProfile });
}
