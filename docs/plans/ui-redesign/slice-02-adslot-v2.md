---
status: done
---

# Slice 02 — AdSlot v2

**Spec.** Research §4 DS-5 `AdSlot` v2, P8; decision D2.

**Delivers.** `components/ui/AdSlot.tsx` reserves a fixed height
(`max(60, lastMeasuredBannerHeight)`, the measured height cached at module
level), has a 24 dp non-interactive zone with a hairline divider above it, and
sits at the bottom edge above the system inset, never inside scroll content,
one per screen. On the test screen the banner moves below "Confirmar" (D2).

**Needs.** Slice 01.

**Tests.**
- `ad_shift.py` on Home, the test screen and Results → exit 0 on each.
- With airplane mode on, the reserved space stays (no collapse) and nothing
  overlaps the primary button.
- On the test screen the vertical order is content → button → gap → banner.

**Done when.** `for s in home test results; do python3 -I scripts/device/ad_shift.py --screen $s || exit 1; done; echo OK`
prints `OK`.

**If stuck.** If the adaptive banner height varies per request, reserve the
largest height seen (cache the max, not the last).

**Result (2026-10-19).** Started by a Fable agent (stopped at the account's
Fable usage limit), finished and verified by the orchestrator on the A15.
`ad_shift.py`: home, test and results all `STABLE`, exit 0, banner loaded
online at 0,2037–1080,2205 px; before, the test viewport lost 169 px when the
banner loaded. Reserved height on the A15: 60 dp + 24 dp gap + the nav inset.
Test footer is content → Confirmar → gap → banner (D2). `check_fit.py`: short
text question FIT. Pattern question: options 3–4 now fully hidden (−4 px)
because the viewport ends at 1770 instead of 1809 px; slice 05 owns it.
`tsc` 0, contrast 0 failing.

Harness fixes made on the way: `ui.dump()` reads the XML only when
uiautomator reports "dumped to" (a failed dump left the previous screen's
tree in place); `answer_all.py` scrolls a clipped option into view before
tapping it and matches the resume prompt case-insensitively; `ad_shift.py
--screen results` recognises Results by its title (the share button is below
the fold today) and closes the interstitial by position (it runs inside the
app's package, so the package does not tell it apart).
