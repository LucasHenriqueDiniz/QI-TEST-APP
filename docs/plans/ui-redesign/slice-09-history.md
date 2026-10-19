---
status: todo
---

# Slice 09 — History

**Spec.** Research §5.8 (without the answer-review entry, D4).

**Delivers.** "Seu recorde" card with a line chart of the last ≤ 10 scores
(best point ringed in `accent`, dashed line at 100), metrics row, 72 dp rows
with score badge, date, accuracy, delta vs previous (never red), chevron →
Results in `mode=history`; "Fazer novo teste" pinned above the ad gap; empty
state. A `__DEV__`-only seed hook writes N fake history entries.

**Needs.** Slices 03 (history mode), 08.

**Tests.**
- Seeded 0 / 1 / 2 / 10 entries → screenshots of each state.
- 10/10 rows open their result in history mode with no interstitial.

**Done when.** `python3 -I scripts/device/check_history.py --seed 10` prints
`10/10 rows open` (written in this slice).

**If stuck.** If the chart is unreadable with one point, show only the point
and the "Faça outro teste para ver sua evolução" line, as the research says.
