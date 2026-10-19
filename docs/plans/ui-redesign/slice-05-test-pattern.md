---
status: done
---

# Slice 05 — Test: pattern question without scroll

**Spec.** Research §5.3; DS-5 `FigureOption`.

**Delivers.** Matrix card at the SVG's native 1.49:1 (328×220 on the A15,
height clamped 140–220 from `onLayout` on shorter screens), options in a 2×2
grid of 167×107 cells holding the figure at its native 1.65:1, `FigureOption`
states on `paper`/`paperSelected` with a 3 dp ring and letter badge, zoom as an
icon-only button. The repeated title moves into the category line. A
`__DEV__`-only route param `/test?only=patterns` builds a round of the 30
pattern items so all of them can be checked.

**Needs.** Slices 01, 02.

**Tests.**
- `check_fit.py` on each of p01–p30 → 30/30 exit 0.
- Selected ring visible in both themes (screenshots).
- The dev param does nothing in a release bundle (`expo export` bundle does not
  contain the `only` branch, or the branch is behind `__DEV__`).

**Done when.** `python3 -I scripts/device/check_fit_round.py --only patterns`
prints `30/30 fit` (a loop of `check_fit.py` + answer, written in this slice).

**If stuck.** If some matrices are taller than 1.49:1, compute the aspect from
each SVG's `viewBox` instead of a constant.

**Result (2026-10-19).** Implemented by a Fable agent; the orchestrator re-ran
the round independently. `check_fit_round.py --only patterns`: 30/30 fit,
exit 0 (agent: light and dark; orchestrator: system theme, 0 failures). Before:
options 3–4 hidden on every pattern item. On the A15 the matrix is 304×204 dp
in a 222 dp card and the options are 163×89 dp cells (figure 122×74), computed
from the scroll viewport via `onLayout`; all 30 matrices are `viewBox 0 0 500
335` and all 120 options `0 0 173 105`. The instruction stays visible on one
32 dp line with the zoom button (the header had no room); letter badges sit
in a left column because the SVGs draw to their edges. New token `onPaper`
(ink on `paper` in both themes), four new contrast pairs, all passing. The
`__DEV__`-only round `testeqi://test?only=patterns` reads and writes no
progress or history; the release bundle drops the branch.

Known limits: `check_fit.py` flags text questions whose options wrap to
different line counts (documented in the harness README, rule not loosened);
the zoom modal is only ~8% larger than the inline matrix.
