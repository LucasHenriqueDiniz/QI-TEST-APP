---
status: done
---

# Slice 05.1 — options at the same scale as the matrix hole

**Found by.** The blind solve of the generated pattern items (2026-10-19,
`data/staging/patterns/blind-solve.json`): on the A15 the matrix hole is
~99 dp wide while each `FigureOption` draws the 173×105 option at ~122 dp, so
options are ~1.22× larger than the cell they fill. On items where size is the
rule, the option that looks the same size as the matrix cells is the wrong
one.

**Delivers.** `FigureOption` draws the option figure at the scale of the
matrix hole (option width = hole width as rendered in the matrix card), with
the spare cell space as padding, so a shape has the same on-screen size in the
matrix and in the options. The grid stays 2×2 and the round still fits.

**Needs.** Slice 05.

**Tests.**
- On p25–p30 and the generated items, the option figure width in dp equals the
  hole width in dp within 2 dp (measured from the layout, logged in `__DEV__`).
- `check_fit_round.py --only patterns` stays `N/N fit`.

**Done when.** A dev log line per pattern item prints `hole=<w> option=<w>`
with |Δ| ≤ 2 dp for every item, and the fit round passes.

**If stuck.** If matching the hole makes options too small to read on a
384 dp screen, scale the matrix up instead (it has ~16 dp of slack) rather
than letting the two scales diverge.

**Result (2026-10-29, A15).**

The holes are not one size. `scripts/patterns/measure-holes.py` draws every
SVG in headless Chrome (ImageMagick draws the Illustrator files' hidden
layers) and finds the tag-shaped outline: three families, now in
`assets/questions/patterns/geometry.ts`.

| items | hole (of 500) | option frame (of 173) | before: option vs hole |
|---|---|---|---|
| p1–p24 | 194.4 | 172.5 | ~3 dp smaller (the hole is wider than the option cell) |
| p25–p30 | 162.3 | 172.4 | +17 to +18 dp |
| p31–p54 | 163.0 | 169.7 | +16 dp |

`PatternQuestion` draws each option at `matrixWidth × holeScale(key)` inside
the unchanged cell; in p1–p24, where that would overflow the cell, the matrix
shrinks instead (~2.5%), as "If stuck" allows.

| check | result |
|---|---|
| `scripts/device/check_option_scale.py` (new): hole and option A's frame measured in a screenshot of each item, in dp | 54/54 within 2 dp, delta −1.1 to +0.4 (mean 0.5); without the change 0/54 (p25–p54 +16 to +18 dp; that run used the script's first version, whose thin-line reading was later fixed for p1–p18) |
| `tests/patternGeometry.test.ts` (new): every pattern item has a scale | pass; `npm test` 89 |
| `check_fit_round.py --only patterns` (the matrix shrank in p1–p24) | `54/54 fit` |

The "Done when" asked for a `__DEV__` log of both widths; it would have
printed the same formula twice, so the widths are measured on the screen
instead. The measuring script misread thin frames twice before it was right:
the frame's tip can be lighter than the threshold on the middle row (p17),
and p18's option A frame is wider than its viewBox, so its tip is cut with a
gap at the middle. It now reads the frame over ±20 dp around the middle.
