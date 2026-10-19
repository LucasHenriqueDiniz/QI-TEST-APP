---
tags: [fetch, ui-redesign]
source: https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt
fetched: 2026-10-19
kind: primary
---

# ExpressiveMotionTokens.kt and StandardMotionTokens.kt (androidx Compose Material 3 source)

> Fetched 2026-10-19 · The generated token files behind M3's motion physics schemes, read because the M3 spec page (`ux-m3-motion-physics.md`) names the spring tokens but its rendered text did not include the numbers. These are the values Compose ships. Second file: https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt

## What it says

`ExpressiveMotionTokens.kt` (header: `// VERSION: v0_14_0`, `// GENERATED CODE - DO NOT MODIFY BY HAND`), verbatim:

```kotlin
internal object ExpressiveMotionTokens {
    const val SpringDefaultSpatialDamping = 0.8f
    const val SpringDefaultSpatialStiffness = 380.0f
    const val SpringDefaultEffectsDamping = 1.0f
    const val SpringDefaultEffectsStiffness = 1600.0f
    const val SpringFastSpatialDamping = 0.6f
    const val SpringFastSpatialStiffness = 800.0f
    const val SpringFastEffectsDamping = 1.0f
    const val SpringFastEffectsStiffness = 3800.0f
    const val SpringSlowSpatialDamping = 0.8f
    const val SpringSlowSpatialStiffness = 200.0f
    const val SpringSlowEffectsDamping = 1.0f
    const val SpringSlowEffectsStiffness = 800.0f
}
```

`StandardMotionTokens.kt` (same header), verbatim:

```kotlin
internal object StandardMotionTokens {
    const val SpringDefaultSpatialDamping = 0.9f
    const val SpringDefaultSpatialStiffness = 700.0f
    const val SpringDefaultEffectsDamping = 1.0f
    const val SpringDefaultEffectsStiffness = 1600.0f
    const val SpringFastSpatialDamping = 0.9f
    const val SpringFastSpatialStiffness = 1400.0f
    const val SpringFastEffectsDamping = 1.0f
    const val SpringFastEffectsStiffness = 3800.0f
    const val SpringSlowSpatialDamping = 0.9f
    const val SpringSlowSpatialStiffness = 300.0f
    const val SpringSlowEffectsDamping = 1.0f
    const val SpringSlowEffectsStiffness = 800.0f
}
```

## Conversion to Reanimated (computed by the researcher, not stated by the source)

Compose's `spring(dampingRatio, stiffness)` uses unit mass. Reanimated's physics config is `{ mass, stiffness, damping }` where `damping` is the coefficient, so `damping = 2 · dampingRatio · √(stiffness · mass)`. With `mass: 1`:

| token (expressive) | dampingRatio | stiffness | Reanimated `damping` |
|---|---|---|---|
| fastSpatial | 0.6 | 800 | 33.9 |
| defaultSpatial | 0.8 | 380 | 31.2 |
| slowSpatial | 0.8 | 200 | 22.6 |
| fastEffects | 1.0 | 3800 | 123.3 |
| defaultEffects | 1.0 | 1600 | 80.0 |
| slowEffects | 1.0 | 800 | 56.6 |

For comparison, the app's current `motion.spring` (`damping 18, stiffness 220, mass 0.9`) has dampingRatio ≈ 0.64 and natural frequency ≈ 15.6 rad/s, against 28.3 rad/s for expressive fastSpatial: a similar bounce, about 1.8x slower.

## What it does not say

- The files are from `androidx-main` (token version v0_14_0); the values could differ in a given Compose release. They are design tokens, not something this React Native app consumes, so "the version the repo runs" does not apply; they are a reference for the feel.
- Nothing about reduced-motion handling; that is the app's job (Reanimated `ReduceMotion`).
