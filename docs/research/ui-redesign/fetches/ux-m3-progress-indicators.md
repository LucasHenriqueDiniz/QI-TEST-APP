---
tags: [fetch, ui-redesign]
source: https://m3.material.io/components/progress-indicators/guidelines
fetched: 2026-10-19
kind: primary
---

# Progress indicators — Guidelines (Material Design 3)

> Fetched 2026-10-19 · Google's M3 guideline for linear/circular progress indicators incl. the M3 Expressive wavy shape and the stop indicator; read to decide the in-test progress bar (30 questions) and the "calculating" moment. Read via the Browser pane.

## What it says

Wait-time table (cell text verbatim, table flattened to one line):

> "Instant (under 200ms) — No indicator / Short (between 200ms and 5s) — Loading indicator / Long (Over 5s) — Progress indicator"

Determinate vs indeterminate:

> "When using a determinate indicator, the indicator must accurately represent the progress of what it's measuring."

> "Use indeterminate indicators to show that a process is happening, but the wait time is unknown."

> "As more information about a process becomes available, a progress indicator should change from indeterminate to determinate."

Grouping:

> "When multiple items are loading, use a single progress indicator to show progress for the group. Don't add progress indicators to every activity."

Wavy shape (M3 Expressive):

> "The active indicator has two shape options: flat and wavy. Use the shape that best fits the product's tone."

> "The wavy shape can make longer processes feel less static and is best used when a more expressive style is appropriate."

> "When using the wavy shape, the overall height of the component changes. At very small sizes, the wavy shape may not be as visible."

Start state:

> "The active indicator appears as soon as progress begins. At low percentages where space is limited, this should appear as a dot to help people understand that there's progress underway."

Stop indicator and contrast:

> "The stop indicator is a 4dp circle that marks the end of a linear determinate progress indicator to meet Material's accessibility standards."

> "The stop indicator is required if the track has a contrast below 3:1 with its container or the surface behind the container."

> "Caution: Only remove the end stop indicator if there's a visual contrast of at least 3:1 with surrounding surfaces"

Placement and size:

> "Use a single progress indicator at the top of a page to show progress of the whole group."

> "Linear progress indicators dynamically adjust to fit the width of the window or element they're placed within, such as a card. They shouldn't be used in any elements smaller than 40dp."

> "Circular progress indicators have flexible sizes. They can range from 24dp to 240dp, depending on the placement and the breakpoint."

> "Linear progress indicators should be mirrored horizontally for products using right-to-left (RTL) languages."

## What it does not say

- Nothing about segmented / stepped progress bars (e.g. 3 blocks of 10 questions) — M3 has no segmented variant on this page; that pattern must come from elsewhere (see survey literature fetches).
- The page frames progress indicators as loading/process status, not as questionnaire position; it does not address motivation or breakoff.
- Does not identify which progress-indicator variant the research team found "made waiting time feel faster" (see `ux-m3-expressive-research.md`).
