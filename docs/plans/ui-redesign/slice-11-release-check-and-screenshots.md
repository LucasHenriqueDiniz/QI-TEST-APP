---
status: todo
---

# Slice 11 — release check and store screenshots

**Spec.** Research §6; pitch "How it gets tested".

**Delivers.** An EAS `preview` build (release JS, test ad IDs because the
preview environment has none) installed on the A15 and measured; six store
screenshots per language composed on 1080×1920 canvases (captions ≤ 20% of the
image, no price or ranking words, D5), uploaded to the three listings in the
Play Console. Then an EAS `production` AAB, **not uploaded** until the owner
says so.

**Needs.** Slices 01–10.

**Tests.**
- Reveal on the preview build: `dumpsys gfxinfo` shows ≤ 10% janky frames and
  the 90th percentile frame time under 18 ms (the A15 panel is 90 Hz; this is
  the ≥ 55 fps gate).
- Every pitch release-gate row re-run on the preview build.
- `check_16k.py` on the preview APK → all 64-bit libs OK.
- Each screenshot is 1080×1920 PNG with no alpha; the Play Console shows no
  missing-asset error for any language.

**Done when.** `python3 -I scripts/device/release_gate.py` prints every gate as
`PASS` (written in this slice) and the Play Console's store-listing page has
no warnings.

**If stuck.** If the reveal misses the frame budget, drop the confetti first,
then the curve outline draw-on, then the digit roller (fall back to a static
score with a fade).
