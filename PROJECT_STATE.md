# PROJECT_STATE.md — DSA Mentor AI

## Current Implementation Progress
- Next.js 14 App Router project successfully scaffolded with TypeScript and Tailwind CSS.
- Required dependencies installed (Supabase SSR, TanStack Query, Zustand, Zod, React Hook Form, shadcn/ui).
- Core Next.js routing structure setup with placeholders (`(auth)`, `(dashboard)`, `api/`).
- Initial Supabase DB Schema applied to remote project and linked successfully.
- TypeScript database types synced natively to frontend (`types/database.ts`).
- Seed data generated for topics and problems.
- Initial global state structure (React Query Provider) setup.
- Basic middleware configured for Supabase session routing (renamed to `proxy.ts`).

## Completed Phases/Prompts
- **Prompt 0:** Workspace Bootstrap (AGENTS.md, GEMINI.md, GUARDRAILS.md created).
- **Prompt 1:** Project Structure & Architecture Docs.
- **Prompt 2:** Database Schema & Supabase Setup (Migrations, Types, Seeding).

## Existing Architecture Summary
- **Frontend Framework:** Next.js App Router. Server Components are heavily favored for initial SSR data fetching (direct DB calls).
- **Interactive State/Mutations:** Client Components use TanStack Query calling Next.js API Routes.
- **Authentication:** Supabase Auth via SSR cookies in `proxy.ts` (formerly `middleware.ts`).
- **Styling:** Tailwind CSS + shadcn/ui (using `sonner` for toast notifications).

## Current Database Schema Status
- `users_profile`: Created (with specific INSERT/UPDATE/SELECT RLS).
- `topics`: Created (seeded with 18 topics).
- `problems`: Created (seeded with initial problems). Denormalized `topic_name` is present.
- `submissions`: Created (RLS restricts to own).
- `user_stats`: Created (with SELECT/UPDATE RLS).
- `streak_history`: Created (with SELECT/INSERT RLS).
- `ai_responses`: Created (cache table for Phase 4).

## Existing UI/Components/Hooks/Routes
- **Routes:** Placeholders exist for `/login`, `/signup`, `/dashboard`, `/problems`, `/problems/[id]`, `/profile`, and standard API routes.
- **Components:** `components/ui/` has basic shadcn components. App features are segregated into `components/shared`, `components/dashboard`, `components/layout`, etc.
- **Hooks & Types:** Placeholder setup completed, no complex hooks fully wired yet.

## Known Deviations from Original Prompts
- Renamed `middleware.ts` to `proxy.ts` as per Next.js 16.2.4 deprecation warning.
- Added explicit `INSERT` and `UPDATE` RLS policies to `users_profile`, `user_stats`, and `streak_history` schema.
- Replaced `uuid_generate_v4()` with native `gen_random_uuid()` to fix a missing extension error during migration push.

## Pending Work
- Building out Auth UI pages (Login / Signup).
- Building the Dashboard layout and navigation.
- Wiring up actual data fetching in Server Components for the Dashboard.
- Building the Submission flow.

## Known Risks/Issues
- Next.js 16 `proxy.ts` behavior might differ slightly from older Next.js 14 `middleware.ts`. Needs testing with Supabase SSR Auth.
- Strict RLS on `users_profile` requires trigger functions to bypass RLS during auth creation. The existing `security definer` trigger handles this securely.

## Current Tooling Versions
- **Next.js:** 16.2.4 (Turbopack)
- **Supabase CLI:** Native local install via npx
- **Supabase JS:** @supabase/supabase-js, @supabase/ssr (latest)
- **TypeScript:** Strict mode enabled.
