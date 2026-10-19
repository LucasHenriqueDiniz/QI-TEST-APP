---
tags: [fetch, ui-redesign]
source: https://developer.android.com/about/versions/14/features
fetched: 2026-10-19
kind: primary
---

# Android 14 features — Non-linear font scaling to 200% (Android Developers)

> Fetched 2026-10-19 · Section of Google's Android 14 feature page on font scaling; read to set the constraint that the score, question text and answer options must survive 200% font size.

## What it says

> "Starting in Android 14, the system supports font scaling up to 200%, providing users with additional accessibility options."

> "To prevent large text elements on screen from scaling too large, the system applies a nonlinear scaling curve. This scaling strategy means that large text doesn't scale at the same rate as smaller text."

> "If you already use scaled pixels (sp) units to define text sizing, then these additional options and scaling improvements are applied automatically to the text in your app. However, you should still perform UI testing with the maximum font size enabled (200%) to ensure that your app applies the font sizes correctly and can accommodate larger font sizes without impacting usability."

> "[...] with nonlinear font scaling sp dimensions might not be proportional, so 4sp + 20sp might not equal 24sp."

> "Avoid hardcoding equations using Configuration.fontScale or DisplayMetrics.scaledDensity. Because font scaling is nonlinear, the scaledDensity field is no longer accurate."

> "Always define android:lineHeight using sp units instead [...]"

## What it does not say

- Nothing about text baked into bitmaps (the share card): it won't scale, which is acceptable for an exported image but not for on-screen UI.
- No guidance on large display-size headline numbers (e.g., a 96sp score) beyond the fact that large text scales less under the nonlinear curve.
