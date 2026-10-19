---
status: todo
---

# Slice 05d — bank: 54 text items in three languages

**Spec.** The bank-expansion table of `docs/research/scoring-modes/README.md`;
decision D8. Existing items in `data/questions.ts` and
`assets/i18n/translations/*.ts` set the style.

**Delivers.** +16 lógica numérica (7 easy / 8 medium / 1 hard), +10
semelhanças (6 / 4 / 0), +18 vocabulário (8 / 10 / 0), +10 compreensão
(8 / 0 / 2), each with metadata (category, difficulty, weight, correct index)
and its text in pt-BR, en and es. Written first to a staging file
(`data/staging/text-items.json`) so it never collides with screen slices
editing the translation files, then merged in one change.

**Needs.** Nothing on the device; can run while device slices run.

**Tests.**
- **Blind solve.** A second agent, given each item without the key in each
  language, answers it; every disagreement is either fixed or the item is
  replaced. Report: 54/54 agreed per language.
- **One right answer.** For each item the solver also states whether any
  other option is defensible; any "yes" is rewritten.
- **Translation parity.** The same correct index in all three languages; no
  option that becomes ambiguous in translation (vocabulary items are chosen
  per language when a word has no clean equivalent, keeping difficulty).
- **Owner review.** A generated Markdown table of all 54 items in pt-BR goes to
  the owner before the merge.
- After the merge: the bank counts per cell equal the research table, and
  `tsc` passes.

**Done when.** A script (`scripts/bank/count.py`, written here) prints the
per-category × difficulty counts and they match the research table for the
text categories, and the blind-solve report says 54/54 in pt, en and es.

**If stuck.** Vocabulary easy items are the hardest to keep easy in all three
languages; prefer common words with one clear synonym over rare words.
