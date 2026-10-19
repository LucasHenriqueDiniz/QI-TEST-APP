---
tags: [fetch, ui-redesign]
source: /Users/maxter/dev/pessoal/QI-TEST-APP/node_modules/react-native-reanimated (package.json, src/featureFlags/staticFlags.json, src/ConfigHelper.ts, src/ReducedMotion.ts, lib/typescript/index.d.ts, lib/typescript/commonTypes.d.ts, Common/cpp/reanimated/NativeModules/ReanimatedModuleProxy.cpp, android/src/main/java/com/swmansion/reanimated/NativeProxy.kt)
fetched: 2026-10-19
kind: primary
---

# react-native-reanimated 4.5.1 (installed copy)

> Fetched 2026-10-19 · Source of the exact Reanimated build the app ships (`"version": "4.5.1"`, worklets `0.10.1`). Read because the web docs are labelled "4.x" and already describe 4.6/4.7 flags; this settles what 4.5.1 actually does for feature-flag defaults, the Android fast path, reduced motion and the `text` prop allowlist.

## What it says

### Default static feature flags — `src/featureFlags/staticFlags.json` (verbatim)

```json
{
  "RUNTIME_TEST_FLAG": false,
  "DISABLE_COMMIT_PAUSING_MECHANISM": false,
  "ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS": false,
  "IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS": false,
  "EXPERIMENTAL_CSS_ANIMATIONS_FOR_SVG_COMPONENTS": true,
  "IOS_CSS_CORE_ANIMATION": false,
  "USE_SYNCHRONIZABLE_FOR_MUTABLES": true,
  "USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS": true,
  "ENABLE_SHARED_ELEMENT_TRANSITIONS": false,
  "FORCE_REACT_RENDER_FOR_SETTLED_ANIMATIONS": true,
  "USE_ANIMATION_BACKEND": false
}
```

Not present in 4.5.1 (documented on the web "4.x" page as later additions): `ANDROID_CSS_PLATFORM_TRANSITIONS` (4.6.0), `USE_LEGACY_LAYOUT_ANIMATIONS_PROXY` (4.7.0), `TRACK_SYNCHRONOUS_PROPS_IN_LAYOUT_ANIMATIONS` (4.7.0). The app's `package.json` has no `"reanimated"` key, so all defaults above apply (`ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS` is **off**).

### Which props take the Android fast path — `ReanimatedModuleProxy.cpp`

`shouldUseSynchronousUpdatesInPerformOperations()` returns `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS && !ENABLE_SHARED_ELEMENT_TRANSITIONS`. The allow-set (verbatim, abridged to the non-border entries):

```cpp
static const std::unordered_set<std::string> synchronousPropNames = {
    "opacity",
    "elevation",
    "zIndex",
    "shadowColor",
    ...
    "backgroundColor",
    // "color", // not supported
    "tintColor",
    "placeholderTextColor",
    "borderRadius", ... (all border radius / border colour variants)
    "outlineColor",
    "outlineOffset",
    "outlineWidth",
    "transform",
};
```

and: "The Android synchronous path serializes color props into an int buffer via `value.asInt()`, so non-numeric color values (e.g. PlatformColor) must fall back to the shadow tree commit path."

Anything not in that set — SVG props (`d`, `width`, `strokeDashoffset`, `fill`…), `TextInput` `text`, `width`/`height`/`top`/`left` — goes through the shadow-tree commit path every frame, flag or no flag.

### `text` prop allowlist — `src/ConfigHelper.ts` (verbatim)

```ts
/** @deprecated This function is a no-op in Reanimated 4. */
export function addWhitelistedNativeProps(
  _props: Record<string, boolean>
): void {
  // Do nothing. This is just for backward compatibility.
}
```

So the older blog advice "add `text` to the allowlist" does not apply to 4.5.1; there is no allowlist.

### Reduced motion

`lib/typescript/index.d.ts` exports `ReduceMotion`, `ReducedMotionConfig`, `useReducedMotion` and `export * from './css'`. `commonTypes.d.ts`:

```ts
export declare enum ReduceMotion {
    System = "system",
    Always = "always",
    Never = "never"
}
```

`src/ReducedMotion.ts` reads the value **once** at module load: `const IS_REDUCED_MOTION_ENABLED_IN_SYSTEM = isReducedMotionEnabledInSystem();` from `global._REANIMATED_IS_REDUCED_MOTION`.

Android source of that value — `NativeProxy.kt` (verbatim):

```kotlin
fun getIsReducedMotion(): Boolean {
    val mContentResolver: ContentResolver = mContext.get()!!.contentResolver
    val rawValue =
        Settings.Global.getString(
            mContentResolver,
            Settings.Global.TRANSITION_ANIMATION_SCALE,
        )
    val parsedValue = if (rawValue != null) rawValue.toFloat() else 1f
    return parsedValue == 0f
}
```

## What it does not say

- No measured cost per shadow-tree commit on a low-end device; the code only shows which path a prop takes.
- Whether animating `TextInput.text` through `useAnimatedProps` actually updates the native text on Fabric/Android in 4.5.1 — the code routes it to the shadow-tree path, but I did not run it.
- `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS` is off by default; turning it on needs a `package.json` `"reanimated": { "staticFeatureFlags": … }` entry and a native rebuild (see perf-reanimated-feature-flags.md). Its effect on this app is unmeasured.
- Reduced motion is sampled at app start (`useReducedMotion` "when the app started"), so toggling "Remove animations" while the app runs is not picked up by Reanimated until restart.
