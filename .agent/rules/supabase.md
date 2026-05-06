---
trigger: *.ts, *.tsx
---
# Supabase Rules (Active on all TS files)
- Server-side: use createServerClient from lib/supabase/server.ts
- Client-side: use createBrowserClient from lib/supabase/client.ts
- All DB queries must go through typed Supabase client — no raw SQL in components
- RLS is enabled on all tables — never bypass with service role key in client code
- Auth state: use useUser() hook from hooks/useUser.ts — do not call supabase.auth.getUser() directly in components
