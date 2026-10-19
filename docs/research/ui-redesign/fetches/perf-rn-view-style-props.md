---
tags: [fetch, ui-redesign]
source: https://reactnative.dev/docs/view-style-props
fetched: 2026-10-19
kind: primary
---

# View Style Props — React Native

> Fetched 2026-10-19 · RN doc served for **0.87** (installed 0.86.3, where the gradient prop is still `experimental_backgroundImage` — local-react-native.md). Read for native glow/shadow/gradient/blur options without extra libraries.

Quotes extracted with WebFetch; short passages only.

## What it says

- `elevation`: "Sets the elevation of a view, using Android's underlying elevation API."
- `boxShadow`: "Outset shadows are only supported on **Android 9+**. Inset shadows are only supported on **Android 10+**." and "`boxShadow` is only available on the New Architecture."
- `filter`: Android-only functions include `blur`, `contrast`, `dropShadow`, `grayscale`, `hueRotate`, `invert`, `sepia`, `saturate`; "`blur` and `dropShadow` are only supported on **Android 12+**."
- `backgroundImage` (0.87 name): "provides the ability to draw a `linear-gradient()` and `radial-gradient()` using a web-like syntax." Example `<View style={{ backgroundImage: 'linear-gradient(45deg, blue, red)' }} />`.
- iOS filter note: "Due to issues with performance and spec compliance, these are the only two filter functions available on iOS."

## What it does not say

- No performance remarks for `boxShadow`, `elevation` or Android `filter: blur` — cost on a Mali-G57 is unknown.
- Does not say how `boxShadow` is rendered on Android (blurred shadow draws are typically offscreen/alpha work — inference, see perf-android-overdraw.md).
