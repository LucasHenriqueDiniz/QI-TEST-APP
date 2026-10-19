---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility
fetched: 2026-10-19
kind: primary
---

# Accessibility | React Native Reanimated

> Fetched 2026-10-19 · Maintainer doc on reduced motion, "Version: 4.x" (installed 4.5.1). Read to know how Reanimated behaves when the user disables animations, so the count-up/curve/confetti degrade correctly.

Quotes extracted with WebFetch; short passages only.

## What it says

- `ReduceMotion.System`: "This value adjusts the animation behavior based on whether the reduced motion accessibility setting is activated"
- `ReduceMotion.Always`: "the animation is consistently disabled, regardless of the device's accessibility configuration."
- `ReduceMotion.Never`: "This option ensures that the animation remains enabled at all times."
- Default: "By default all animations are configured with `ReduceMotion.System`."
- Heading "Reduced motion in animations": "`withSpring` and `withTiming` return the `toValue` immediately"; "`withDelay` initiates the next animation immediately"; repeated animations with infinite/even reps and reverse do not start; "`withSequence` exclusively starts animations that have reduced motion disabled".
- Heading "Reduced motion in Layout Animations": "entering, keyframe, and layout animations instantaneously reach their endpoints." and "exiting animations and shared transitions are omitted."
- `useReducedMotion`: "This hook returns a boolean indicating whether the reduced motion setting was enabled when the app started."
- Snippet: `const entering = BounceIn.reduceMotion(ReduceMotion.System);`

## What it does not say

- Does not name the Android setting. The installed source reads `Settings.Global.TRANSITION_ANIMATION_SCALE == 0` (local-react-native-reanimated.md).
- `ReducedMotionConfig` is exported by 4.5.1 but not described on this page.
- Does not say whether CSS animations/transitions (Reanimated 4 CSS API) respect reduced motion.
- `withRepeat` with infinite reps simply not starting means a looping "glow pulse" disappears entirely under reduced motion — fine, but the page does not discuss designing a static fallback.
