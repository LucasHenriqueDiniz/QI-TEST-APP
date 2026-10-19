---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/examples/slider
fetched: 2026-10-19
kind: primary
---

# Slider example | React Native Reanimated

> Fetched 2026-10-19 · Official Reanimated example that displays a changing number without React re-renders. Page shows no version label (metadata `datePublished: 2026-10-15`). Read because it is the only maintainer-published pattern found for "animated number text".

Quotes extracted with WebFetch; short passages only.

## What it says

- Paraphrase: the example uses `TextInput` instead of `Text` because `TextInput` has a `text` property that can be animated, whereas `Text` only has children.
- "Leveraging animated props allows us to run them on the UI thread instead of the JS thread." Paraphrase: also avoids re-renders while the displayed width changes.
- Rendered lines: `<AnimatedTextInput animatedProps={animatedProps} style={[textColor, styles.boxWidthText]}`

## What it does not say

- The fetched content did not include the `createAnimatedComponent(TextInput)` line or the body of `useAnimatedProps`, so the exact returned keys (`text`, `defaultValue`) are not confirmed from this page.
- Nothing about `editable={false}`, accessibility of a `TextInput` used as a label, or behaviour on the New Architecture.
- Nothing about cost: `text` is not in the Android fast-path prop set (local-react-native-reanimated.md), so each frame is a shadow-tree commit plus text re-measure.
