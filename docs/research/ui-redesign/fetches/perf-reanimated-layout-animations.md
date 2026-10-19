---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations
fetched: 2026-10-19
kind: primary
---

# Entering/Exiting animations | React Native Reanimated

> Fetched 2026-10-19 · Maintainer reference for layout animations, "Version: 4.x" (some features marked "from 4.4.0"; installed 4.5.1). Read for cost and caveats of entering/exiting animations on the result screen.

Quotes extracted with WebFetch; short passages only.

## What it says

- "We recommend using layout animation builders outside of components or with `useMemo` to ensure the best performance."
- `.reduceMotion(reduceMotion: ReduceMotion)` on all presets: "determines how the animation responds to the device's reduced motion accessibility setting."
- New Architecture: "`nativeID` is used internally to configure entering animations" — overwriting `nativeID` (e.g. by `TouchableWithoutFeedback` on its children) stops entering animations; wrap animated children in a `View` (paraphrase).
- Removing a non-animated parent triggers children's exiting animations but the parent does not wait; `collapsable={false}` suggested (paraphrase).
- "The `transform: [{ ... }]` tuple form still works but is deprecated since 4.4.0." (flat transform props preferred).

## What it does not say

- No cost figures for layout animations, no Android-specific remarks, nothing about FlatList or react-native-screens interaction.
