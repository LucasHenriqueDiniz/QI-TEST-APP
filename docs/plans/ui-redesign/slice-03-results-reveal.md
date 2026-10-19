---
status: todo
---

# Slice 03 — Results: hero and reveal

**Spec.** Research §5.5 (everything except the share image, which is slice 04),
P5; DS-5 `TopBar`, `ScoreCountUp`, `BellCurve`, `CategoryBars`, `Confetti`.

**Delivers.** The Results screen of research §5.5: transparent `TopBar` with
X, full-bleed `gradientBrand` hero (overline, `score`, tier chip, percentile or
strongest-area line, strip "10/30 acertos · N áreas"), curve card overlapping
the hero, primary "Compartilhar resultado" (still text share until slice 04),
outline "Refazer com novas questões", "Seu perfil" bars sorted with a "Ponto
forte" chip, disclaimer. The reveal timeline of §5.5 with a tap-to-skip and
reduce-motion end state. A `mode=history` param renders the final state with
no animation, no confetti and no interstitial (used by slice 09). Total test
time is persisted per history entry (new optional field) so the strip can show
it when present.

**Needs.** Slices 01, 02.

**Tests.**
- First viewport (no scroll) contains the score, tier, percentile line, curve
  and the share button: `check_fit.py --require "Compartilhar resultado"`.
- `adb shell settings put global animator_duration_scale 0` → the final state
  is on screen within 300 ms of navigation (screenshot at 300 ms).
- `adb shell dumpsys gfxinfo com.lhdiniz.testeqi reset`, run a reveal, then
  `dumpsys gfxinfo` → janky frames reported; recorded in the commit body as the
  dev-build baseline (the ≥ 55 fps gate is on the release build, slice 11).
- No red anywhere; the score has no tier colour.

**Done when.** `python3 -I scripts/device/answer_all.py && python3 -I scripts/device/check_fit.py --require "Compartilhar resultado"`
exits 0 after the interstitial is closed.

**If stuck.** If the digit roller misbehaves on Fabric, fall back to the
`AnimatedTextInput` path named in the research and say so in the commit.
