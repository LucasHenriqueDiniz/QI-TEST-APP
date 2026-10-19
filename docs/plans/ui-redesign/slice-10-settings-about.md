---
status: todo
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
