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
- es translation fixes (empatía → empático, dilema → dicotomía, duplicated and
  inverted options, gender agreement, ubicuo, calques), and distractors that
  were literally true replaced in similarities q2, q3, q5, q6, q8, q10, q11,
  q18, q19, q20.
- Two guards in `npm test`: `tests/bankCues.test.ts` (key longest in at most
  35% of items per category and language, on the categories already clean)
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
| `npm test` | 71 | 79 pass |

The options-only guess stays at 20/20 because a "why" item's options reveal
its topic and only one of them is the sound reason; the solver reported that
length and "wise" wording no longer helped. Getting that to chance would need
distractors that are also good reasons, which is two right answers.

**Not done here.**
- Similarities (pt 10/20) and vocabulary (pt 16/20) still have the key as the
  longest option, and vocabulary q4, q5, q9 group three distractors on the
  side opposite the key. Owner's call; the cue test lists them as unguarded.
- Numeric q9 and q11 state the operation (5², 4³) and are tagged hard.
- Results already in a user's history were scored with the old keys; they
  are not recomputed (history keeps no per-answer record).
- Device: the longest text question grew from 177 to 266–277 characters
  (comprehension q12, q17); `check_fit_round.py --longest-text` has to pass
  on the phone before release.
