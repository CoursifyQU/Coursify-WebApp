import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from("courses_with_stats")
      .select("course_code")

    if (error) {
      console.error("Error fetching subjects:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const subjects = [
      ...new Set(
        (data || [])
          .map((row: any) => {
            const code = row.course_code || ""
            return code.split(" ")[0].trim().toUpperCase()
          })
          .filter(Boolean)
      ),
    ].sort() as string[]

    return NextResponse.json({ subjects })
  } catch (err) {
    console.error("Subjects API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    )
  }
}
