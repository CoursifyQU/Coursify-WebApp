export function getCurrentSemester(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const year = now.getFullYear() % 100;
  // Sept (8) – Dec (11) = Fall
  if (month >= 8) return `F${year}`;
  // Jan (0) – Apr (3) = Winter
  if (month <= 3) return `W${year}`;
  // May (4) – Aug (7) = Summer — no prompt
  return `S${year}`;
}

export function shouldShowSemesterPrompt(lastPrompted: string | null): boolean {
  const current = getCurrentSemester();
  // Never prompt during summer
  if (current.startsWith("S")) return false;
  // Show if never prompted or not shown for the current semester
  return lastPrompted !== current;
}
