---
tags: [fetch, ui-redesign]
source: https://docs.expo.dev/versions/v57.0.0/sdk/linear-gradient/
fetched: 2026-10-19
kind: primary
---

# LinearGradient — Expo SDK 57 (expo-linear-gradient)

> Fetched 2026-10-19 · Expo's SDK 57 doc (last modified 2026-06-29; installed 57.0.2). Read for Android-specific knobs that affect cost/quality of large gradients.

Quotes extracted with WebFetch; short passages only.

## What it says

- `colors`: "At least two colors are required."
- `locations`: "The color-stop locations must be ascending from least to greatest."
- `dither` (Android only, default `true`): "can reduce the gradient color banding issue." and "Setting `false` may improve gradient rendering performance."
- "Included in Expo Go".

## What it does not say

- No numbers on the dither cost or on full-screen gradients.
- Nothing about animating gradient colours (would require re-rendering the native view per frame or an animated-opacity crossfade between two static gradients — inference).
