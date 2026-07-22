# TABICLIP implementation plan

## Current objective

Build a deployable, mobile-first MVP foundation and one complete mock-mode vertical flow:

```text
create trip → collect URL/image/text → organize as place → add to date → open travel mode
```

Supabase schema, RLS, private Storage policies, and adapters must be ready without making Supabase mandatory for local UI development.

## Decisions

- Next.js 16 App Router with React 19, TypeScript strict mode, Tailwind CSS 4, and locale-prefixed routes.
- Japanese is the default product locale; Korean is supported with matching message keys.
- Mock mode is explicit (`NEXT_PUBLIC_DATA_MODE=mock`), deterministic, and supports tests and local demos.
- Service Worker/offline data caching is deferred. Installable manifest metadata and a trustworthy offline notice are included because authenticated travel data must not be cached casually.
- Repository boundaries exist for trip workspace persistence because both mock and Supabase implementations are required.
- Storybook documents only product primitives and meaningful states, not every low-level button or page.

## Stages

- [x] Inspect repository and decode the complete request.
- [x] Verify current stable package versions and current official Next.js, Storybook, and Supabase guidance.
- [x] Create repository instructions and architecture plan.
- [x] Scaffold the application, quality tooling, i18n, design tokens, and PWA metadata.
- [x] Implement the end-to-end mock-mode product flow and Supabase adapter boundary.
- [x] Add database migrations, RLS, private Storage policies, seed data, and pgTAP tests.
- [x] Add unit, component, Query, Zustand, Storybook, accessibility, and E2E tests.
- [x] Run available checks and fix failures.
- [x] Synchronize README and design documents with verified implementation.

## Risks and follow-up

- A real Supabase project and email delivery cannot be proven from a credential-free local environment; local SQL/pgTAP and adapter tests provide the verification boundary.
- Browser-specific WebKit execution may depend on installed Playwright browser binaries. Chromium mobile is the required baseline in normal CI.
- Offline mutation queues, push, native shells, share extensions, OCR, and AI analysis stay on the roadmap.

## Verification results

- `pnpm lint`: passed with zero warnings.
- `pnpm typecheck`: passed in strict mode.
- `pnpm format:check`: passed after final formatting.
- `pnpm test:coverage`: 46/46 passed; statements 86.82%, branches 86.48%, functions 82.95%, lines 90.34% in the configured core scope.
- `pnpm build`: passed with 16 static/dynamic route entries and locale variants.
- `pnpm build-storybook`: passed with the official Next.js+Vite integration and 12 product targets/states.
- `pnpm test:e2e`: 6/6 passed (2 workflow/accessibility and 4 mobile screenshots).
- `pnpm test:db`: not executed locally. `supabase start` failed because Docker Desktop was not running (`//./pipe/docker_engine` missing). Eleven pgTAP assertions and a Docker-backed CI job are present; this result is intentionally not reported as passing.
