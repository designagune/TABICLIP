# ADR 0002: TanStack Query and Zustand have different jobs

- Status: accepted
- Date: 2026-07-21

## Decision

TanStack Query owns repository-backed server state and mutation invalidation. Feature Zustand stores own only transient, cross-component workflow state. Routes own restorable navigation state and React Hook Form owns complex input.

## Consequences

There is no second copy of server data, no monolithic `useAppStore`, and no custom global React Context. Query tests need isolated clients; testable Zustand stores expose vanilla factories.
