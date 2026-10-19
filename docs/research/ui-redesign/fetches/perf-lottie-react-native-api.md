---
tags: [fetch, ui-redesign]
source: https://github.com/lottie-react-native/lottie-react-native/blob/master/docs/api.md
fetched: 2026-10-19
kind: primary
---

# lottie-react-native — API (docs/api.md)

> Fetched 2026-10-19 · Props reference on `master` (v8 line; SDK 57 pins 7.3.8). Read for the Android render-mode knob.

Quotes extracted with WebFetch; short passages only.

## What it says

- `renderMode` (iOS, Android; default `AUTOMATIC`): "a String flag to set whether or not to render with `HARDWARE` or `SOFTWARE` acceleration."
- `cacheComposition` (Android, default `true`): "a boolean flag indicating whether or not the animation should do caching."
- `resizeMode`: "Supports `cover`, `contain` and `center`".
- `loop` default `true`; `autoPlay` default `false`; `speed` negative reverses.

## What it does not say

- No `enableMergePathsAndroidForKitKatAndAbove` or `hardwareAccelerationAndroid` on this page (older prop names).
- No guidance on which `renderMode` to choose on low-end Android.
- No mention of `.lottie` here (README covers it).
