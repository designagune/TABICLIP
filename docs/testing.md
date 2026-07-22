# Testing strategy

## Layers

- Vitest protects date rules, Zod boundaries, query keys, mappers, the mock repository, platform adapters, locale parity, and Zustand actions.
- React Testing Library checks Japanese form errors and user-driven component actions by role/label rather than CSS implementation.
- TanStack Query integration tests use a fresh client and verify loading, success, mutation, and invalidation.
- Storybook catalogs 12 product primitives/states with Japanese content and the accessibility addon set to fail on violations.
- Playwright runs the complete trip → URL/image clip → place → itinerary → travel-mode flow at 390×844, plus keyboard/error smoke checks.
- Four screenshots cover collection, place grouping, itinerary, and travel mode.
- Browser time is fixed to 2026-07-21 in E2E tests so date-driven mock data and visual snapshots remain deterministic.
- pgTAP asserts explicit Data API grants plus owner/member/stranger RLS behavior against local Supabase.

## Coverage

Configured global thresholds are lines/statements 70%, functions 65%, and branches 60%. The measured configured business-logic scope currently reports:

```text
statements 86.82%
branches   86.48%
functions  82.95%
lines      90.34%
```

Coverage includes core schemas, date rules, stores, row mappers, mock persistence, query keys, and browser platform behavior. Next.js route shells, metadata/configuration, generated Supabase types, stories, fixtures, and low-level UI primitives are not counted. Component and E2E tests still exercise UI behavior outside that numeric scope.

## Local database constraint

`pnpm test:db` requires Docker Desktop and a running `supabase start`. If Docker is unavailable, do not report RLS as executed; CI has a dedicated Docker-backed database job.
