---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/guides/performance
fetched: 2026-10-19
kind: primary
---

# Performance | React Native Reanimated

> Fetched 2026-10-19 · Maintainer's performance guide for Reanimated, page labelled "Version: 4.x" (installed: 4.5.1). Read for the component budget on low-end Android, the fast path for non-layout props, and New Architecture regressions.

Quotes below were extracted with WebFetch (the tool refused full verbatim reproduction, so only short passages are quoted; the rest is paraphrase and marked as such).

## What it says

- Component budget, heading "Avoid animating too many components at once": "you should animate no more than 100 components for low-end Android devices and no more than 500 components for iOS." Paraphrase: for more complex scenes it suggests Reanimated together with `react-native-skia`.
- Heading "Prefer animating non-layout properties": "Animating non-layout properties (like `transform`, `opacity` or `backgroundColor`) is generally more performant". Reason given: layout props "requires an additional step of layout recalculation on each animation frame." Paraphrase: prefer `translateX/translateY` over `top/left`.
- Heading "Low FPS when running multiple animations at once" — paraphrase: fix 1 is enabling `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS` (from 4.0.0) / `IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS` (from 4.2.0); fix 2 is React Native's experimental `enableCppPropsIteratorSetter`, which requires building RN from source.
- About the Android flag: "This will enable a fast code path for applying updates of non-layout styles like `opacity` or `transform`". Paraphrase of the caveat: these flags affect touch detection on components with animated transforms; the page suggests `Pressable` from react-native-gesture-handler instead of RN's.
- Heading "Lower FPS while scrolling": "**Problem:** FPS drops when there are many animated components on the screen during scrolling." Fix: RN ≥ 0.80 + Reanimated ≥ 4.2.0 + `USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS` (already default `true` in 4.5.1, see local-react-native-reanimated.md).
- Heading "Flickering/jittering while scrolling": requires RN ≥ 0.81, `preventShadowTreeCommitExhaustion` and `DISABLE_COMMIT_PAUSING_MECHANISM`.
- Heading "Debug vs. release mode": "It is very likely that the performance regressions are noticeable only in the development build of your app." Paraphrase: release builds compile Reanimated and RN with optimizations; on Android use the `debugOptimized` variant (RN 0.82+) for a closer-to-real dev experience.
- Memoization: "you should wrap the frame callback worklet inside `useCallback` in order to memoize it." and gesture objects in `useMemo`.

## What it does not say

- No numbers for a specific device class (e.g. Helio G99); "low-end Android" is not defined.
- Does not mention `useAnimatedProps` or SVG at all — no guidance on the cost of animating SVG props per frame.
- Does not quantify the cost of layout animations (entering/exiting).
- Does not say whether `TextInput` `text` or SVG props are covered by the fast path; the installed source shows they are not (local-react-native-reanimated.md).
