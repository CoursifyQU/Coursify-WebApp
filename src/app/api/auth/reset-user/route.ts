import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

// This endpoint helps with resetting user data to allow recreation of accounts
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { email } = requestData;
    
    if (!email || !email.endsWith("@queensu.ca")) {
      return NextResponse.json(
        { error: "Invalid or missing email" }, 
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // First, make sure no session exists
    await supabase.auth.signOut();
    
    // Clear any client-side data by setting specific headers
    // This will help browsers clear auth cookies when the response is processed
    const headers = new Headers();
    headers.append("Set-Cookie", "sb-access-token=; Max-Age=0; Path=/");
    headers.append("Set-Cookie", "sb-refresh-token=; Max-Age=0; Path=/");
    
    return NextResponse.json(
      { success: true, message: "Auth state reset, you can now create a new account" },
      { headers }
    );
  } catch (error: any) {
    console.error("Error in reset-user API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset user" },
      { status: 500 }
    );
  }
} 