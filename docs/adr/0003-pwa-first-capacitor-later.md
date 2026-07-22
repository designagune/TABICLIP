# ADR 0003: Installable PWA metadata now, Capacitor later

- Status: accepted
- Date: 2026-07-21

## Decision

Ship a mobile-first web app with install metadata, safe areas, connectivity UI, and platform adapters. Defer the service worker and Capacitor projects.

## Consequences

The product can be tested quickly on mobile web without pretending authenticated data works offline. Native-specific behavior has an explicit seam, while share extensions, notifications, sync, signing, and app-store work remain independently estimable.
