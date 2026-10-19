---
tags: [fetch, ui-redesign]
source: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
fetched: 2026-10-19
kind: primary
---

# Understanding SC 1.4.3: Contrast (Minimum) (W3C WCAG 2.2)

> Fetched 2026-10-19 · The W3C standard's explanation of text-contrast thresholds; read to set the bar for score text, labels and share-card text placed on coloured/gradient surfaces.

## What it says

> "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following: Large Text — Large-scale text and images of large-scale text have a contrast ratio of at least 3:1; Incidental — Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement. Logotypes — Text that is part of a logo or brand name has no contrast requirement."

> "18 point text or 14 point bold text is judged to be large enough to require a lower contrast ratio."

> "The 3:1 and 4.5:1 contrast ratios referenced in this success criterion are intended to be treated as threshold values. When comparing the computed contrast ratio to the Success Criterion ratio, the computed values should not be rounded (e.g., 4.499:1 would not meet the 4.5:1 threshold)."

> "Due to anti-aliasing, particularly thin or unusual fonts may be rendered by user agents with a much fainter color than the actual text color defined in the underlying CSS. This can lead to situations where text has a contrast ratio that nominally passes the Success Criterion, but has a much lower contrast in practice. In these cases, best practice would be for authors to choose a font with stronger/thicker lines"

> "The contrast requirements for text also apply to images of text"

Listed failure technique:

> "F83: Failure of Success Criterion 1.4.3 and 1.4.6 due to using background images that do not provide sufficient contrast with foreground text (or images of text)"

## What it does not say

- No explicit method for gradients on this page; the F83 failure for background images implies the ratio must hold against every part of the background behind the text (i.e., the worst-case stop of a gradient) — that reading is an inference.
- Points (pt) are a web/print unit; the Android equivalents (18sp / 14sp bold) come from `ux-android-accessibility-basics.md`.
- A share-card PNG is an "image of text": the same 4.5:1 / 3:1 applies to the score and labels baked into it.
