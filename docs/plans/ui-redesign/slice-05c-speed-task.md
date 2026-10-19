---
status: todo
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
