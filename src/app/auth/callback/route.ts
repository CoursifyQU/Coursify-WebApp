import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/", requestUrl));
  }

  // Exchange code for session using anon client
  const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
  const { data: sessionData, error: sessionError } = await anonClient.auth.exchangeCodeForSession(code);

  if (sessionError || !sessionData?.user) {
    return NextResponse.redirect(new URL("/", requestUrl));
  }

  const user = sessionData.user;

  // Use service client to check/create profile
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const { data: existingProfile } = await serviceClient
    .from("user_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    // New user — create profile from user metadata
    const yearOfStudy = user.user_metadata?.year_of_study ?? 1;
    await serviceClient.from("user_profiles").insert({
      id: user.id,
      year_of_study: Math.min(Math.max(Number(yearOfStudy), 1), 6),
      display_name: null,
      last_semester_prompted: null,
    });

    // Redirect new users to onboarding
    return NextResponse.redirect(new URL("/onboarding", requestUrl));
  }

  // Existing user — redirect to home
  return NextResponse.redirect(new URL("/", requestUrl));
} 