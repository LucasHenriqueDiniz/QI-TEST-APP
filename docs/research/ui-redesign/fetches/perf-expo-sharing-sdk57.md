---
tags: [fetch, ui-redesign]
source: https://docs.expo.dev/versions/v57.0.0/sdk/sharing/
fetched: 2026-10-19
kind: primary
---

# Sharing — Expo SDK 57 (expo-sharing)

> Fetched 2026-10-19 · Expo's versioned doc for expo-sharing on SDK 57 (page last modified 2026-08-21; SDK 57 bundles `expo-sharing ~57.0.23`, **not installed** in this app). Read to know whether a captured result image can be shared to WhatsApp/Instagram.

Quotes extracted with WebFetch; short passages only.

## What it says

- `shareAsync(url, options)`: `url` is "Local file URL to share."; opens an "action sheet to share file to different applications."
- Options: `mimeType` (Android: sets the Intent type), `dialogTitle` (Android/web), `UTI` (iOS), `anchor` (iPad).
- Lets you share "files directly with other compatible applications" (no apps named).
- `isAvailableAsync()`: "Determine[s] if the sharing API can be used in this app".
- Platforms Android, iOS, web; "Included in Expo Go".
- Config plugin covers properties that "cannot be set at runtime and require building a new app binary to take effect."
- New, "currently experimental": receiving shared content (`useIncomingShare()`, `getSharedPayloads()`…), with Android intent filters via the config plugin.

## What it does not say

- Does not name WhatsApp or Instagram, and has no way to target one specific app (it is the generic Android chooser).
- Does not mention Instagram Stories' own share intent (background/sticker image) — not supported by this API as documented.
- Does not mention `expo-file-system` or that the file must be a `file://` path produced by e.g. `captureRef(..., { result: 'tmpfile' })`.
