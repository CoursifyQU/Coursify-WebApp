/**
 * RateMyProfessor UI tags are short phrases (often title case, may include spaces).
 * Pipeline / DB metadata is often stored as lowercase snake_case (e.g. professor_review).
 */
export function filterRmpTagsForDisplay(tags: string[]): string[] {
  return tags.filter((tag) => !isInternalRmpPipelineTag(tag))
}

function isInternalRmpPipelineTag(tag: string): boolean {
  const t = tag.trim().toLowerCase()
  if (!t) return true
  // Chunk/source labels and similar — not RMP attribute chips
  if (/^[a-z0-9_]+$/.test(t) && t.includes("_")) return true
  return false
}
