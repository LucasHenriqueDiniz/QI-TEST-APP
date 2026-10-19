---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedProps
fetched: 2026-10-19
kind: primary
---

# useAnimatedProps | React Native Reanimated

> Fetched 2026-10-19 · API reference, "Version: 4.x". Read to confirm how SVG props and `TextInput.text` are meant to be animated.

Quotes extracted with WebFetch; short passages only.

## What it says

- "This object is used to animate properties of third-party components."
- For react-native-svg it points to the "Animating SVG" guide (perf-reanimated-animating-svg.md); the page itself has no SVG code.
- Adapters: "Adapters make it possible to handle these cases by defining a way to convert these props before they reach the native side."
- "We recommend to create adapters outside of the component's body to avoid unnecessary recalculations."
- "You can share animated props between components to avoid code duplication."

## What it does not say

- Nothing about animating text or the `TextInput` `text` prop.
- No performance figures; nothing about which props skip the shadow-tree commit.
