---
tags: [fetch, ui-redesign]
source: https://raw.githubusercontent.com/Shopify/react-native-skia/v2.6.2/apps/docs/docs/getting-started/installation.md
fetched: 2026-10-19
kind: primary
---

# React Native Skia — Installation (tag v2.6.2)

> Fetched 2026-10-19 · Maintainer installation doc at tag `v2.6.2`, the exact version Expo SDK 57 bundles (`@shopify/react-native-skia 2.6.2`). The live site (shopify.github.io/…/installation) returned 404; `main` now documents v3 (perf-skia-installation-main.md).

Quotes extracted with WebFetch; short passages only.

## What it says

- "Below is the app size increase to be expected when adding React Native Skia to your project."
- Table (iOS | Android | Web): "| 6 MB | 4 MB | 2.9 MB |"
- "`react-native@>=0.79` and `react@>=19` are required."
- "you should make sure you're on at least `iOS 14` and `Android API level 21` or above."
- "To use React Native Skia with video support, `Android API level 26` or above is required."
- "Expo provides a `with-skia` template, which you can use to create a new project."

## What it does not say

- How the 4 MB is measured at this tag (a WebSearch snippet of the main-branch docs says the Android figure is for App Bundles on arm64 — not read first-hand at this tag).
- No runtime cost / memory figure, nothing about low-end GPUs.
- Nothing about when Skia is worth it versus SVG.
