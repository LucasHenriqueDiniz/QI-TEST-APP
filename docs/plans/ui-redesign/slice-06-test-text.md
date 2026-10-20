---
status: done
---

# Slice 06 — Test: text question, progress, pause

**Spec.** Research §5.2, P2, P3; DS-5 `TopBar`, `OptionCard`,
`SegmentedProgress`, `MilestoneChip`.

**Delivers.** The test shell of §5.2 shared with slice 05: `TopBar` with X ·
`SegmentedProgress` (segments sized to the mode — Rápido 2×10, Normal 4×10,
Detalhado 3×30 — filled with `scaleX`) · counter "7/40" (reads "faltam N" for
the last 5), category line in `category.*` colour, `OptionCard`s with letter
badges, gradient "Confirmar" ("Ver meu resultado" on the last question). Select → pop +
`tick()`; commit → `confirm()`, exit/enter transition ≤ 300 ms. Milestone chips
after question 3 and at each segment boundary. X and system back open the pause sheet
("Pausar o teste? Seu progresso fica salvo."). Stack header removed. A
`__DEV__`-only `/test?q=<id>` opens a single question for fit checks.

**Needs.** Slices 01, 02, 05, 05b (round length comes from the mode).

**Tests.**
- The longest text question in pt, en and es (found by string length in the
  translation files) fits: `check_fit.py` 3/3.
- `answer_all.py` → `N/N` for each mode (20, 40, 90).
- Pause sheet: answer 5, press back, choose "Sair e continuar depois", reopen,
  "Continuar" → counter reads 6/N.
- First visual change on tap within 6 frames of a 60 fps screen recording
  (`adb shell screenrecord`), noted in the commit.

**Done when.** `python3 -I scripts/device/check_fit_round.py --longest-text && python3 -I scripts/device/answer_all.py`
exits 0.

**If stuck.** If the exit/enter transition drops frames on the A15, cut it to
opacity only and keep the timing.

**Result (2026-10-20).** Implemented by a Fable agent; the device checks were
run by the orchestrator on the A15 over wireless debugging (the USB cable kept
dropping). Static: `tsc` 0, `npm test` 71/71 (10 new in
`tests/progress.test.ts`; 5 of 6 mutants of `utils/progress.ts` go red, the
sixth is equivalent), contrast 0 failing pairs.

| check | result |
|---|---|
| `check_fit_round.py --longest-text` | 3/3 fit (pt q69, en q77, es q69) |
| `check_fit_round.py --only patterns` | 30/30 fit |
| `answer_all.py`, Rápido / Normal | 20/20 and 40/40; history entry has 20 / 40 answers, band, duration; progress cleared |
| `answer_all.py`, Detalhado | not run: `isModeAvailable("detalhado")` is false on today's 110-item bank (needs 05d, 05e) |
| `check_pause.py` | PASS, 8 steps; counter 6/40 after leaving and resuming |
| `check_double_finish.py` | PASS: history +1 with 20 answers; without the guard +2 (20 and 21 answers, 104 ms apart) |
| `check_relink.py` | PASS: 6/40 → 1/20; without the reset 11/40 → 11/20 |
| `check_fit.py` red proof | prompt pushed 700 dp → "only 0 of 4 options" exit 1; 250 dp → C and D clipped, exit 1 |
| `ad_shift.py --screen test` | not run: airplane mode would cut the Wi-Fi adb link; pending a cable |
| tap → first visual change ≤ 6 frames | not measured: no tap timestamp in `screenrecord` without turning on the phone's "show touches" |

Found in review and fixed here: the last question's button stayed enabled
while the result was saved, so a double tap wrote two history entries (the
old screen cleared the selection first); a link to `/test` onto an open test
kept the previous round's position and answers (from 05b, reachable through a
`testeqi://test` link); the milestone chip sat on the screen edge and let the
category name show beside it. Harness: `check_fit.py` passed when every option
was below the fold (absent from the dump), now required whenever the test
counter is on screen; `check_pause.py` missed Home's button behind its icon
glyph. Screenshots light and dark: question, selected, milestone, pause
sheet, countdown, last question, pattern question.
