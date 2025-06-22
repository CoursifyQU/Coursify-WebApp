import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the browser
// Use environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.")
  
  // In development, throw an error to make it obvious
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "Missing Supabase environment variables. Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
  }
}

console.log("Connecting to Supabase URL:", supabaseUrl)

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")
