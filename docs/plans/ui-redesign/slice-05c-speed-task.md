---
status: done
---

# Slice 05c — speed task

**Spec.** `docs/research/scoring-modes/README.md` (speed section); decision D7.

**Delivers.** An optional 90 s "Iguais ou diferentes?" task offered at the end
of Normal and Detalhado, before the finish moment: pairs of short symbol or
digit strings, two big buttons (Iguais / Diferentes), items generated offline
from a seeded generator, score = correct − wrong. The block restarts if the
app leaves the foreground (AppState), and the user can skip it. Stored as
`speed` on the history entry and reported as "Velocidade (experimental)",
outside the main IQ. Haptics: `tick()` per answer. No banner on this screen
(it is a timed task; research P8).

**Needs.** Slice 05b.

**Tests.**
- Generator: a unit test proves half the pairs are equal over 1 000 seeded
  items and that "different" pairs differ in exactly one position.
- Device: a script answers the task for 90 s (`scripts/device/speed_task.py`,
  written here) and the stored entry has `speed` with the counts it pressed.
- Backgrounding the app mid-task (`adb shell input keyevent KEYCODE_HOME`, then
  reopen) restarts the 90 s block.

**Done when.** `python3 -I scripts/device/speed_task.py` prints
`speed stored: <correct>-<wrong>` matching what it tapped, and the restart
check prints `restarted`.

**If stuck.** If 90 s feels long in the owner's review, the constant is one
place; the research's reliability note is about 60–120 s.

**Result (2026-10-29, A15, dev build).**

`app/speed.tsx` sits between the last answer and `/finishing` in Normal and
Detalhado (Rápido goes straight to `/finishing`): offer → 4 practice pairs
with feedback → "Agora valendo" → 90 s. The pairs are two rows of 3 symbols
(8 shapes, filled or outline, drawn with SVG primitives in
`components/ui/SpeedGlyph.tsx`), stacked so they compare position by
position; side by side they do not fit 384 dp at a readable size. Back and
"Pular" go on without `speed`. A tap after the 90 s is ignored. "Velocidade
(experimental)" on Results is slice 03b.

| check | result |
|---|---|
| `tests/speed.test.ts` (new) | 1 000 seeded pairs: equal ones within 450–550, every "different" pair differs in exactly one position, same seed same pairs, score floor at 0; `npm test` 93 |
| `scripts/device/speed_task.py` (new): a Normal round, the practice, the block (every fifth answer wrong on purpose) | `speed stored: 464-116` against `465-116` tapped, the last tap after the 90 s (ignored by the app): PASS; score 348 |
| `speed_task.py --restart`: HOME a few pairs in, back after 3 s | `restarted`; with the AppState listener off: the clock keeps running, not restarted |
| answer buttons vs Android's navigation bar | first build overlapped it (no banner, so nothing reserved the inset); now bottom 2138 px, bar from 2205 |

The script reads the block's pairs from a `__DEV__` logcat line: the clock
redraws every 250 ms, so uiautomator never finds the screen idle (its first
version read 0 answers in 90 s). A bot taps ~6 pairs a second, hence the
large counts; people do about 1.
