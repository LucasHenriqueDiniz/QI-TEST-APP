---
tags: [fetch, ui-redesign]
source: https://raw.githubusercontent.com/Shopify/react-native-skia/main/apps/docs/docs/getting-started/installation.md
fetched: 2026-10-19
kind: primary
---

# React Native Skia — Installation (main branch, v3)

> Fetched 2026-10-19 · Maintainer installation doc on `main`, which describes Skia v3 — **not** the 2.6.2 that SDK 57 bundles. Read to see where the library is going and what an upgrade would demand.

Quotes extracted with WebFetch; short passages only.

## What it says

- Minimum: RN "`0.79`, with the New Architecture"; React 19.
- "React Native Skia requires Android API level 26 or above and renders with Vulkan."
- Paraphrase: v3 needs a development build; "It does not run in Expo Go, which bundles the native code of v2."
- Paraphrase: set Android minSdk 26 via `expo-build-properties`.

## What it does not say

- No Bundle Size section on `main` (the 6/4/2.9 MB table is at the v2.6.2 tag).
- Vulkan-only rendering on a Mali-G57 MC2 — no device guidance.
