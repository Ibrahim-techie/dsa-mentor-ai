---
description: Start building a new feature from scratch
---
# Workflow: /newfeature <feature-name>

When the user types `/newfeature <feature-name>`, execute this sequence:

1. **Plan**: Generate a feature-plan.md artifact listing: components to create, API routes needed, DB changes (if any), types to define
2. **Pause**: Present the plan and wait for "APPROVED"
3. **Types first**: Create TypeScript types and Zod schemas
4. **DB layer**: Create Supabase migration SQL if needed — show SQL, wait for "APPROVED"
5. **API routes**: Build Next.js API route handlers
6. **Components**: Build UI components using shadcn/ui + Tailwind
7. **Page**: Assemble the page from components
8. **Test**: Run `npm run build` and `npm run type-check`
9. **Report**: List all files created/modified
