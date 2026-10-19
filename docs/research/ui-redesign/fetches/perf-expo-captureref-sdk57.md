---
tags: [fetch, ui-redesign]
source: https://docs.expo.dev/versions/v57.0.0/sdk/captureRef/
fetched: 2026-10-19
kind: primary
---

# captureRef — Expo SDK 57 (react-native-view-shot)

> Fetched 2026-10-19 · Expo's SDK 57 page for `react-native-view-shot` (SDK 57 bundles `react-native-view-shot 5.1.0`, **not installed** in this app). Read to confirm Expo support for capturing the result card as an image.

Quotes extracted with WebFetch; short passages only.

## What it says

- "A library that allows you to capture a React Native view and save it as an image."
- "Included in Expo Go" (`inExpoGo: true`); platforms Android, iOS, Web.
- "Given a view, `captureRef` will essentially screenshot that view and return an image for you."
- Example options: `result: 'tmpfile'`, `height`, `width`, `quality: 1`, `format: 'png'`.
- Install: `npx expo install react-native-view-shot`.
- "Remember to take the device `PixelRatio` into account."
- GLView: "we recommend you use GLView's takeSnapshotAsync instead."

## What it does not say

- No Android-specific guidance (e.g. `collapsable={false}`), no full options list — defers to the library README (perf-react-native-view-shot-readme.md).
- Being "in Expo Go" does not put it in this app's existing dev-client binary; see perf-expo-dev-builds.md.
