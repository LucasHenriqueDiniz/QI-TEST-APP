---
tags: [fetch, ui-redesign]
source: https://reactnative.dev/docs/accessibilityinfo
fetched: 2026-10-19
kind: primary
---

# AccessibilityInfo — React Native

> Fetched 2026-10-19 · RN API doc, served for **0.87** (installed 0.86.3; behaviour cross-checked in local-react-native.md). Read for how "reduce motion" maps on Android.

Quotes extracted with WebFetch; short passages only.

## What it says

- `isReduceMotionEnabled()`: "Query whether reduce motion is currently enabled."
- `reduceMotionChanged`: "Fires when the state of the reduce motion toggle changes." The boolean is true "when a reduce motion is enabled (or when "Transition Animation Scale" in "Developer options" is "Animation off")".
- `prefersCrossFadeTransitions()` is iOS only.

## What it does not say

- Does not name the Android Accessibility toggle ("Remove animations"); the installed native code reads `Settings.Global.TRANSITION_ANIMATION_SCALE == 0`.
- Does not mention the animator duration scale or battery saver.
