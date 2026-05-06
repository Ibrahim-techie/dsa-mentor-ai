---
trigger: always
---
# TypeScript Rules (Always On)
- strict mode is enabled — no implicit any
- All props interfaces must be explicitly defined above the component
- Use `type` for unions/intersections, `interface` for object shapes
- Database types are auto-generated in types/database.ts — use them
- All API response shapes must have a corresponding Zod schema in lib/validations/
