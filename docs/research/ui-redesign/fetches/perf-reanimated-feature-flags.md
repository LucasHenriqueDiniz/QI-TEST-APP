---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags
fetched: 2026-10-19
kind: primary
---

# Feature flags | React Native Reanimated

> Fetched 2026-10-19 · Maintainer list of static/dynamic flags, "Version: 4.x". The page documents flags up to 4.7.0; the app runs 4.5.1, so later flags do not exist here (checked against local-react-native-reanimated.md).

Quotes extracted with WebFetch; short passages only.

## What it says

| flag | default (doc) | added | relevant note |
|---|---|---|---|
| `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS` | false | 4.0.0 | "This feature flag works only on Android and has no effect on iOS." |
| `USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS` | true from 4.3.0 | 4.2.0 | "This feature flag is supposed to fix performance regressions of animations while scrolling." |
| `DISABLE_COMMIT_PAUSING_MECHANISM` | false | 4.0.0 | "In all other cases it can lead to unresponsiveness of the app due to the starvation of React commits." |
| `EXPERIMENTAL_CSS_ANIMATIONS_FOR_SVG_COMPONENTS` | true from 4.4.0 | 4.1.0 | CSS animations/transitions for some react-native-svg components |
| `ENABLE_SHARED_ELEMENT_TRANSITIONS` | false | 4.2.0 | paraphrase: not production ready |
| `USE_ANIMATION_BACKEND` | false | 4.4.0 | experimental |
| `ANDROID_CSS_PLATFORM_TRANSITIONS` | false | 4.6.0 | **not in 4.5.1** |
| `USE_LEGACY_LAYOUT_ANIMATIONS_PROXY` | false | 4.7.0 | **not in 4.5.1** |

Enabling (paraphrase): add the flag under `package.json` → `"reanimated"` → `"staticFeatureFlags"`, then rebuild — "Rebuild the native app." Static flags cannot change at runtime and are not supported in prebuilt setups like Expo Go.

## What it does not say

- No measurement of how much `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS` helps, or on which devices.
- Does not list which props the fast path covers (the installed C++ does: `opacity`, `transform`, `backgroundColor`, border colours/radii, `elevation`, `zIndex`… — not SVG props, not `text`).
- The page has an internal inconsistency on when `USE_SYNCHRONIZABLE_FOR_MUTABLES` was removed (4.6.0 vs 4.7.0); irrelevant for 4.5.1 where it is still `true`.
