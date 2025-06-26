import { createClient } from "@supabase/supabase-js"

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Default values for development when env vars are not set
const defaultUrl = "https://placeholder.supabase.co"
const defaultKey = "placeholder-key"

// Debug logging
console.log("Environment check:")
console.log("- NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing")
console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Set" : "✗ Missing")
console.log("- Using URL:", supabaseUrl || defaultUrl)

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Using placeholder values for development.")
  console.warn("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file")
}

// Create a singleton instance for client-side usage
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      supabaseUrl || defaultUrl, 
      supabaseAnonKey || defaultKey
    )
  }
  return supabaseClient
}
