---
tags: [fetch, scoring-modes]
source: file://data/questions.ts, hooks/useQuestionSelection.ts, utils/iqCalculator.ts, types/storage.ts, types/index.ts, app/test.tsx, assets/questions/patterns/, assets/i18n/translations/pt.ts
fetched: 2026-10-19
kind: primary
---

# The app as it is today (read from the repo)

> Fetched 2026-10-19 · What the code actually does, read and counted in the working tree. This is the baseline every recommendation changes.

## What it says

**Bank** (`data/questions.ts`, counted with a regex over `category` / `difficulty`; same count from `sim/simulate.mjs`):

| category (key) | label (pt) | easy | medium | hard | total |
|---|---|---|---|---|---|
| patterns | Raciocínio visual | 16 | 6 | 8 | 30 |
| matrix | Lógica numérica | 3 | 8 | 9 | 20 |
| similarities | Semelhanças | 2 | 8 | 10 | 20 |
| vocabulary | Vocabulário | 0 | 2 | 18 | 20 |
| comprehension | Compreensão | 2 | 12 | 6 | 20 |
| **total** | | 23 | 36 | 51 | 110 |

Weights are 1 / 2 / 3 for easy / medium / hard on every item. Every one of the 80 text items has exactly 4 options (counted in `pt.ts`), and every pattern item has 4 option SVGs (A–D), so a blind guess is right 1 time in 4.

**Pattern assets**: 150 SVG files in `assets/questions/patterns/` = 30 question SVGs (`NN_q_01.svg`) + 120 option SVGs (`NN_a_0[1-4].svg`), 916 KB on disk; registered by hand in `assets/questions/patterns/index.ts`; the slot key is `questionKey` padded to 2 digits.

**Blueprint** (`hooks/useQuestionSelection.ts`):

```ts
patterns:      { medium: 6, hard: 6 },
similarities:  { easy: 1, medium: 2, hard: 2 },
matrix:        { easy: 1, medium: 2, hard: 2 },
vocabulary:    { easy: 1, medium: 1, hard: 2 },
comprehension: { easy: 1, medium: 2, hard: 1 },
```

`buildTest()` shuffles each category × difficulty cell and takes `count`; if the cell is short it fills from any remaining item of the same category ("completa com as demais dificuldades daquela categoria"), then shuffles the whole test.

Consequences, read off the numbers above:
- `vocabulary.easy: 1` with 0 easy vocabulary items: the slot is always filled from the rest of vocabulary (2 medium + 18 hard), so it is hard 90% of the time.
- `patterns.medium: 6` with exactly 6 medium patterns: all 6 appear in every test.
- No easy pattern is ever drawn: 16 of 30 pattern items (and 80 of 150 SVGs) never reach a user.

**Scoring** (`utils/iqCalculator.ts`): `ratio = weightEarned / weightTotal` over the *answered* items; `z = (ratio − 0.55) / 0.18`; `IQ = 100 + 15 z + ageAdjustment(age)`, rounded and clamped to 55–145; percentile = normal CDF of the final IQ, clamped 1–99. `ageAdjustment`: +4 under 14, +2 under 18, −3 over 65. Comment: "Não é um teste normatizado — não temos amostra populacional."

**Timing** (`app/test.tsx`, `types/index.ts`, `types/storage.ts`): `timeSpent: (Date.now() - questionStartedAt.current) / 1000` per answer; `questionStartedAt` is reset when a question is shown and when a saved test is restored. There is no `AppState` listener, so time spent with the app in the background (but not killed) counts as time on the question. `timeSpent` lives in `Answer` → `TestProgress.savedAnswers`; `HistoryItem` keeps only `iqScore, percentile, correctAnswers, totalQuestions, categories`, so per-answer times are discarded when the test finishes.

## What it does not say

- Any empirical difficulty: the easy/medium/hard labels are the author's judgement; no proportion-correct data exists anywhere in the repo.
- Why vocabulary is 18/20 "hard" — possibly a labelling choice, not a property of the items.
