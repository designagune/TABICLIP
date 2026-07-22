# TABICLIP contribution guide

## Before editing

- Use `pnpm` and the Node.js version declared in `.nvmrc`/`package.json`.
- Read the relevant document in `docs/` before changing architecture, state ownership, persistence, tests, or PWA behavior.
- Keep the feature-first boundaries documented in `docs/architecture.md`.
- Update tests and documents when behavior or a public boundary changes.

## Architecture rules

- Server data belongs in TanStack Query; transient cross-component workflow state belongs in a feature-scoped Zustand store; URL-restorable state belongs in the route or search params.
- Do not copy server rows into Zustand and do not create custom global React contexts. Library providers such as `QueryClientProvider` and `NextIntlClientProvider` are allowed.
- UI components must not call Supabase directly. Use a feature repository/service, then the mock or Supabase adapter.
- Keep Supabase browser and server clients separate. Never expose a service-role key or admin secret to browser code.
- Keep user-facing copy in `src/messages/{ja,ko}` and use locale-aware formatting. Stable domain errors use codes, translated only at the presentation boundary.
- Use Server Components by default. Add `'use client'` only around interactive leaves and providers.
- Do not add an interface for a single trivial function. A repository interface is justified only where mock and Supabase implementations are both used.
- Do not introduce custom React Context for business or global UI state.

## Quality rules

- TypeScript stays strict. Avoid `any`, double assertions, and non-null assertions used to suppress errors.
- Prefer accessible roles, labels, keyboard behavior, and minimum 44px touch targets. Never communicate state by color alone.
- Production dependencies require a short rationale in `docs/architecture.md`.
- Generated files, build output, Storybook output, and Playwright artifacts stay untracked.
- New core domain rules require unit tests; interactive user flows require component or E2E coverage.

## Required verification

Run the smallest relevant checks while editing and, before handoff, run:

```text
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test:coverage
pnpm build
pnpm build-storybook
pnpm test:e2e
```

Run `pnpm test:db` when migrations or RLS/Storage policies change. `pnpm check` covers the non-browser application checks.
