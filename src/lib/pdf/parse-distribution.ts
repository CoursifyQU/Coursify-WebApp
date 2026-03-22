import type { ParsedCourseRow } from "@/types";

// Queen's University GPA scale
const GPA_SCALE = [4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0];

export interface ValidationResult {
  valid: boolean;
  term?: string;
  error?: string;
}

/**
 * Convert a full term string like "2024 Winter" to short format "W24".
 * Matches existing DB convention: W=Winter, F=Fall, S=Summer.
 */
function formatTerm(fullTerm: string): string {
  const [year, season] = fullTerm.split(/\s+/);
  const shortYear = year.slice(-2);
  const prefix = season.charAt(0).toUpperCase(); // W, F, or S
  return `${prefix}${shortYear}`;
}

/**
 * Validate that the extracted PDF text matches the SOLUS grade distribution format.
 */
export function validateSolusFormat(text: string): ValidationResult {
  if (!text.includes("Course Grade Distribution")) {
    return { valid: false, error: "This doesn't appear to be a SOLUS grade distribution PDF. Missing 'Course Grade Distribution' header." };
  }

  if (!text.includes("Queen's University") && !text.includes("Queens University")) {
    return { valid: false, error: "This PDF is not from Queen's University." };
  }

  const termMatch = text.match(/Term:\s*(\d{4}\s+(?:Winter|Fall|Summer))/i);
  if (!termMatch) {
    return { valid: false, error: "Could not find a valid term (e.g., '2024 Winter') in the PDF." };
  }

  // Check for grade table column headers
  if (!text.includes("Enrollment") || !text.includes("A+")) {
    return { valid: false, error: "Could not find the grade distribution table in the PDF." };
  }

  return { valid: true, term: formatTerm(termMatch[1]) };
}

/**
 * Calculate weighted GPA from grade percentages.
 */
function calculateGpa(percentages: number[]): number {
  let weightedSum = 0;
  for (let i = 0; i < 13; i++) {
    weightedSum += percentages[i] * GPA_SCALE[i];
  }
  return Math.round((weightedSum / 100) * 100) / 100;
}

/**
 * Parse a single line of text into a course row, or return null if it doesn't match.
 */
function parseCourseLine(line: string): ParsedCourseRow | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Match course code at start: 2-5 uppercase letters, space, 3 digits, optional letter suffix
  const codeMatch = trimmed.match(/^([A-Z]{2,5}\s+\d{3}[A-Z]?)\s+/);
  if (!codeMatch) return null;

  const courseCode = codeMatch[1];
  const rest = trimmed.slice(codeMatch[0].length).trim();

  // Split remaining tokens - last 14 are: enrollment + 13 grade percentages
  const tokens = rest.split(/\s+/);
  if (tokens.length < 15) return null; // at least 1 description word + 14 numbers

  const numericTokens = tokens.slice(-14);
  const descriptionTokens = tokens.slice(0, -14);

  // All 14 must be valid numbers
  const numbers = numericTokens.map(Number);
  if (numbers.some(isNaN)) return null;

  const enrollment = Math.round(numbers[0]);
  const gradePercentages = numbers.slice(1); // 13 values

  if (gradePercentages.length !== 13) return null;

  // Validate percentages sum roughly to 100 (allow rounding tolerance)
  const sum = gradePercentages.reduce((a, b) => a + b, 0);
  if (sum < 90 || sum > 110) return null;

  return {
    course_code: courseCode,
    description: descriptionTokens.join(" "),
    enrollment,
    grade_percentages: gradePercentages,
    computed_gpa: calculateGpa(gradePercentages),
  };
}

/**
 * Parse all course rows from the extracted PDF text.
 */
export function parseCourseRows(text: string): ParsedCourseRow[] {
  const lines = text.split("\n");
  const courses: ParsedCourseRow[] = [];

  for (const line of lines) {
    const parsed = parseCourseLine(line);
    if (parsed) {
      courses.push(parsed);
    }
  }

  return courses;
}

/**
 * Extract text from a PDF buffer using pdfjs-dist.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Pre-register the worker so pdfjs-dist skips its dynamic import("./pdf.worker.mjs")
  // which fails on Vercel serverless. See pdf.mjs line 17501: globalThis.pdfjsWorker check.
  if (typeof (globalThis as any).pdfjsWorker === "undefined") {
    const pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    (globalThis as any).pdfjsWorker = pdfjsWorker;
  }

  const uint8 = new Uint8Array(buffer);
  const doc = await pdfjsLib.getDocument({
    data: uint8,
    useSystemFonts: true,
    disableFontFace: true,
    isEvalSupported: false,
    useWorkerFetch: false,
  }).promise;

  const textParts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    for (const item of content.items as any[]) {
      if (item.str !== undefined) {
        line += item.str;
        if (item.hasEOL) {
          textParts.push(line);
          line = "";
        }
      }
    }
    if (line) textParts.push(line);
  }

  await doc.destroy();
  return textParts.join("\n");
}
