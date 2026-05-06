# GEMINI.md — Antigravity-Specific Configuration

## Model Instructions
Use Gemini 3 Pro for all tasks in this project.

## Project Context
DSA Mentor AI is a Next.js 16.2.4 App Router application. The codebase uses TypeScript strict mode throughout. Supabase handles authentication and the PostgreSQL database. The UI is built with Tailwind CSS and shadcn/ui components.

## Antigravity Behavior
- Always show an implementation plan as an artifact BEFORE writing code for any feature larger than a single component
- When running terminal commands, show the command and its purpose before executing
- When creating Supabase migrations, create the SQL file in supabase/migrations/ and show the full SQL before executing
- After completing a feature, run `npm run build` to verify no TypeScript errors exist
- Use the browser agent to verify UI renders correctly after implementing any new page

## Preferred Workflow per Task
1. Read relevant existing files first
2. Generate an implementation plan artifact
3. Wait for "GO" or "APPROVED" if the task involves DB schema, auth, or env vars
4. Execute the implementation
5. Run type checks and lint
6. Report what was built and what to test manually

## Context Hints
- The `lib/supabase/` directory contains all Supabase client utilities
- The `types/database.ts` file contains all Supabase-generated types
- The `components/ui/` directory is shadcn/ui components — do NOT edit these files
- The `hooks/` directory contains all custom React hooks
