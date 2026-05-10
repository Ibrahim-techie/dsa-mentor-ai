# ARCHITECTURE.md — DSA Mentor AI

## System Overview

```
Browser (Next.js React)
       │
       ├── Server Components (SSR) ──→ Supabase DB (direct, RLS-enforced)
       │
       └── Client Components ──→ TanStack Query ──→ Next.js API Routes ──→ Supabase DB
                                                                         └→ External APIs (future)
```

## Request Flow

### Page Load (Server Component)
1. proxy.ts checks Supabase session → redirects if unauthenticated
2. Server component fetches initial data directly via Supabase SSR client
3. React renders with pre-fetched data (no loading flash)

### Client Interaction (Client Component)
1. User action triggers TanStack Query mutation
2. Mutation calls Next.js API route (POST /api/submissions)
3. API route validates with Zod → queries Supabase → returns { data, error }
4. TanStack Query updates cache → React re-renders optimistically

### Auth Flow
1. User submits login form
2. Supabase Auth sets httpOnly cookie via @supabase/ssr
3. proxy.ts reads cookie on every request
4. Protected routes redirect to /login if no valid session

## State Architecture

| State Type | Tool | Location |
|---|---|---|
| Server/async state | TanStack Query | hooks/ |
| Auth state | Supabase + hook | hooks/useUser.ts |
| UI state (filters, sidebar) | Zustand | stores/ |
| Form state | react-hook-form | components/ |
| URL state | Next.js searchParams | app/ pages |

## Database Architecture

See supabase/migrations/ for the full schema.

Tables: users_profile, problems, submissions, user_stats, streak_history, topics

## API Route Convention

All API routes return:
```typescript
{ data: T | null, error: string | null, status: number }
```

## Environment Variables

| Variable | Used In | Required |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Client + Server | Yes |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Client + Server | Yes |
| SUPABASE_SERVICE_ROLE_KEY | Server only | Yes |
| NEXT_PUBLIC_APP_URL | Auth callbacks | Yes |
