---
status: done
---

# Slice 03b — Results: band, indices, speed

**Spec.** `docs/research/scoring-modes/README.md` (band display, index rules,
speed reporting); decisions D6, D7. Builds on slice 03's data-driven hero and
profile.

**Delivers.** The hero shows "QI estimado N · faixa A–B" from the stored band;
in Detalhado, the profile shows Verbal and Raciocínio index scores (each with
its own band) above the per-category bars; when a speed task was taken, a
"Velocidade (experimental)" row with the count and a one-line explanation that
it is not part of the main score. Legacy entries (no band) render as today.
The share text and, after slice 04, the share image carry the band. Strings in
pt, en and es.

**Needs.** Slices 03, 05b, 05c (and 04 for the image).

**Tests.**
- Seeded entries for each mode (dev seed hook) render without overflow:
  `check_fit.py --require "Compartilhar resultado"` exits 0 for Rápido, Normal,
  Detalhado and a legacy entry.
- The band printed equals the stored band (read back via `run-as` from
  AsyncStorage, or a dev log line).

**Done when.** The four seeded Results pass `check_fit.py`, and a script
compares the on-screen band with the stored one: `4/4 match`.

**If stuck.** If the band does not fit on one line at 130% font scale, move it
under the score as its own line rather than shrinking the score.

**Result (2026-10-29, A15, dev build).**

The hero's "± N" (half the band) became "Faixa provável: A–B" under the
score, the stored band itself; the overline already reads "Seu QI estimado".
In Detalhado the profile card opens with Raciocínio and Verbal, each score
with its band; with `speed`, a "Velocidade (experimental)" card shows the
score, the counts and that it stays out of the IQ. The share text carries
the band when there is one. Slice 04 will put it on the image.

| check | result |
|---|---|
| `scripts/device/check_results_band.py` (new): Results opened by link (`mode=history`, nothing saved) with a Rápido, a Normal + speed, a Detalhado + indices + speed and a legacy entry; band on screen vs stored, indices and speed shown, "Compartilhar resultado" on the first screen | `4/4 match` |
| red: the same four on the old Results | `1/4 match` (only legacy, which shows no band either way) |

The tests named a dev seed hook; a link with the entry as JSON opens the same
screen without writing anything, so no hook was added.
