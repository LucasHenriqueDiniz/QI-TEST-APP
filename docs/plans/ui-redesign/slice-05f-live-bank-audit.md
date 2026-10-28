---
status: done
---

# Slice 05f — live bank audit: wrong keys, language parity, test-wise cues

**Why.** The owner approved removing the "key is the longest option" cue from
the 20 comprehension items (2026-10-20). Measuring it on the shipped bank (the
translation files, not a staging copy) found worse: the 80 text items had
never been solved blind, and some keys were wrong.

**Delivers.**
- Wrong keys fixed. In every language: numeric q3 (1, 3, 6, 10 → 15, keyed
  16), q5 (2, 6, 12, 20 → 30, keyed 32), q12 (8, 11, 15, 20, 26 → 33, keyed
  35); in pt only: q16 (1, 1, 2, 3, 5 → 8, keyed 7); numeric q14 had two rules
  in the options (13 and 12), 12 replaced.
- One item, one key. Items 15–20 of numeric logic and 18–20 of similarities,
  vocabulary and comprehension had a different question per language under the
  shared `correctAnswer`; en/es keyed "cogent" → "Weak", 1, 2, 4, 8 → "12" and
  1, 4, 9, 16 → "20", and es asked what "claro" means with "Claro" as an
  option. en/es are now translations of pt.
- Comprehension options rewritten (a Fable agent, then blind solves): the key
  is plain and concrete, distractors are plausible false reasons, lengths sit
  in the middle of each set.
- Similarities and vocabulary options rewritten the same way (owner approved,
  2026-10-20): similarities distractors are specific properties false for at
  least one of the pair; vocabulary distractors are same-shape definitions
  mixing a near-miss, an unrelated sense and at most one antonym (3/20).
- es translation fixes (empatía → empático, dilema → dicotomía, duplicated and
  inverted options, gender agreement, ubicuo, calques), and distractors that
  were literally true replaced in similarities q2, q3, q5, q6, q8, q10, q11,
  q18, q19, q20.
- Two guards in `npm test`: `tests/bankCues.test.ts` (key longest in at most
  35% of items per category and language, all four text categories)
  and `tests/bankParity.test.ts` (four options per item and language; numeric
  items carry the same numbers and options in pt, en and es).

**Result (2026-10-20).**

| measure | before | after |
|---|---|---|
| blind solver agrees with the key, 80 items | pt 76, en 74, es 74 | 80, 80, 80 (then 21/21 and 5/5 on the items edited after it) |
| items whose languages differ | 21 | 0 |
| comprehension: key strictly longest | pt 15/20, en 14/20, es 16/20 | 0/20 in each |
| comprehension: key guessed from the options alone (no question) | 20/20 in each | 20/20 in each |
| `tests/bankCues.test.ts` (comprehension) | red: 15/20, 14/20, 16/20 | green |
| `tests/bankParity.test.ts` (numeric) | red: q15–q20 | green |
| similarities / vocabulary: key strictly longest (pt) | 10/20, 16/20 | 1/20, 2/20 (en 2, 1; es 3, 3) |
| similarities + vocabulary rewrite, blind solve with the question | — | 40/40 in pt, en and es |
| vocabulary: key guessed from the options alone (no word) | 20/20, confidence 0.82–0.93, cue "odd one out / only positive / longest" | 17/20, confidence 0.53, by reconstructing the word from the near-miss distractors (16/20 words named exactly), keys kept out of the solver's folder |
| `tests/bankCues.test.ts` (all four categories) | red on the old texts: similarities and vocabulary fail in all 6 category × language combinations | green |
| `npm test` | 71 | 85 pass |
| longest text question on the A15 (`check_fit_round.py --longest-text`, 2026-10-28) | 177 characters, fit | pt q10 267, en q17 266, es q12 277: 3/3 fit |

The options-only guess stays at 20/20 because a "why" item's options reveal
its topic and only one of them is the sound reason; the solver reported that
length and "wise" wording no longer helped. Getting that to chance would need
distractors that are also good reasons, which is two right answers.

**Not done here.**
- The vocabulary options-only guess stays high because the near-miss
  distractors ("resistente" for resiliente, "prolixo" for prolífico) let a
  solver name the word and then use what it means — vocabulary knowledge, not
  the old cue, which needed none. A person who does not know the word has no
  such route; we did not measure people.
- Duplicates kept: similarities q5/q17 (sun and lamp), vocabulary q7/q15
  (efêmero).
- Numeric q9 and q11 state the operation (5², 4³) and are tagged hard.
- Results already in a user's history were scored with the old keys; they
  are not recomputed (history keeps no per-answer record).
