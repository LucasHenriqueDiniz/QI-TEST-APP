---
tags: [fetch, ui-redesign]
source: /Users/maxter/dev/pessoal/QI-TEST-APP/node_modules/react-native (package.json, Libraries/StyleSheet/StyleSheetTypes.d.ts, ReactAndroid/src/main/java/com/facebook/react/modules/accessibilityinfo/AccessibilityInfoModule.kt)
fetched: 2026-10-19
kind: primary
---

# react-native 0.86.3 (installed copy) — style props and reduce-motion detection

> Fetched 2026-10-19 · The installed RN (`"version": "0.86.3"`). Read because reactnative.dev now serves 0.87 docs; this confirms the gradient/shadow/filter style prop names and how Android "reduce motion" is detected in the version the app runs.

## What it says

### Style props — `Libraries/StyleSheet/StyleSheetTypes.d.ts` (verbatim)

```ts
  /**
   * Only supported on Android 5.0+, has no effect on earlier versions.
   *
   * @platform android
   */
  elevation?: number | undefined;
  ...
  boxShadow?: ReadonlyArray<BoxShadowValue> | string | undefined;
  filter?: ReadonlyArray<FilterFunction> | string | undefined;

  mixBlendMode?: BlendMode | undefined;
  experimental_backgroundImage?:
    | ReadonlyArray<BackgroundImageValue>
    | string
    | undefined;
```

In 0.86.3 the CSS-gradient prop is still `experimental_backgroundImage`; the 0.87 web doc documents it as `backgroundImage` (see perf-rn-view-style-props.md).

### Reduce motion on Android — `AccessibilityInfoModule.kt` (verbatim)

```kotlin
// Disabling animations in developer settings will set the animation scale to "0.0"
// but setting "reduce motion" / "disable animations" will set the animation scale to "0".
val rawValue =
    Settings.Global.getString(contentResolver, Settings.Global.TRANSITION_ANIMATION_SCALE)
...
val parsedValue = rawValue.replace(',', '.').toFloat()
return parsedValue == 0f
```

and a listener: "Listener that is notified when the global TRANSITION_ANIMATION_SCALE." — i.e. RN's `AccessibilityInfo.isReduceMotionEnabled()` / `reduceMotionChanged` react live, while Reanimated samples at startup (local-react-native-reanimated.md).

## What it does not say

- No performance note for `boxShadow`, `filter` or `experimental_backgroundImage` on Android.
- Does not say whether Samsung One UI's "Remove animations" (Accessibility > Visibility enhancements) writes `TRANSITION_ANIMATION_SCALE = 0`; the comment says "reduce motion / disable animations" does, generically.
- Animator duration scale between 0 and 1 (e.g. 0.5x) is not treated as reduced motion by either RN or Reanimated — only exactly `0`.
