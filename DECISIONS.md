# DECISIONS.md — DSA Mentor AI Architectural Log

| Decision | Context | Outcome / Rationale |
|---|---|---|
| **App Router over Pages Router** | The codebase requires modern server capabilities. | **Accepted.** AGENTS.md enforces strict Next.js App Router rules. Better SSR performance and nested layouts. |
| **Direct DB Calls vs API Routes** | Standard web dev uses API routes for everything. | **Rejected.** Server Components will call Supabase directly to reduce latency and remove redundant API layers. API routes strictly reserved for Client Component mutations. |
| **Denormalizing `topic_name` in `problems`** | `topic_name` logically belongs in `topics`, but is used in almost every problem list UI. | **Accepted.** To avoid doing a `JOIN` on every query of the `problems` table, `topic_name` is denormalized. Topics rarely change, minimizing update anomalies. |
| **`sonner` over `shadcn/toast`** | Need a robust notification system. | **Accepted.** Enforced by GUARDRAILS.md. Sonner provides better DX and cleaner stackable toasts. |
| **`gen_random_uuid()` over `uuid-ossp`** | Supabase migration threw an error when using `uuid_generate_v4()`. | **Accepted.** Modified initial schema to use `gen_random_uuid()`, the native PostgreSQL v13+ UUID generator. |
| **Next.js Middleware Rename** | Next.js 16.2.4 threw a deprecation warning for `middleware.ts`. | **Accepted.** Renamed to `proxy.ts`. Must ensure Supabase `@supabase/ssr` functions perfectly within `proxy.ts`. |
| **Supabase Local vs Remote Setup** | MCP local authentication issues prevented local DB spin up. | **Accepted.** Connected CLI directly to remote branch and pushed schema/seed data directly. |
| **Tailwind v4 Setup** | Next.js 16 defaults to Tailwind v4, replacing tailwind.config.ts with inline CSS. | **Accepted.** Preserved Tailwind v4 structure. Custom colors defined directly as `oklch()` in `@theme inline` in `globals.css`. |
| **Server/Client auth component split** | Auth pages are server components (page.tsx) with client form components (LoginForm, SignupForm) as children. Follows AGENTS.md Rule 10 — pages stay server components, interactivity extracted to leaf client components. |
| **Client-Side Data Mutations** | Needed to handle rapid UI updates for submissions and favorites. | **Accepted.** Used TanStack Query (`useMutation`) with optimistic UI updates in `useSubmissions.ts`. API routes handle the actual DB operations. |
| **Type Alignment with DB Schema** | Initial app types did not match `types/database.ts` (e.g., `link` nullable, `weak_topics` as string array). | **Accepted.** Modified `types/app.ts` to reflect the truth of `database.ts` to prevent TypeScript errors. Used type guards for string literals instead of enums. |
## Future Refactor Notes
- Generic Supabase Error Handler needed for API routes to streamline `{ data, error }` returns.
- Check `proxy.ts` behavior with Supabase cookies if any silent session issues arise.
| Zod error property  ZodError uses `.issues` not `.errors` in 
current Zod version. Always use `parsed.error.issues[0].message` 
in API routes. |