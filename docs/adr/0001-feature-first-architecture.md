# ADR 0001: Feature-first architecture with selective ViewModels

- Status: accepted
- Date: 2026-07-21

## Decision

Organize application behavior under `src/features` and expose repository/query/domain boundaries from each feature. Use a ViewModel hook only for multi-step screens such as collection; simple screens call focused query hooks.

## Consequences

Server Component/client boundaries stay visible and related behavior changes together. The code avoids both page-sized client modules and a full Clean Architecture/MVVM ceremony for simple reads. Cross-feature imports must follow the documented public domain direction.
