---
tags: [fetch, ui-redesign]
source: /Users/maxter/dev/pessoal/QI-TEST-APP/node_modules/react-native-reanimated/lib/typescript/animation/spring/springConfigs.d.ts
fetched: 2026-10-19
kind: primary
---

# Reanimated 4.5.1 `SpringConfig` (installed type definitions)

> Fetched 2026-10-19 · The installed Reanimated's own spring config docs, read to translate the M3 Expressive spring tokens (`ux-m3-motion-tokens-source.md`) into `withSpring` configs that behave the same on this exact version.

## What it says

Defaults declared in the installed build (verbatim):

```ts
export declare const Reanimated3DefaultSpringConfig: {
    readonly damping: 10;
    readonly mass: 1;
    readonly stiffness: 100;
};
```

JSDoc of `SpringConfig` (verbatim excerpts):

> "@param mass - The weight of the spring. Reducing this value makes the animation faster. Defaults to 4."

> "@param damping - How quickly a spring slows down. Higher damping means the spring will come to rest faster. Defaults to 120."

> "@param stiffness - How bouncy the spring is. Defaults to 900."

> "@param duration - Perceptual duration of the animation in milliseconds. Actual duration is 1.5 times the value of perceptual duration. Defaults to 550ms if `dampingRatio` is provided."

> "@param dampingRatio - How damped the spring is. Value `1` means the spring is critically damped, value `<1` means the spring is underdamped and value `>1` means the spring is overdamped. Defaults to 1 if `duration` is provided."

> "@param reduceMotion - Determines how the animation responds to the device's reduced motion accessibility setting. Default to `ReduceMotion.System`"

The type makes `{ stiffness, damping }` and `{ duration, dampingRatio }` mutually exclusive (`MutuallyExclusiveUnion`).

## Consequence for the redesign (researcher's inference)

- In 4.5.1 the default `mass` is **4**, not 1. A config written as `{ stiffness: 800, damping: 33.9 }` without `mass: 1` is a different, slower spring. Every motion token must set `mass: 1` explicitly to match the M3 numbers.
- `dampingRatio` cannot be combined with `stiffness`; use the physics triple (`mass`, `stiffness`, `damping`) computed as `damping = 2·ζ·√(k·m)`.
- `reduceMotion` defaults to `ReduceMotion.System`, so springs already honour the OS "remove animations" setting unless overridden.

## What it does not say

- Nothing about performance on low-end devices; see the `perf-*` fetches.
