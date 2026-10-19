---
tags: [fetch, ui-redesign]
source: https://github.com/AlirezaHadjar/react-native-fast-confetti
fetched: 2026-10-19
kind: vendor
---

# react-native-fast-confetti — README

> Fetched 2026-10-19 · Maintainer README (v2 line). Marked vendor because its performance claim is a tagline without benchmarks. Read to price the "fast confetti" option.

Quotes extracted with WebFetch; short passages only.

## What it says

- "The fastest confetti animation library for React Native, powered by Skia Atlas API."
- "This library depends on react-native-reanimated, @shopify/react-native-skia, and react-native-worklets."
- v2 minimums (paraphrase): RN ≥ 0.79, React ≥ 19, Skia ≥ 2.0.0, Reanimated ≥ 4.0.0, Worklets ≥ 0.7.0 — satisfied by SDK 57's Skia 2.6.2 + the installed Reanimated 4.5.1 / Worklets 0.10.1.
- Defaults: `count` 200 ("Number of confetti pieces."), `autoplay` true ("Play animation on mount."), 100 per `<PIConfetti.Origin />`; `size` "Sets both width and height."
- "Skia does not publish a Reanimated-style compatibility matrix."

## What it does not say

- No fps or device benchmarks behind "fastest".
- No Expo notes. Using it means adding Skia (~4 MB Android, perf-skia-installation-v2.6.2.md) plus a dev-client rebuild.
