---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/css-animations/animation-name
fetched: 2026-10-19
kind: primary
---

# animationName (CSS animations) | React Native Reanimated

> Fetched 2026-10-19 · Reference for Reanimated 4's CSS-style keyframe animations, "Version: 4.x". Read to see whether declarative CSS animations are a cheap option for glow pulses / entrance effects and for SVG.

Quotes extracted with WebFetch; short passages only.

## What it says

- "`animationName` lets you specify keyframes for the animation." Keyframes inline or as a variable.
- "Reanimated will take the current state of the element as the first keyframe."
- Multiple animations on the same property: "the animation later in the array will override changes from the previous one."
- SVG: "You can animate react-native-svg components too." (links to the Animating SVG guide).
- Platforms listed: Android, iOS, Web.

## What it does not say

- Does not say which thread CSS animations run on or what they cost compared with `useAnimatedStyle`.
- No list of supported properties on this page; no performance guidance.
- Does not say whether CSS animations honour reduced motion.
