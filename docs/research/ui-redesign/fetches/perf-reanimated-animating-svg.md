---
tags: [fetch, ui-redesign]
source: https://docs.swmansion.com/react-native-reanimated/docs/guides/animating-svg/
fetched: 2026-10-19
kind: primary
---

# Animating SVG | React Native Reanimated

> Fetched 2026-10-19 · Maintainer guide for animating react-native-svg with Reanimated, "Version: 4.x" (installed Reanimated 4.5.1, react-native-svg 15.15.4). Read to choose how to animate the bell-curve fill.

Quotes extracted with WebFetch; short passages only.

## What it says

- Three ways: inline shared value, `useAnimatedProps`, or CSS `animationName`/`transitionProperty` inside `animatedProps`.
- "SVG attributes like `cx`, `r`, `d`, and `fill` are **component props**, not React Native `style` keys."
- "CSS animations and transitions for SVG are an experimental feature, enabled by default from Reanimated 4.4." (opt out with `EXPERIMENTAL_CSS_ANIMATIONS_FOR_SVG_COMPONENTS`; 4.5.1 default is `true`).
- Setup: `const AnimatedCircle = Animated.createAnimatedComponent(Circle);`
- Appearance props animatable on every component include `fill`, `stroke`, `strokeDasharray`, `strokeDashoffset`, `opacity`, `clipPath`, `mask`, `filter`, `marker` (paraphrase of a list).
- Geometry per component (paraphrase): `Rect` → `x, y, width, height, rx, ry`; `Path` → `d`; `Circle` → `cx, cy, r`; `LinearGradient`/`RadialGradient` → coordinates and `gradient`.
- `G`, `Defs`, `ClipPath`, `Mask` have no animatable geometry (paraphrase).
- Key code lines: `const animatedProps = useAnimatedProps(() => ({ r: r.value, }));`; path morph `animationName: { from: { d: CIRCLE }, to: { d: STAR } },`
- Limitations (selection): CSS transitions do not fire for shared values — "updating `r.value` doesn't re-render, so it never starts a transition."; the first render never transitions; `RadialGradient` `fx`/`fy` animate on iOS only; stepped props (`strokeLinecap`, `fillRule`…) jump; web `Path` `d` morph needs matching command structure.

## What it does not say

- No performance section: nothing about cost per animated SVG node, how many nodes are OK, or the cost of morphing a long `d` string every frame.
- No example using `strokeDashoffset` or animating a `ClipPath` child `Rect` — both are listed as supported but not demonstrated.
- Does not say that SVG props bypass the Android synchronous fast path (they do — installed source, local-react-native-reanimated.md).
