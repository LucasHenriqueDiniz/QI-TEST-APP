---
status: done
---

# Slice 05e — bank: 24 pattern items (120 SVGs) from a generator

**Spec.** The bank-expansion table of `docs/research/scoring-modes/README.md`
(+16 medium, +8 hard pattern items); decision D8. The 30 existing items in
`assets/questions/patterns/` set the visual style: black strokes on a white
field, prompt `viewBox 0 0 500 335` with a missing cell, options
`viewBox 0 0 173 105`.

**Delivers.** A deterministic generator (`scripts/patterns/generate.mjs` or
`.py`) that builds a matrix puzzle from an explicit rule set (e.g. count
progression, rotation, shading, overlay/XOR, distribution of three), writes
the prompt SVG and four option SVGs, and records the correct option and the
rule. Distractors are built by breaking exactly one rule each, so the right
answer is unique by construction. 24 items committed with their metadata.

**Needs.** Nothing on the device for generation; slice 05's FigureOption and
the dev pattern round for the device check.

**Tests.**
- **Uniqueness by construction.** A unit test regenerates every item from its
  seed and asserts exactly one option satisfies all rules.
- **Blind solve.** A second agent shown the rendered PNGs (no key, no rule)
  answers each item; 24/24 agree, or the item is replaced.
- **Style.** A contact sheet (all 24 prompts and options, rendered to one PNG)
  goes to the owner before merge.
- **Fit.** The dev pattern round with the new items: `check_fit_round.py
  --only patterns` → `54/54 fit`.

**Done when.** The generator's test passes, the blind solve says 24/24, and
`check_fit_round.py --only patterns` prints `54/54 fit` on the A15.

**If stuck.** If a rule family produces ambiguous distractors, drop that family
rather than hand-editing SVGs; hand edits break reproducibility.

**Merged (2026-10-28), owner approved.** The 24 generated items are p31–p54
(ids 165–188): `gNN/prompt.svg` and `option_k.svg` copied to
`assets/questions/patterns/{30+NN}_q_01.svg` and `_a_0k.svg` and registered
in `index.ts`. Patterns now 16 / 22 / 16 = 54. Generator tests 220/220.

**Result on the A15 (2026-10-28, dev build on Metro, over Wi-Fi).**

| check | result |
|---|---|
| `check_fit_round.py --only patterns` | `54/54 fit` (was 30/30) |
| Detalhado round, `answer_all.py` from `testeqi://test?mode=detalhado` | `90/90`; history +1: mode `detalhado`, 90 questions, per category patterns 27, matrix 18, similarities 15, vocabulary 15, comprehension 15 (the blueprint), reasoning and verbal indices saved |
| `check_fit_round.py --longest-text` | now comprehension q30 (pt 290, en 291, es 299 characters): `3/3 fit`; en and es were shown in pt that day, re-run in the right language on 2026-10-29: `3/3 fit` (slice 05f follow-up) |
| p31, p42, p54 opened alone (`/test?q=165`, `176`, `188`) | prompt and four options drawn |

The scripts' `--max` default was 80, below a Detalhado round; it is 100 now.
