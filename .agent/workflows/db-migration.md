---
description: Create and apply a Supabase database migration safely
---
# Workflow: /migrate <migration-name>

When the user types `/migrate <migration-name>`, execute this sequence:

1. Show the current schema context (read existing migration files)
2. Generate the migration SQL and save to supabase/migrations/<timestamp>_<migration-name>.sql
3. Show the full SQL to the user — STOP and wait for "APPROVED"
4. After approval, run: npx supabase db push
5. Regenerate TypeScript types: npx supabase gen types typescript --local > types/database.ts
6. Report success and list affected tables
