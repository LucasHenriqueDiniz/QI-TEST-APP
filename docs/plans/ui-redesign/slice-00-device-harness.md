---
status: todo
---

# Slice 00 — device harness

**Delivers.** `scripts/device/`, the commands every later slice uses as its
"Done when", runnable from the repo by any agent:

| script | does |
|---|---|
| `cold.sh` | force-stops the app, `adb reverse tcp:8081`, opens the dev client on Metro |
| `shot.sh <name> [dir]` | full-resolution screenshot plus a half-size copy for reading |
| `answer_all.py [seed]` | answers the current test to the end through `uiautomator` (radio buttons + bottom-most button), prints one line per question, exits 0 on N/N |
| `check_fit.py` | on the current screen, exits 0 when every `RadioButton` and the primary button sit fully inside the window above the ad gap, i.e. nothing needs scrolling |
| `ad_shift.py` | reads the primary button bounds ~0.3 s after the screen appears and again after 6 s; exits 0 when they are identical |
| `check_16k.py <apk>` | 16 KB ELF/zip alignment of 64-bit `.so` files (kept from the 2026-10-19 run) |
| `check_contrast.py` | static: parses `constants/theme.ts` for both palettes and checks the contrast pairs listed in research DS-1; exits 1 and lists every failing pair |
| `README.md` | prerequisites (`brew install --cask android-platform-tools`, USB debugging), installing a dev build from EAS, and how to read each script's output |

**Needs.** Phone on USB with debugging authorised; Metro running. The 2026-10-19
versions of `cold.sh`, `shot.sh`, `run_test.py`, `check16k.py` as a starting
point (30 min).

**Tests.**
- `answer_all.py` on a fresh test → `30/30` and the results screen reached.
- `check_contrast.py` on today's tokens → exit 1 listing at least
  `textFaint` (both themes) and the option outline pair. This is the red state
  slice 01 must turn green; a checker that passes today checks nothing.
- `check_fit.py` on today's pattern question → exit 1 (178 dp overflow); on a
  short text question → exit 0.
- `ad_shift.py` on today's test screen → exit 1 (the banner collapses then
  grows).

**Done when.** `python3 -I scripts/device/check_contrast.py; echo $?` prints the
failing pairs and `1`, and `python3 -I scripts/device/answer_all.py` ends with
`30/30`.

**If stuck.** If `uiautomator dump` races the UI (stale tree), dump twice and
compare before acting; if `ad_shift.py` is flaky because the ad loads before
0.3 s, measure twice with airplane mode toggled to force the empty state.
