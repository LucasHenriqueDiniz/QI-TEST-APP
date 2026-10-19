---
tags: [fetch, ui-redesign]
source: https://raw.githubusercontent.com/expo/expo/sdk-57/packages/expo-blur/CHANGELOG.md
fetched: 2026-10-19
kind: primary
---

# expo-blur CHANGELOG (sdk-57 branch)

> Fetched 2026-10-19 · Maintainer changelog on the `sdk-57` branch. Read to trace `experimentalBlurMethod` → `blurMethod`, the `BlurTargetView` requirement, and Android fixes that matter to this app (gesture handler, Fabric).

Quotes extracted with WebFetch; short passages only.

## What it says

- 12.8.0 (2023-10-17): "Made `BlurView` on Android an experimental feature, which can be enabled with `experimentalBlurMethod` prop."
- 15.0.0 (2025-08-13): "[Android] Fix transition issues with `react-native-screens` when using `dimezisBlurView` blur method."
- 55.0.0 (2026-01-21): "[Android] Rename the `experimentalBlurMethod` prop to `blurMethod`."
- 55.0.0: "[Android] The `dimezisBlurView` experimental blur method will no longer work without creating a related `BlurTargetView`."
- 55.0.0: "[Android] Introduce `dimezisBlurViewSdk31Plus` blur method." and "[Android] Introduce new, more performant Blur API for Android."
- 55.0.9 (2026-03-11): "[Android] Fix Fabric mount/detach mismatch in `BlurTargetView` that could trigger" (truncated in fetch).
- 57.0.1 (2026-07-15): "[Android] Fix gesture handlers treating views under a `BlurTargetView` as detached and cancelling their gestures."

## What it does not say

- No performance numbers for the "more performant Blur API".
- The 57.0.1 gesture fix shows `BlurTargetView` interacted badly with gesture handling until July 2026 — a sign the Android path is still young; no statement that it is now bug-free.
