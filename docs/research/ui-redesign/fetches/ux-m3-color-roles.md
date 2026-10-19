---
tags: [fetch, ui-redesign]
source: https://m3.material.io/styles/color/roles
fetched: 2026-10-19
kind: primary
---

# Color roles (Material Design 3)

> Fetched 2026-10-19 · Google's M3 colour-role spec; read to constrain dark/light theming, dynamic colour, and which roles may carry text on the hero/result surfaces. Read via the Browser pane.

## What it says

> "There are 26 standard color roles organized into six groups: primary, secondary, tertiary, error, surface, and outline"

> "Color roles ensure accessibility — The color system is built on accessible color pairings. These color pairs provide an accessible minimum 3:1 contrast."

> "Container – Roles used as a fill color for foreground elements like buttons. They should not be used for text or icons."

> "On – Roles starting with this term indicate a color for text or icons on top of its paired parent color. For example, on primary is used for text and icons against the primary fill color."

> "To ensure accessible visual contrast in your app, apply colors only in the intended pairs or layering orders described in the following sections."

> "Combining colors improperly may break contrast necessary for visual accessibility, particularly when colors are adjusted through dynamic color features such as user-controlled contrast."

> "Primary roles are for important actions and elements needing the most emphasis, like a FAB to start a new message."

> "Tertiary roles are for smaller elements that need special emphasis but don't require immediate attention, such as a badge or notification."

> "Use tertiary roles for contrasting accents that balance primary and secondary colors or bring heightened attention to an element such as an input field."

> "Error is an example of a static color (it doesn't change even in dynamic color schemes). Error color roles are made static by default with any dynamic color scheme. They still adapt to light and dark theme."

> "Outline variant: Decorative elements, such as dividers, and when other elements provide 4.5:1 contrast"

> "Don't use the outline variant color to create visual hierarchy or define the visual boundary of targets. Instead, use the outline color or another color providing 3:1 contrast with the surface color."

> "Fixed colors don't change based on light or dark theme, so they're likely to cause contrast issues. Avoid using them where contrast is necessary."

> "While the default surface color automatically inverts between light and dark themes [...] the surface bright and surface dim colors invert in a slightly different way. More precisely, they keep their relative brightness across both light and dark theme."

## What it does not say

- Nothing about text over gradients or images: M3 roles are solid-fill pairings. A gradient hero (e.g., behind the IQ score) is outside the role system, so contrast must be checked at the worst point of the gradient against WCAG (`ux-wcag-contrast-minimum.md`).
- The "minimum 3:1" pairing guarantee is below WCAG AA 4.5:1 for normal-size text; the page does not say which pairs reach 4.5:1.
- No guidance on data-visualisation colours (bell curve, category bars) — covered only by WCAG non-text contrast (`ux-wcag-non-text-contrast.md`).
