---
status: todo
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
