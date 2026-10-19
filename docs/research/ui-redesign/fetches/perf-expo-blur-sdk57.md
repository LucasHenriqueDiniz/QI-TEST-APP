---
tags: [fetch, ui-redesign]
source: https://docs.expo.dev/versions/v57.0.0/sdk/blur-view/
fetched: 2026-10-19
kind: primary
---

# BlurView — Expo SDK 57 (expo-blur)

> Fetched 2026-10-19 · Expo's versioned doc for expo-blur on SDK 57 (source link points at `sdk-57`; SDK 57 bundles `expo-blur ~57.0.3`, not installed in this app). Read to know what Android blur costs and requires.

Quotes extracted with WebFetch; short passages only.

## What it says

- "The blurring feature is stable on Android." But: "`expo-blur` is stable on Android, but some code changes are required for the `BlurView` to work."
- Paraphrase: content must be wrapped in a `BlurTargetView` whose ref is passed to `BlurView` (`blurTarget`); otherwise the result is "a view with a semi-transparent background."
- `blurMethod` (Android only, default `'none'`):
  - `'none'`: "Renders a semi-transparent view instead of rendering a blur effect."
  - `'dimezisBlurView'`: "This method may lead to decreased performance on Android SDK 30 and below."
  - `'dimezisBlurViewSdk31Plus'`: blurs on SDK 31+, "for older versions of Android falls back to 'none'."
- "The blur can be achieved efficiently only by using the RenderNode Android API, which was introduced in Android SDK 31 (Android 12.0)." Older Android uses RenderScript, "much less efficient."
- `blurReductionFactor` (Android, default 4): "A number by which the blur intensity will be divided on Android."
- Multiple `BlurView`s on one target: "This is more efficient than creating multiple `BlurTargetViews`."
- `intensity` 1–100, animatable with Reanimated; `tint`: "Every tint adds a translucent color layer on top of the blur."
- Known issue: "The blur effect does not update when `BlurView` is rendered before dynamic content is rendered" (e.g. FlatList). `borderRadius` not applied; use `overflow: 'hidden'`.

## What it does not say

- No frame-time numbers for SDK 31+ devices, and nothing about the cost of animating content *under* a blur (each change re-blurs).
- The prop `experimentalBlurMethod` is not mentioned on this page; the changelog shows it was renamed to `blurMethod` in 55.0.0 (perf-expo-blur-changelog-sdk57.md).
- Nothing about blur inside a `captureRef` snapshot (whether view-shot captures the blurred RenderNode output).
