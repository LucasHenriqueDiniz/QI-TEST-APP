---
status: todo
---

# Slice 01 — tokens, typography, motion, haptics

**Spec.** Research §4 DS-1, DS-2, DS-3, DS-4.

**Delivers.**
- `constants/theme.ts`: the DS-1 colour table (fixed `textFaint`, new
  `primaryText`, `outline`, `gradientBrand`, `gradientGlow`, light `accent`,
  `onAccentSoft`, dark `paper`, `category.*`).
- Typography: `Manrope_800ExtraBold` loaded in `app/_layout.tsx`; new `score`
  variant (96/104, tabular-nums, `maxFontSizeMultiplier` 1.2); `display` 36/42
  Manrope 800.
- `motion`: the M3 Expressive spring tokens with `mass: 1` explicit and the
  `durations` table. Reanimated 4.5.1's default `withSpring` config is
  `GentleSpringConfig` (mass 4), so a token without `mass` silently inherits it.
- `utils/haptics.ts`: `tick()`, `confirm()`, `press()` via
  `performAndroidHapticsAsync` on Android, iOS fallbacks, every call wrapped in
  `.catch(() => {})`, gated by a stored "Vibração" preference (default on).
  `Button` uses `press()`; no `impactAsync` remains.
- Existing screens keep working with the new tokens; no layout redesign yet.

**Needs.** Slice 00.

**Tests.**
- `check_contrast.py` → exit 0.
- `grep -rn "impactAsync\|notificationAsync" app components hooks utils` →
  only inside the iOS branch of `utils/haptics.ts`.
- `answer_all.py` → `30/30` in light and in dark.
- Screenshots of Home, a text question, a pattern question and Results in both
  themes show no unreadable text.

**Done when.** `python3 -I scripts/device/check_contrast.py && npx tsc --noEmit && echo OK`
prints `OK`, and `answer_all.py` prints `30/30`.

**If stuck.** If a DS-1 hex fails the checker on a surface the research did
not list, adjust that hex until the pair passes and note it in the commit body;
the checker, not the table, is the oracle.
