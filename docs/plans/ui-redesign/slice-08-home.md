---
status: done
---

# Slice 08 — Home

**Spec.** Research §5.1.

**Delivers.** The three Home variants: first run (animated 3×3 hero, "Descubra
seu QI", trust chips "Resultado completo, sem bloqueio" · "Sem cadastro" · "Sem
cronômetro", gradient "Começar teste", disclaimer line, "Como funciona");
returning user ("Seu recorde" gradient card with sparkline, "Fazer novo
teste"); test in progress (ring "12/30", "Continuar teste", "Recomeçar" with a
confirm sheet, replacing the `Alert`). The chip grid moves to About (slice 10).
No duration promise. A mode chooser (Rápido 20 · Normal 40 · Detalhado 90,
Normal preselected, a one-line description each, and "inclui teste de
velocidade opcional" on Normal and Detalhado) starts the round with that mode
(slice 05b's `mode` param).

**Needs.** Slices 01, 02, 05b, 06 (the pause flow creates the in-progress state).

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

**Result (2026-10-29, A15, dev build, font scale 1.0).**

Home is three variants over one fixed footer: the content scrolls, and the
mode chooser (or the progress card), the primary button and the
"Apenas entretenimento · Como funciona" line stay pinned above the banner,
so the button is on the first screen at any font scale.

- First run: the 3×3 of the store icon (`components/HomeHero.tsx`, the speed
  task's glyphs in white on the brand gradient; tiles spring in 40 ms apart,
  the "?" pulses twice; static under reduce motion), "Descubra seu QI", the
  count of the chosen mode, and the three promises as icon + text (as chips,
  in upper case, two of them fell behind the footer).
- Returning: "Seu recorde" on the brand gradient (`components/RecordCard.tsx`),
  best score, tier, a white sparkline of the last 10, "Último · Testes
  feitos"; "Fazer novo teste".
- In progress: a ring with answered/total, "Continuar teste" (resumes at once:
  the `Alert` prompt is gone) and "Recomeçar" with a confirm bottom sheet
  (`components/ui/BottomSheet.tsx`, `ConfirmSheet.tsx`: scrim fades while the
  sheet springs; back, a tap on the scrim or dragging the handle closes it).
- Mode chooser (`components/ModeChooser.tsx`): Rápido 20 · Normal 40 ·
  Detalhado 90, Normal preselected, one line about the chosen mode;
  Detalhado from Home opens 1/90.

| check | result |
|---|---|
| `scripts/device/check_home_variants.py` (new; writes the storage for each variant and puts the owner's back, so no `pm clear`: 42 history entries before and after) at font scale 1.0 | `3/3` (first run also with the three promises fully above the footer) |
| same at font scale 1.3 | **not run**: it needs the system font size changed by hand |
| reduce motion → static hero | not run on the phone (a system setting); the code path is `useReducedMotion` |
| `check_pause.py` (updated: no resume prompt; a round in progress is discarded through "Recomeçar" + the sheet) | `PASS` |
| "Recomeçar" → sheet → confirm | progress removed, Home back to "Fazer novo teste" |

Device scripts follow the prompt-less Home: `ui.resume_button` is gone,
`ui.restart_button` finds "Recomeçar", `ui.discard_progress()` confirms it.
