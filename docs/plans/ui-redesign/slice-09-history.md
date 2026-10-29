---
status: done
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

**Result (2026-10-29, A15, dev build).**

"Seu recorde" card (best score 56, tier, date) with a 120 dp chart of the last
10 (`components/ui/HistoryChart.tsx`: 6 dp points, the best ringed in
`accent`, the population mean dashed at 100 and labelled "média"; one test:
the point, the mean and "Faça outro teste para ver sua evolução"); Média ·
Testes · Tempo médio; 72 dp rows with the score badge (best ringed), date,
"N/M acertos · melhor que P%", the delta to the previous test (▲ in
`success`, ▼ in `textMuted`, never red) and a chevron that opens Results in
history mode; "Fazer novo teste" pinned above the banner (same mode as the
last test); empty state with the 3×3 and the same button.

| check | result |
|---|---|
| `scripts/device/check_history.py --seed 10` (new; writes N entries and puts the owner's storage back: 42 before and after) | `10/10 rows open`, each showing its score on Results and going back to History |
| seeded 0 / 1 / 2 / 10 | four screenshots |

Found on the way: at 96 dp (the empty state) the 3×3 broke into two columns
and its "?" fell on the title, because a third of the width was fractional
and the row overflowed; the tile is now a whole dp. The first version of the
script tapped a row cut at the list's bottom edge and started a test (2/10);
it now taps only rows wholly inside the list. No `__DEV__` seed hook in the
app: the script writes the storage.
