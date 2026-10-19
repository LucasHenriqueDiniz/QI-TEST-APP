---
status: todo
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
