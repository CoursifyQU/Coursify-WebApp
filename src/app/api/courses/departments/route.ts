import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from("courses_with_stats")
      .select("offering_faculty")

    if (error) {
      console.error("Error fetching departments:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Extract unique departments and sort
    const departments = [
      ...new Set(
        (data || [])
          .map((row: any) => row.offering_faculty)
          .filter(Boolean)
      ),
    ].sort() as string[]

    return NextResponse.json({ departments })
  } catch (err) {
    console.error("Departments API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    )
  }
}
