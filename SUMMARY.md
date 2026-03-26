# Course Central — Distribution Contribution & AI Gating System

## Overview

This document summarizes the full system built to incentivize users to contribute course grade distributions, gate the AI feature behind contributions, and keep user data fresh over time.

---

## What Was Built

### 1. Database Schema (`supabase/migrations.sql`)

Three new tables added to Supabase:

| Table | Purpose |
|---|---|
| `user_profiles` | Stores display name, year of study, semester prompt tracking, year bump timestamp |
| `user_contributions` | One row per `(user_id, course_id, term)` — tracks what each user has contributed |
| `ai_request_log` | One row per AI query — used to enforce daily rate limits |

Key constraints:
- `user_contributions` has `UNIQUE(user_id, course_id, term)` — prevents a user from gaining credit twice for the same course and term
- `user_profiles.year_of_study` is capped between 1–6

Postgres functions:
- `bump_year_of_study()` — auto-increments year of study for all users every September (schedule via `pg_cron`)
- `get_user_contribution_count(user_id)` — returns a user's total contribution count

---

### 2. Sign-Up Flow (`src/app/(auth)/sign-up/page.tsx`)

- Added a **Year of Study** dropdown (1st–5th+ Year) to the sign-up form
- Year is stored in Supabase `user_metadata` and written to `user_profiles` on email verification

---

### 3. Auth Callback & Profile Creation (`src/app/auth/callback/route.ts`)

- After email verification, checks if a `user_profiles` row exists
- If not (new user), creates one using `year_of_study` from `user_metadata`
- New users are redirected to `/onboarding`; existing users go to `/`

---

### 4. Auth Context (`src/lib/auth/auth-context.tsx`)

- Extended to load and expose `profile` (UserProfile) alongside the session
- `refreshProfile()` can be called after uploads or settings changes to sync state across the app

---

### 5. Onboarding Page (`src/app/onboarding/page.tsx`)

- First-year students: shown a welcome message and sent straight to the home page
- All other years: prompted to upload their first grade distribution PDF to unlock AI features
- "Skip for now" is available but warns that AI will be locked until they contribute

---

### 6. Settings Page (`src/app/settings/page.tsx`)

- Users can update their **display name** and **year of study**
- Shows contribution stats (count + current AI request tier)
- Includes an inline PDF upload zone to contribute additional distributions

---

### 7. Upload Distribution API (`src/app/api/upload-distribution/route.ts`)

Handles the full PDF upload pipeline:

1. Authenticate user
2. Validate file type and size (PDF, max 5MB)
3. Extract text from PDF using `pdf-parse`
4. Validate SOLUS format (checks for Queen's-specific markers and extracts term)
5. Parse course rows (course code, enrollment, GPA, grade breakdown)
6. Look up course codes against the `courses` table
7. Check which courses for this term already exist in `course_distributions`
8. Insert only new course distributions (deduplicates globally)
9. Record the upload in `distribution_uploads`
10. **Credit the user for all valid courses in the PDF** — regardless of whether the data was already in the global DB

#### Fair Contribution Credit (the key fix)

```
creditableRows = all courses in PDF that exist in our courses table
→ upsert into user_contributions with ignoreDuplicates: true
```

This means:
- Person A uploads W24 → gets credit, data inserted globally
- Person B uploads same W24 PDF → gets credit too (different user_id), no new global data inserted
- Person A re-uploads same W24 PDF → no extra credit (UNIQUE constraint blocks it)

---

### 8. AI Access Check API (`src/app/api/ai/check-access/route.ts`)

Returns whether a user can access AI features:
- **First-year students**: always allowed
- **All other years**: must have at least 1 contribution
- Returns `remainingRequests`, `maxRequests`, `resetAt` for rate limit display

---

### 9. AI Query API (`src/app/api/ai/query/route.ts`)

Enforces gating before processing any AI question:
1. Rejects non-first-year users with 0 contributions (403)
2. Rejects users over their daily limit (429)
3. Logs each successful request to `ai_request_log`

---

### 10. Rate Limiting (`src/lib/rate-limit.ts`)

Tiered daily request limits based on contribution count:

| Contributions | Daily AI Requests |
|---|---|
| 0–1 | 3 |
| 2–3 | 4 |
| 4+ | 5 |

Resets every 24 hours (rolling window).

---

### 11. Queen's Answers Page (`src/app/queens-answers/page.tsx`)

- Fetches access status on load and shows live request counter (e.g. `2/3 requests today`)
- Shows a "Contribution Required" notice for locked users
- Modal dialogs for:
  - **Distribution Required** — non-first-year users with 0 contributions
  - **Daily Limit Reached** — users who have used all their requests

---

### 12. Semester Prompt System

**`src/lib/semester.ts`**
- Detects current semester (Fall/Winter/Summer)
- No prompts are shown in summer
- `shouldShowSemesterPrompt(lastPrompted)` checks if the user has already been prompted this semester

**`src/app/api/profile/semester-prompt/route.ts`**
- Marks `last_semester_prompted` in the user's profile when they dismiss or upload

**`src/components/semester-prompt-modal.tsx`**
- Modal with a **60-second countdown timer**
- Cannot be dismissed by clicking the backdrop during the countdown
- "Skip" button only appears after 60 seconds
- Includes inline PDF upload — uploading closes the modal immediately and credits the user

**`src/components/semester-prompt-provider.tsx`**
- Wraps the app, checks if the prompt should be shown
- Delays display by 2.5 seconds after login so it doesn't immediately interrupt the user

---

### 13. Navigation (`src/components/Navigation.tsx`)

- Added **Settings** link to the user dropdown (desktop) and mobile menu

---

## Contribution Credit Rules (Summary)

| Action | Gets Credit? |
|---|---|
| Upload a valid PDF with courses in our DB (first ever for that term) | Yes |
| Upload a valid PDF for a term another user already covered | Yes |
| Re-upload the same PDF you already uploaded | No (UNIQUE constraint) |
| Upload a PDF with courses not in our `courses` table | No (unrecognized courses) |

---

## Files Changed / Created

| File | Status |
|---|---|
| `supabase/migrations.sql` | Created |
| `src/lib/auth/auth-context.tsx` | Modified |
| `src/app/(auth)/sign-up/page.tsx` | Modified |
| `src/app/auth/callback/route.ts` | Modified |
| `src/app/api/profile/route.ts` | Created |
| `src/app/api/profile/semester-prompt/route.ts` | Created |
| `src/app/api/upload-distribution/route.ts` | Modified |
| `src/app/api/ai/check-access/route.ts` | Created |
| `src/app/api/ai/query/route.ts` | Created |
| `src/app/onboarding/page.tsx` | Created |
| `src/app/settings/page.tsx` | Created |
| `src/app/queens-answers/page.tsx` | Modified |
| `src/lib/rate-limit.ts` | Created |
| `src/lib/semester.ts` | Created |
| `src/components/semester-prompt-modal.tsx` | Created |
| `src/components/semester-prompt-provider.tsx` | Created |
| `src/components/Navigation.tsx` | Modified |
| `src/types/index.ts` | Modified |
| `src/app/layout.tsx` | Modified |
