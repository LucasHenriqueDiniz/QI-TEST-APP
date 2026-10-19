---
tags: [fetch, ui-redesign]
source: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
fetched: 2026-10-19
kind: primary
---

# Understanding SC 1.4.11: Non-text Contrast (W3C WCAG 2.2)

> Fetched 2026-10-19 · W3C explanation of contrast for UI components and graphics; read for the bell curve, percentile marker, per-category bars, progress-bar track and selected-answer state.

## What it says

> "Ensure meaningful visual cues achieve 3:1 against the background."

> "The visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s): User Interface Components — Visual information required to identify user interface components and states, except for inactive components or where the appearance of the component is determined by the user agent and not modified by the author; Graphical Objects — Parts of graphics required to understand the content, except when a particular presentation of graphics is essential to the information being conveyed."

> "This success criterion does not require that changes in color that differentiate between states of an individual component meet the 3:1 contrast ratio when they do not appear next to each other. [...] However, the component must not lose contrast with the adjacent colors, and non-text indicators such as the check in a checkbox, or an arrow graphic indicating a menu is selected or open must have sufficient contrast to the adjacent colors."

> "The term "graphical object" applies to stand-alone icons such as a print icon (with no text), and the important parts of a more complex diagram such as each line in a graph."

> "Not every graphical object needs to contrast with its surroundings - only those that are required for a user to understand what the graphic is conveying."

> "Due to anti-aliasing, particularly thin lines and shapes of non-text elements may be rendered by user agents with a much fainter color than the actual color defined in the underlying CSS. [...] In these cases, best practice would be for authors to avoid particularly thin lines and shapes"

## What it does not say

- Selected vs. unselected answer options: the page explicitly does not require 3:1 between the two *states* of one component, but a non-colour indicator (check mark, border) must reach 3:1 against its adjacent colour — so selection should not be signalled by fill colour alone (inference consistent with the passage above).
- Nothing about animated graphics (a curve that fills over time); the requirement applies to the final rendered state.
