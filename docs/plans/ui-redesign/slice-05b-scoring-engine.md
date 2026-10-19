---
status: todo
---

# Slice 05b — modes and scoring engine

**Spec.** `docs/research/scoring-modes/README.md` (blueprints, EAP model,
band, selection, defects); decisions D6, D8.

**Delivers.**
- `hooks/useQuestionSelection.ts`: modes `rapido` (20), `normal` (40),
  `detalhado` (90) with the research blueprints; least-recently-used selection
  within each category × difficulty cell (usage counts persisted); the easy
  vocabulary hole fixed by the blueprint, not by the fallback. `TEST_LENGTH`
  disappears: every consumer reads the round's length.
- `utils/iqCalculator.ts`: the EAP estimator (c = 0.25, a = 1.2,
  b = −1.1 / −0.1 / +0.9), IQ = 100 + 15·θ clamped to [55, 145], the 90% band
  widened ×1.25, percentile from θ; Verbal and Raciocínio index scores only
  when a domain has ≥ 30 items. The age adjustment keeps working.
- `types/storage.ts`: `HistoryItem` gains `mode`, `band` and optional
  `indices`; `TestProgress` stores `mode`. Old entries without them still
  render (treated as a legacy 30-item test).
- `app/test.tsx`: starts a round for a given mode (route param `mode`,
  default `normal` until the Home chooser of slice 08), and `timeSpent` stops
  counting while the app is in the background (AppState), so durations mean
  active time.
- Unit tests (the repo has none yet: add Jest via `jest-expo` or a plain
  `node --test` on the pure functions — pick the lighter one and say why) for
  the estimator and the blueprints.

**Needs.** Slices 01, 05. Research fetched and decided.

**Tests.**
- Reference values from the research: all correct → 130 / 137 / 145 (Rápido /
  Normal / Detalhado); all wrong → 65 / 58 / 51 → 55 after the floor. Each
  must fail if the estimator constants are changed (revert one and watch it
  go red).
- Blueprint totals 20 / 40 / 90, and each cell ≤ the bank available for
  Rápido and Normal today; Detalhado is only enabled when every cell has at
  least 2× its blueprint count (a test asserts the guard).
- Two consecutive Normal rounds share 0 items (LRU), checked in a test with a
  fake storage.
- `answer_all.py` on the device: `20/20` with `mode=rapido`, `40/40` with
  `mode=normal` (open the route with
  `adb shell am start -a android.intent.action.VIEW -d "testeqi://test?mode=rapido" com.lhdiniz.testeqi`).

**Done when.** The unit-test command prints all tests passing, and
`answer_all.py` reaches Results with `20/20` and with `40/40` on the A15.

**If stuck.** If EAP over a θ grid is slow on the A15, precompute the grid
once per round (41 points over [−4, 4] is enough for an integer IQ).
