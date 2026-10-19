---
tags: [fetch, ui-redesign]
source: https://github.com/software-mansion/react-native-svg
fetched: 2026-10-19
kind: primary
---

# react-native-svg — README

> Fetched 2026-10-19 · Maintainer README on `main` (installed 15.15.4). Read for compatibility and any performance guidance when animating SVG.

Quotes extracted with WebFetch; short passages only.

## What it says

- Compatibility table (flattened in fetch): react-native-svg ">=15.13.0" pairs with react-native ">=0.78.0" — covers 15.15.4 + RN 0.86.3.
- "Fabric is supported only for react-native 0.69.0+."
- Only known issue listed: RadialGradient focus point cannot be applied on Android.

## What it does not say

- No performance notes at all; nothing about animating props, many nodes, or path morphing.
- Two WebSearch passes for GitHub issues on Android SVG animation performance ("many paths", "useAnimatedProps d") found no current, version-relevant issue; results were 2017–2020 reports (e.g. Callstack measuring ~36 ms to render one ~197 KB SVG on Android in DevTools; a 2017 post saying SVGs "can take up to 90ms to render"). Those are secondary and pre-New-Architecture, not quoted as evidence for 15.15.4.
