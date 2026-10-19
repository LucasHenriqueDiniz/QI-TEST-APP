---
status: todo
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
