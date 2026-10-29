---
status: done
---

# Slice 10 — Settings and About

**Spec.** Research §5.9, §5.10, and the in-app review prompt of §5.5.

**Delivers.** Settings with `TopBar`, theme as a segmented control, the
"Vibração" switch (wired to slice 01's preference), grouped About / Avaliar /
Privacidade / Opções de privacidade dos anúncios, "Apagar histórico" last with
a confirm sheet, version footer, rows ≥ 48 dp. About sheet: `Modal`
`animationType="none"`, scrim fades while the sheet springs up, drag-down to
close, "O que o teste mede" with the five areas. In-app review prompt via
`expo-store-review` after a reveal that ties or beats the best score, at most
once per 30 days (needs a dev build).

**Needs.** Slices 01, 03, 08.

**Tests.**
- "Vibração" off → `answer_all.py` produces zero haptic calls (each call logs
  a `__DEV__` line; count them in `adb logcat`).
- Accessibility Scanner (installed by the owner) reports no touch-target or
  contrast issue on Settings; result noted in the commit.
- Back gesture closes the About sheet; a screen recording shows the scrim
  fading.

**Done when.** `python3 -I scripts/device/check_haptics_off.py` prints
`0 haptic calls over 30/30` (written in this slice).

**If stuck.** If `expo-store-review` cannot be exercised before the app is
live on Play, ship it behind the same gates and verify only that it is not
called in history mode.

**Result (2026-10-29, A15, dev build 68b96b4a).**

Settings: "Vibração" switch under Teste (wired to `utils/haptics.ts`), the
theme as one 48 dp segmented row, "Apagar histórico" confirmed in the bottom
sheet from slice 08 instead of an `Alert` (a line confirms it afterwards).
About uses the same `BottomSheet` (scrim fades while the sheet springs; back,
the scrim or dragging the handle close it) and now lists the five areas with
a line each, which left Home in slice 08. In-app review
(`utils/reviewPrompt.ts`, `expo-store-review`): after a revealed result that
ties or beats the previous best (with at least one test before), never from
history, at most once per 30 days (`reviewPromptedAt` in storage), 3.7 s
after Results opens, when the reveal has settled.

| check | result |
|---|---|
| `scripts/device/check_haptics_off.py` (new; writes the preference and puts the owner's storage back) | `0 haptic calls over 20/20` with Vibração off; `41` with it on (red) |
| `scripts/device/check_review_prompt.py` (new) | `3/3`: beats the best → `requested`; history mode → no call; ties right after → skipped (< 30 days) |
| About opened from Home's "Como funciona": the five areas, back closes it | yes; the fade itself is faster than screenshots (~200 ms each), not measured |
| Accessibility Scanner on Settings | owner's manual check, not done |

The slice's "30/30" was the old round length; the Rápido round is 20. On a
sideloaded build the Play review sheet does not show; the request is what
the check sees.
