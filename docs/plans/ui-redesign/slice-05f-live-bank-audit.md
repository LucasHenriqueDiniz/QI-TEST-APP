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
| longest text question on the A15 (`check_fit_round.py --longest-text`, 2026-10-28) | 177 characters, fit | pt q10 267, en q17 266, es q12 277: 3/3 fit, but en and es were shown in pt (see the follow-up) |

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
- Results already in a user's history were scored with the old keys; they
  are not recomputed (history keeps no per-answer record).

**Follow-up (2026-10-29), owner approved: duplicates and false "hard" items.**
Fifteen items replaced in place (same id, difficulty and key position, so the
blueprint counts and Detalhado's two forms per cell are unchanged):

| items | problem | now |
|---|---|---|
| numeric q9, q11 (hard) | stated the operation: 5², 4³ | 1, 8, 27, 64 → 125; 3, 4, 8, 17, 33 → 58 (differences 1, 4, 9, 16) |
| numeric q1, q4, q6, q8 (hard) | doubling twice, plain squares, and 1, 3, 6 → 10 inside q3's 1, 3, 6, 10 → 15 | differences are primes (→ 42); ×3 and −3 alternating (→ 15); ×3 + 1 (→ 121); each term the sum of the previous three (→ 24) |
| numeric q13, q14, q19 | showed q3's, q16's and q15's answers in the same run | 1, 4, 16, 64 → 256; n² + 1 (→ 37); 4, 8, 12, 16 → 20 |
| similarities q17 | repeated q5 (the sun and a lamp) | a map and a compass |
| similarities q13–q16 (hard) | tree/flower, plane/bird, car/motorcycle, fish/shark | praise/punishment, echo/mirror, virus/rumor, bridge/interpreter |
| vocabulary q15 | repeated q7 (efêmero) | veemente / vehement / vehemente |

| check | result |
|---|---|
| blind solve, keys kept out of the solver's folder | 15/15 in pt, en and es, no other option defensible; it flagged vaccine/seat belt (its answer gave away a comprehension item), law/custom (same answer as praise/punishment) and 1, 2, 6, 15, 31 (shared 1, 15, 31 with q34); those three were replaced, then 4/4 on the second solve |
| `tests/bankDuplicates.test.ts` (new): a vocabulary word asked twice, a similarities pair asked twice, a numeric item whose last three terms (answer included) appear in a row in another | red on the old bank (5/5 fail: q7/q15, q5/q17, q1/q17, q15 in q19, q16 in q14), green now |
| `npm test` | 87 pass |
| the 15 items opened alone on the A15 (text items in pt, en and es, the language checked on screen) | 27/27 fit |

`ui.open_route` passed the deep link unquoted to the phone's shell, where `&`
ends the command: `/test?q=<id>&lang=en` arrived without `lang` and showed pt.
Every earlier `--longest-text` "3/3" therefore measured pt three times. The
link is quoted now and the script checks that the language's question text is
on screen (without the quoting: 1/3, en and es fail). Re-run: comprehension
q30, pt 290, en 291, es 299 characters, 3/3 fit in the right language.

Still open: a solver rated several of the new "hard" items medium (cubes,
×3 + 1, the similarities pairs); no data from people decides it yet.
