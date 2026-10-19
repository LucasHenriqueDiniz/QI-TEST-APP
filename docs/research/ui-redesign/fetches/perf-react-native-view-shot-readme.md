---
tags: [fetch, ui-redesign]
source: https://github.com/gre/react-native-view-shot
fetched: 2026-10-19
kind: primary
---

# react-native-view-shot — README

> Fetched 2026-10-19 · Maintainer README on GitHub (current `main`, release number not shown on the page; SDK 57 bundles 5.1.0). Read for New Architecture support and Android caveats of `captureRef`.

Quotes extracted with WebFetch; short passages only.

## What it says

- "This library fully supports React Native's new architecture (Fabric + TurboModules) from version 4.0+." Requirements listed: React Native 0.80.0+ and Node.js 20+.
- Install for Expo: "npx expo install react-native-view-shot"
- `format`: "`png` or `jpg`, plus `webp` and `raw` on Android. Defaults to `png`."
- `result: 'tmpfile'`: "save to a temporary file _(that will only exist for as long as the app is running)_." Also `base64` and `data-uri`.
- `fileName`: "(Android only) the file name of the file. Must be at least 3 characters long."
- Android: "you need to make sure `collapsable` is set to `false` if you want to snapshot a **View**."
- SurfaceView: "Opt in to SurfaceView capture; it can have a significant performance cost."
- "Support of special components like Video / GL views is not guaranteed to work."
- `releaseCapture`: "For tmpfile it will clean them out, for other result types it just won't do anything."

## What it does not say

- Whether react-native-svg content and `expo-linear-gradient` render correctly in the capture on Android (they are normal views, so expected to — not stated).
- Whether a `BlurView` (RenderNode effect) or Skia canvas is captured correctly; Skia offers its own snapshot API (not read).
- No guidance on capturing an off-screen view (e.g. a 1080×1920 share card that is never shown).
