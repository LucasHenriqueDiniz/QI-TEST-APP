---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview
fetched: 2026-10-19
kind: primary
---

# Shared Element Transitions (overview) | React Native Reanimated

> Fetched 2026-10-19 · Maintainer doc, "Version: 4.x". Read to settle whether a "question card → result card" shared-element morph is viable for production.

Quotes extracted with WebFetch; short passages only.

## What it says

- "Shared Element Transitions is an experimental feature available behind a feature flag, not recommended for production use yet."
- "We are waiting for your feedback to improve the implementation."
- "Only the native stack is supported." (Tab navigator not yet.)
- "You can't define custom animation functions."
- Paraphrase of further limitations: transforms recalculated too eagerly (performance bottleneck); some props such as `backgroundColor` not supported in progress-based transitions; enabling the flag changes `zIndex` of views with exiting animations.
- Platforms: Android and iOS supported, Web not.

## What it does not say

- No timeline for production readiness.
- In 4.5.1 the flag `ENABLE_SHARED_ELEMENT_TRANSITIONS` also disables the Android synchronous props fast path (`shouldUseSynchronousUpdatesInPerformOperations()` returns false when it is on — installed source, local-react-native-reanimated.md). The doc does not mention that interaction.
