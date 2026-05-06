# GUARDRAILS.md — Failure Patterns & Hard Stops
- Use `sonner` for all toast notifications, NOT shadcn toast

## Hard Stop Conditions — Always pause and ask user
- About to run `supabase db push` or any migration command
- About to delete any database table or column
- About to modify Row Level Security policies
- About to add, change, or remove environment variables
- About to change Next.js middleware (proxy.ts)
- About to install a new npm package with a known security vulnerability
- Build fails more than 3 times on the same file — stop and report

## Learned Failure Patterns
- DO NOT import from `@supabase/auth-helpers-nextjs` — this project uses `@supabase/ssr`
- DO NOT use `cookies()` without `await` in Next.js 14 App Router — it's async
- DO NOT create client components at the page level — keep pages as server components and extract interactive parts into child client components
- DO NOT use `router.refresh()` after Supabase auth operations — use `revalidatePath()` from server actions instead
- DO NOT use uuid_generate_v4() — use gen_random_uuid() (native PG v13+)
- DO NOT create or reference middleware.ts — this project uses proxy.ts
- DO NOT use the uuid-ossp extension — it's not enabled on this Supabase project

## Recovery Instructions
If the agent gets stuck in a loop:
1. Stop the current agent
2. Force context reset
3. Re-read AGENTS.md
4. Start fresh with a scoped task
