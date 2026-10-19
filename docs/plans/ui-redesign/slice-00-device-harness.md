---
status: done
---

# Slice 00 — device harness

**Delivers.** `scripts/device/`, the commands every later slice uses as its
"Done when", runnable from the repo by any agent:

| script | does |
|---|---|
| `cold.sh` | force-stops the app, `adb reverse tcp:8081`, opens the dev client on Metro |
| `shot.sh <name> [dir]` | full-resolution screenshot plus a half-size copy for reading |
| `answer_all.py [seed]` | answers the current test to the end through `uiautomator` (radio buttons + bottom-most button), prints one line per question, exits 0 on N/N |
| `check_fit.py` | on the current screen, exits 0 when all 4 options, the primary button and any `--require` label are fully visible: inside the window, above the banner, and not clipped (an option shorter than its tallest sibling is clipped) |
| `ad_shift.py` | opens the screen offline (airplane mode, empty slot) and online (banner loaded) and exits 0 when the frame — primary button and scroll viewport — is identical |
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
compare before acting.

**Result (2026-10-19).** All four red states reproduced on the A15:
`check_contrast.py` 13 failing pairs (the 5 the research measured, matching to
two decimals, plus white on dark `primary` at 4.46:1); `check_fit.py` on a
pattern question → options 3–4 clipped to 35 px of 456 px, on a short text
question → FIT; `ad_shift.py --screen test` → scroll viewport bottom 1978 →
1809 px once the banner loads, button unchanged; `answer_all.py --start` →
`30/30`. Two first designs were wrong and were replaced: reading the button
twice on one open (the banner had already loaded, and on the test screen the
button is pinned while the content viewport shrinks), and Android's
`scrollable` flag (React Native's ScrollView reports it even when content fits).
