---
status: todo
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
