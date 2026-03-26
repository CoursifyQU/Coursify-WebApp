import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractTextFromPdf, validateSolusFormat, parseCourseRows } from "@/lib/pdf/parse-distribution";
import type { UploadDistributionResponse } from "@/types";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

export async function POST(request: NextRequest) {
  if (!supabaseServiceKey) {
    return NextResponse.json({ success: false, errors: ["Server configuration error: missing service key."] }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  // 1. Authenticate user
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, errors: ["Please sign in to upload."] }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ success: false, errors: ["Authentication failed. Please sign in again."] }, { status: 401 });
  }

  // 2. Extract file from FormData
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, errors: ["Invalid request. Expected a file upload."] }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ success: false, errors: ["No file provided."] }, { status: 400 });
  }

  // 3. Validate file type and size
  if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
    return NextResponse.json({ success: false, errors: ["File must be a PDF."] }, { status: 400 });
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, errors: ["File must be under 5MB."] }, { status: 400 });
  }

  // 4. Extract text from PDF
  let text: string;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    text = await extractTextFromPdf(buffer);
  } catch (pdfError) {
    console.error("PDF parsing error:", pdfError);
    return NextResponse.json({ success: false, errors: ["Failed to read PDF. The file may be corrupted."] }, { status: 400 });
  }

  // 5. Validate SOLUS format
  const validation = validateSolusFormat(text);
  if (!validation.valid) {
    return NextResponse.json({ success: false, errors: [validation.error!] }, { status: 400 });
  }

  const term = validation.term!;

  // 6. Parse course rows
  const parsedCourses = parseCourseRows(text);
  if (parsedCourses.length === 0) {
    return NextResponse.json({ success: false, errors: ["No course data could be extracted from the PDF."] }, { status: 400 });
  }

  // 7. Look up course codes in database
  const courseCodes = parsedCourses.map((c) => c.course_code);
  const { data: matchedCourses, error: lookupError } = await supabase
    .from("courses")
    .select("id, course_code")
    .in("course_code", courseCodes);

  if (lookupError) {
    return NextResponse.json({ success: false, errors: ["Database error looking up courses."] }, { status: 500 });
  }

  const codeToId = new Map<string, string>();
  matchedCourses?.forEach((c) => codeToId.set(c.course_code, c.id));

  // 8. Check for existing distributions for this term
  const matchedIds = Array.from(codeToId.values());
  let existingSet = new Set<string>();

  if (matchedIds.length > 0) {
    const { data: existingDists } = await supabase
      .from("course_distributions")
      .select("course_id")
      .in("course_id", matchedIds)
      .eq("term", term);

    existingSet = new Set(existingDists?.map((d) => d.course_id) || []);
  }

  // 9. Build insert batch
  const skipped: string[] = [];
  const duplicates: string[] = [];
  const toInsert: Array<{
    course_id: string;
    term: string;
    enrollment: number;
    average_gpa: number;
    grade_counts: number[];
  }> = [];

  for (const row of parsedCourses) {
    const courseId = codeToId.get(row.course_code);
    if (!courseId) {
      skipped.push(row.course_code);
      continue;
    }
    if (existingSet.has(courseId)) {
      duplicates.push(row.course_code);
      continue;
    }
    toInsert.push({
      course_id: courseId,
      term,
      enrollment: row.enrollment,
      average_gpa: row.computed_gpa,
      grade_counts: row.grade_percentages,
    });
  }

  // 10. Insert distributions
  let inserted = 0;
  const errors: string[] = [];

  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("course_distributions")
      .insert(toInsert);

    if (insertError) {
      errors.push(`Failed to insert distributions: ${insertError.message}`);
    } else {
      inserted = toInsert.length;
    }
  }

  // 11. Record the upload
  await supabase.from("distribution_uploads").insert({
    user_id: user.id,
    file_path: `${user.id}/${Date.now()}_${file.name}`,
    original_filename: file.name,
    status: errors.length > 0 ? "rejected" : "processed",
    processed_at: new Date().toISOString(),
  });

  // 12. Credit all valid courses from this PDF (matched in our DB)
  // Covers both newly inserted rows AND courses already in course_distributions.
  // This ensures Person B gets credit for uploading a legitimate PDF even if
  // Person A already uploaded the same term's data.
  // UNIQUE(user_id, course_id, term) on user_contributions prevents double-counting
  // if the same user re-uploads the same PDF.
  const creditableRows = parsedCourses
    .map((row) => codeToId.get(row.course_code))
    .filter((courseId): courseId is string => !!courseId)
    .map((courseId) => ({ user_id: user.id, course_id: courseId, term }));

  if (creditableRows.length > 0) {
    await supabase
      .from("user_contributions")
      .upsert(creditableRows, { onConflict: "user_id,course_id,term", ignoreDuplicates: true });
  }

  // 13. Fetch updated contribution count to return in response
  const { count: contributionCount } = await supabase
    .from("user_contributions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const response: UploadDistributionResponse = {
    success: errors.length === 0,
    term,
    inserted,
    skipped,
    duplicates,
    errors,
    contributionCount: contributionCount ?? 0,
  };

  return NextResponse.json(response);
}
