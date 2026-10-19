---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/advanced/setNativeProps
fetched: 2026-10-19
kind: primary
---

# setNativeProps | React Native Reanimated

> Fetched 2026-10-19 · Maintainer reference, "Version: 4.x". Read as the imperative alternative for updating a `TextInput`'s `text` from a worklet.

Quotes extracted with WebFetch; short passages only.

## What it says

- "`setNativeProps` is an escape hatch for specific edge-cases."
- "You should always reach for useAnimatedStyle and useAnimatedProps first when animating styles or properties."
- "`setNativeProps` is supposed to only be used on the UI thread."
- Example (paraphrase): `setNativeProps(animatedRef, { text: '' })` inside a tap gesture `onEnd`; outside gesture handlers wrap it in `runOnUI`.

## What it does not say

- Nothing about the New Architecture, cost per call, or using it every frame for a count-up.
