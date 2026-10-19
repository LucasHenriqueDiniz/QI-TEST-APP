---
tags: [fetch, ui-redesign]
source: https://developer.android.com/guide/topics/ui/accessibility/apps
fetched: 2026-10-19
kind: primary
---

# Make apps more accessible (Android Developers)

> Fetched 2026-10-19 · Google's baseline Android accessibility guidance; read for the text-contrast thresholds in sp and the 48dp touch-target minimum (answer options, share/retake buttons).

## What it says

> "If the text is smaller than 18sp, or if the text is bold and smaller than 14sp, use foreground and background colors that result in a color contrast ratio of at least 4.5:1. / For all other text, set the color contrast ratio to at least 3:1."

> "To check the text-to-background color contrast in your app, use an online color contrast checker or the Accessibility Scanner app."

> "For touch interfaces, we recommend that each interactive UI element have a focusable area, or touch target size, of at least 48dpx48dp. Larger is even better."

> "In Jetpack Compose, many built-in Material components like Button, IconButton, and ListItem already enforce this minimum size. However, when creating custom interactive elements, you need to set the size yourself."

> "Use descriptions to convey the purpose and result of the interaction, not the visual details. Use the Role semantics property (like Role.Button or Role.Switch) to expose a UI element's type."

> "Use the hideFromAccessibility API to mark purely decorative elements so that accessibility services can ignore them."

## What it does not say

- Nothing about charts (bell curve, per-category bars) and how to expose them to TalkBack; the redesign needs a text equivalent (e.g., "Percentile 84 — better than 84 of 100 people") as an inference, not stated here.
- No guidance on animations / reduced motion on this page (NN/g covers it in `ux-nng-animation-duration.md`).
