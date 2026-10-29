---
status: done
---

# Slice 07 — finish moment

**Spec.** Research §5.4, P4; decision D3.

**Delivers.** `app/finishing.tsx`: saves nothing new (the result is already
saved), shows "Teste concluído!", the 3×3 grid loader and the five areas
ticking every 350 ms, no banner, no back. When the interstitial is loaded and
the gates in `useGatedInterstitial` pass, a line "Um anúncio rápido e já
mostramos seu resultado." At ≈2 s the pre-loaded interstitial shows; on close,
`router.replace('/results')`. Not loaded → Results directly.

**Needs.** Slices 03, 06.

**Tests.**
- After the last answer, "Teste concluído!" is in the UI tree within 1 s, and
  the ad appears only after ≥ 1.5 s on this screen (timestamps from a polling
  script).
- Airplane mode (`adb shell cmd connectivity airplane-mode enable`) → Results
  within 3 s, no blank screen.
- Force-stop during the ad → the result is the newest History entry.

**Done when.** `python3 -I scripts/device/check_finish.py` prints the three
checks as `PASS` (written in this slice).

**If stuck.** If the interstitial sometimes is not ready at 2 s even when
loading started on the test screen, start loading at question 20.

**Result (2026-10-29, A15, dev build).**

The interstitial is one module-level `InterstitialAd` in
`hooks/useGatedInterstitial.ts` (it was a `useInterstitialAd` per screen): the
test screen starts loading it, `/finishing` shows it. With one ad per screen,
the one on `/finishing` would only start loading there and rarely be ready at
2 s. The dev pattern round still goes straight to Results, without the ad.

| check (`scripts/device/check_finish.py`, new; gaps from the app's `__DEV__` logcat lines) | result |
|---|---|
| timing: "Teste concluído!" after the last answer; the ad after ≥ 1.5 s on screen; Results after the ad | PASS: 0.37 s; ad after 2.02 s (AdActivity resumed); Results |
| offline: airplane mode from the cold start | PASS: left for Results 2.30 s after the last answer, no ad, Results |
| killed: force-stop while the ad is on screen | PASS: newest history entry is the round (Rápido, 20 questions) |
| red: the hand-over at 0.5 s instead of 2 s | timing FAIL (ad after 0.51 s) |

The confirm button already fires `haptics.confirm()`, so `/finishing` adds no
second one.
