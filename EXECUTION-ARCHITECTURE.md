# EXECUTION-ARCHITECTURE.md — Phase 2 Design
# Read this fully before writing a single line of Phase 2 code.
# This is the design-first document for Monaco + Judge0 integration.
# ─────────────────────────────────────────────────────────────────────────────

## 1. WHAT PHASE 2 ACTUALLY BUILDS

Three distinct systems that must be designed together:

```
┌─────────────────────────────────────────────────────┐
│  1. EDITOR SYSTEM     Monaco Editor UI + state      │
│  2. EXECUTION SYSTEM  Judge0 API integration        │
│  3. PERSISTENCE       Code saves + run history      │
└─────────────────────────────────────────────────────┘
```

These are NOT independent. The DB schema must be designed
before the UI, and the execution flow must be designed
before the API routes.

---

## 2. FULL EXECUTION FLOW

```
User writes code in Monaco
         │
         ▼
[RUN button clicked]
         │
         ▼
Frontend → POST /api/execute
  { code, language_id, problem_id, stdin? }
         │
         ▼
API route validates with Zod
         │
         ▼
API route → Judge0 POST /submissions?base64_encoded=true&wait=false
  Returns: { token: "abc123" }
         │
         ▼
API route polls Judge0 GET /submissions/{token}
  every 1s, max 10 attempts
  Status codes:
    1 = In Queue
    2 = Processing
    3 = Accepted        ← success
    4 = Wrong Answer
    5 = Time Limit
    6 = Compilation Error
    7-14 = Runtime errors
         │
         ▼
API route returns result to frontend:
  { status, stdout, stderr, compile_output, time, memory }
         │
         ▼
Frontend displays output in OutputPanel
         │
         ▼
[SUBMIT button clicked] ← separate from Run
         │
         ▼
POST /api/submissions  ← existing route, adds code + language
Saves to DB submissions table
```

---

## 3. DB SCHEMA ADDITIONS

⚠️ STOP — show this SQL to user, wait for "APPROVED" before pushing.

### Migration: add code execution columns to submissions

```sql
-- Add code storage to submissions
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS code          TEXT,
  ADD COLUMN IF NOT EXISTS language      TEXT DEFAULT 'javascript',
  ADD COLUMN IF NOT EXISTS last_run_at   TIMESTAMPTZ;

-- New table: execution_runs (test run history, NOT final submissions)
-- Runs are cheap and frequent. Keep separate from submissions.
CREATE TABLE IF NOT EXISTS public.execution_runs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id   UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  code         TEXT NOT NULL,
  language     TEXT NOT NULL,
  stdin        TEXT,
  stdout       TEXT,
  stderr       TEXT,
  compile_out  TEXT,
  status_id    INTEGER NOT NULL,  -- Judge0 status code
  status_desc  TEXT NOT NULL,     -- "Accepted", "Wrong Answer", etc.
  time_ms      NUMERIC,
  memory_kb    INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.execution_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own runs"
  ON public.execution_runs
  FOR ALL USING (auth.uid() = user_id);

-- Index for fetching run history per problem
CREATE INDEX idx_execution_runs_user_problem
  ON public.execution_runs(user_id, problem_id, created_at DESC);
```

---

## 4. LANGUAGE SUPPORT STRATEGY

Judge0 uses numeric language_id values. Define these in lib/constants.ts:

```typescript
export const SUPPORTED_LANGUAGES = [
  { id: 63,  name: 'JavaScript', extension: 'js',  monacoLang: 'javascript' },
  { id: 71,  name: 'Python',     extension: 'py',  monacoLang: 'python'     },
  { id: 62,  name: 'Java',       extension: 'java',monacoLang: 'java'       },
  { id: 54,  name: 'C++',        extension: 'cpp', monacoLang: 'cpp'        },
  { id: 73,  name: 'Rust',       extension: 'rs',  monacoLang: 'rust'       },
] as const

export type LanguageId = typeof SUPPORTED_LANGUAGES[number]['id']

export const DEFAULT_LANGUAGE_ID = 63 // JavaScript

// Default starter code per language
export const STARTER_CODE: Record<number, string> = {
  63:  '// JavaScript\nfunction solution() {\n  \n}\n',
  71:  '# Python\ndef solution():\n    pass\n',
  62:  '// Java\nclass Solution {\n    public void solve() {\n        \n    }\n}\n',
  54:  '// C++\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
  73:  '// Rust\nfn main() {\n    \n}\n',
}
```

---

## 5. JUDGE0 API INTEGRATION DESIGN

### Environment variables needed (add to .env.local):
```
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
```

### Rate limiting strategy:
- Free tier: 50 requests/day on RapidAPI
- Dev fallback: Piston API (https://emkc.org/api/v2/piston) — unlimited, no key
- Use Piston for development, Judge0 for production
- Add env var: NEXT_PUBLIC_EXECUTION_PROVIDER=piston|judge0

### Piston API (dev) request shape:
```typescript
POST https://emkc.org/api/v2/piston/execute
{
  language: "javascript",
  version: "*",
  files: [{ content: "console.log('hello')" }],
  stdin: ""
}
```

### Judge0 API (prod) request shape:
```typescript
POST https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false
{
  source_code: btoa(code),    // base64 encoded
  language_id: 63,
  stdin: btoa(stdin ?? ''),
  cpu_time_limit: 5,
  memory_limit: 128000
}
```

---

## 6. NEW FILE STRUCTURE FOR PHASE 2

```
app/
├── (dashboard)/
│   └── problems/
│       └── [id]/
│           └── page.tsx          ← REPLACE stub — split view layout

app/api/
├── execute/
│   └── route.ts                  ← NEW — Judge0/Piston bridge
└── submissions/
    └── route.ts                  ← UPDATE — add code + language fields

components/
└── editor/                       ← NEW folder
    ├── CodeEditor.tsx            ← Monaco wrapper
    ├── LanguageSelector.tsx      ← language dropdown
    ├── OutputPanel.tsx           ← stdout/stderr display
    ├── RunButton.tsx             ← triggers execution
    └── SubmitButton.tsx          ← saves to DB

hooks/
├── useCodeEditor.ts              ← NEW — editor state (code, language, output)
└── useExecuteCode.ts             ← NEW — mutation calling /api/execute

stores/
└── editorStore.ts                ← NEW — Zustand: code draft, language, output

supabase/migrations/
└── XXXXXXXX_phase2_execution.sql ← NEW — execution_runs table + submissions cols
```

---

## 7. PROBLEM DETAIL PAGE LAYOUT

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Problems          Two Sum              Easy      │
├────────────────────────┬────────────────────────────────────┤
│                        │  Language: [JavaScript ▼]          │
│  Problem Description   │                                    │
│                        │  ┌──────────────────────────────┐  │
│  Constraints           │  │                              │  │
│                        │  │   Monaco Editor              │  │
│  Examples              │  │                              │  │
│    Input: ...          │  │                              │  │
│    Output: ...         │  └──────────────────────────────┘  │
│                        │                                    │
│  Tags                  │  [▶ Run]        [✓ Submit]         │
│                        │                                    │
│                        │  ┌──────────────────────────────┐  │
│                        │  │  Output                      │  │
│                        │  │  > Hello World               │  │
│                        │  └──────────────────────────────┘  │
└────────────────────────┴────────────────────────────────────┘
```

Mobile: tabs (Description | Code | Output) — not side by side.

---

## 8. EDITOR STATE DESIGN

```typescript
// stores/editorStore.ts
interface EditorState {
  code:         string
  languageId:   number
  output:       ExecutionResult | null
  isRunning:    boolean
  isDirty:      boolean   // unsaved changes
  
  setCode:       (code: string) => void
  setLanguageId: (id: number) => void
  setOutput:     (result: ExecutionResult) => void
  setIsRunning:  (v: boolean) => void
  resetEditor:   (problemId: string) => void  // load saved draft
}

interface ExecutionResult {
  status:      string
  statusId:    number
  stdout:      string | null
  stderr:      string | null
  compileOut:  string | null
  timeMs:      number | null
  memoryKb:    number | null
}
```

Code drafts persist to **localStorage** keyed by `draft:${problemId}:${languageId}`.
Never persist drafts to the DB — too expensive per keystroke.
Only persist to DB on explicit Submit.

---

## 9. EXECUTION API ROUTE DESIGN

```typescript
// app/api/execute/route.ts
// Input shape (Zod validated):
{
  problem_id:  string (uuid)
  code:        string (max 50000 chars)
  language_id: number (must be in SUPPORTED_LANGUAGES)
  stdin?:      string (optional custom input)
}

// Output shape:
{
  data: ExecutionResult | null
  error: string | null
}

// Flow:
1. Validate input with Zod
2. Check auth (user must be logged in)
3. Route to Piston (dev) or Judge0 (prod) based on env var
4. Execute code
5. Normalize response to ExecutionResult shape
6. Save to execution_runs table (async, non-blocking)
7. Return ExecutionResult to client
```

---

## 10. PHASE 2 IMPLEMENTATION ORDER

This is the ONLY safe order. Each step depends on the previous.

```
STEP 1 — DB migration (execution_runs + submissions columns)
         Wait for "APPROVED", push migration, regenerate types

STEP 2 — lib/constants.ts additions (SUPPORTED_LANGUAGES, STARTER_CODE)

STEP 3 — stores/editorStore.ts (Zustand editor state)

STEP 4 — app/api/execute/route.ts (Piston first, Judge0 later)

STEP 5 — hooks/useExecuteCode.ts (mutation calling /api/execute)

STEP 6 — components/editor/ folder
         CodeEditor.tsx → LanguageSelector.tsx → OutputPanel.tsx
         → RunButton.tsx → SubmitButton.tsx
         Build in this order — each depends on the previous.

STEP 7 — app/(dashboard)/problems/[id]/page.tsx
         Replace stub with full split-view layout
         Assemble from components built in Step 6

STEP 8 — Update app/api/submissions/route.ts
         Add code + language fields to upsert

STEP 9 — Verification
         Run → output appears
         Submit → saved to DB
         Refresh → code persists
```

---

## 11. RISKS TO MITIGATE

| Risk | Mitigation |
|---|---|
| Monaco SSR crash | Always dynamic import: `dynamic(() => import(...), { ssr: false })` |
| Judge0 rate limits | Use Piston for dev, Judge0 only in prod |
| Large bundle from Monaco | Dynamic import + code splitting keeps it lazy |
| User spamming Run | Disable Run button while `isRunning === true` |
| Code loss on navigate | LocalStorage draft auto-save on every keystroke (debounced 500ms) |
| Execution timeout UX | Show spinner with "Running..." + 10s timeout fallback message |

---

## DECISION LOG ENTRY

Add this to DECISIONS.md before starting Phase 2:

```
| Phase 2 execution provider | Use Piston API (free, no key) for 
development. Swap to Judge0 (RapidAPI) for production via 
NEXT_PUBLIC_EXECUTION_PROVIDER env var. Abstracts the provider 
behind /api/execute so the frontend never knows which is used. |

| Code persistence strategy | Drafts → localStorage (keyed by 
problem+language, instant, free). Final code → submissions table 
only on explicit Submit click. Never auto-save to DB. |

| Monaco SSR | Always dynamically imported with ssr:false. 
Monaco accesses window/document — it cannot run server-side. |
```