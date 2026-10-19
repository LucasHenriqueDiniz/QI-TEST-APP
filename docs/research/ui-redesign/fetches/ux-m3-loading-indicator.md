---
tags: [fetch, ui-redesign]
source: https://m3.material.io/components/loading-indicator/guidelines
fetched: 2026-10-19
kind: primary
---

# Loading indicator — Guidelines (Material Design 3)

> Fetched 2026-10-19 · Google's M3 Expressive "loading indicator" (shape-morph) guideline; read as a candidate component for the finish/"calculating your result" interstitial. Read via the Browser pane.

## What it says

> "Loading indicators use animation to grab attention, mitigate perceived latency, and indicate that an activity is in progress."

> "They should be used when progress isn't detectable, or when it's not necessary to indicate how long an activity will take."

> "While similar in function to circular progress indicators, loading indicators are a better alternative for short processes between 200ms and 5s."

> "Don't transition a loading indicator into a progress indicator." / "Avoid transitioning from a loading indicator to a determinate progress indicator"

> "The active indicator is a looping shape morph sequence composed of seven unique Material 3 shapes."

> "When the container is visible, the active indicator should change color from primary to on-primary-container."

> "Loading indicators default to 48dp, but the size is flexible. It should be between 24dp to 240dp, depending on the placement and the breakpoint."

## What it does not say

- Nothing about *artificial* waits (showing an indicator when the computation is instant). The guideline assumes a real process; for an intentional "calculating" pause the justification has to come from the labor-illusion literature (`ux-labor-illusion-buell-norton.md`), and this page's own table says sub-200ms work should show "No indicator".
- No guidance on pairing the indicator with step-by-step status text.
