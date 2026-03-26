import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;
  const supabase = getServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ profile: null }, { status: 401 });
  }

  const supabase = getServiceClient();

  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("id, display_name, year_of_study, last_semester_prompted")
    .eq("id", user.id)
    .single();

  const { count: contributionCount } = await supabase
    .from("user_contributions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (!profileData) {
    return NextResponse.json({ profile: null });
  }

  const profile = {
    id: profileData.id,
    display_name: profileData.display_name,
    year_of_study: profileData.year_of_study,
    last_semester_prompted: profileData.last_semester_prompted,
    is_first_year: profileData.year_of_study === 1,
    contribution_count: contributionCount ?? 0,
  };

  return NextResponse.json({ profile });
}

export async function PATCH(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { display_name?: string; year_of_study?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.display_name !== undefined) {
    updates.display_name = body.display_name;
  }
  if (body.year_of_study !== undefined) {
    if (body.year_of_study < 1 || body.year_of_study > 6) {
      return NextResponse.json({ error: "year_of_study must be between 1 and 6" }, { status: 400 });
    }
    updates.year_of_study = body.year_of_study;
  }

  const { error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
