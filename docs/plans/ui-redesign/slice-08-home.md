---
status: todo
---

# Slice 08 — Home

**Spec.** Research §5.1.

**Delivers.** The three Home variants: first run (animated 3×3 hero, "Descubra
seu QI", trust chips "Resultado completo, sem bloqueio" · "Sem cadastro" · "Sem
cronômetro", gradient "Começar teste", disclaimer line, "Como funciona");
returning user ("Seu recorde" gradient card with sparkline, "Fazer novo
teste"); test in progress (ring "12/30", "Continuar teste", "Recomeçar" with a
confirm sheet, replacing the `Alert`). The chip grid moves to About (slice 10).
No duration promise.

**Needs.** Slices 01, 02, 06 (the pause flow creates the in-progress state).

**Tests.**
- Each variant at font scale 1.0 and 1.3
  (`adb shell settings put system font_scale 1.3`): the primary button is
  fully visible above the ad gap without scrolling → `check_fit.py --require <button label>` 6/6.
- First run needs empty data: `adb shell pm clear com.lhdiniz.testeqi` (wipes
  the app's history and settings on the test phone).
- Reduce motion → the hero is static.

**Done when.** `python3 -I scripts/device/check_home_variants.py` prints `6/6`
(written in this slice) and font scale is restored to 1.0.

**If stuck.** If the returning-user card pushes the button below the fold at
1.3, shrink the sparkline before shrinking the score.
