# PWA now, Capacitor later

## MVP PWA scope

The web app works without installation. It provides a manifest, generated 512px/maskable and Apple icons, standalone display metadata, safe-area bottom navigation, online/offline detection, and an iOS home-screen instruction card.

There is intentionally no service worker yet. Caching authenticated trip, attachment, or reservation responses without explicit invalidation could show stale or sensitive data on a shared device. This release therefore favors honest offline messaging over fake offline support.

## Reusable code

- Feature types, schemas, services, repositories, Query hooks, and most React UI.
- `PlatformService` contract for images, share, maps, clipboard, and connectivity.
- Locale messages and domain error codes.
- Supabase Auth/database/Storage backend and RLS.

## Native replacements

| Web implementation          | Capacitor/native implementation                     |
| --------------------------- | --------------------------------------------------- |
| hidden file input           | Camera/Photos picker with native permission prompts |
| Web Share API/copy fallback | native share sheet                                  |
| external map URL            | native map chooser/deep link                        |
| `navigator.onLine`          | Capacitor Network plugin                            |
| browser install guide       | removed inside native shell                         |

The native shell should load a deployed Next.js origin or a separately planned static client; App Router server actions, proxy session refresh, and route handlers cannot simply be bundled into the device.

## Later native capabilities

- iOS Share Extension and Android Share Intent feed normalized input to the collection service.
- Local notifications reference server itinerary IDs and contain no reservation secrets.
- Offline storage needs encrypted local records, per-user logout cleanup, conflict policy, and incremental sync.
- App Store releases require dedicated native projects, signing, privacy manifests, and permission copy.
