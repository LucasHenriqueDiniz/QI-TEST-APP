---
status: todo
---

# Slice 04 — share card

**Spec.** Research §5.6, P6.

**Delivers.** An off-screen 360×640 dp card captured at 3× into a
1080×1920 PNG, shared through the Android Sharesheet together with the existing
message and `STORE_URL`. `react-native-view-shot` and `expo-sharing` installed
with `npx expo install`; a new EAS `development` build installed on the phone.

**Needs.** Slice 03. A dev build (~20 min on EAS) before the device checks.

**Tests.**
- The generated file, pulled with
  `adb exec-out run-as com.lhdiniz.testeqi cat <cache path>`, is 1080×1920 and
  under 500 KB.
- Tapping "Compartilhar resultado" opens the Sharesheet with an image preview
  (uiautomator shows the image chip, not "Compartilhando texto").
- Sent to a WhatsApp self-chat by the owner: the score reads at thumbnail size
  and the message carries the store link (owner confirms; the only manual
  check in the plan).
- Prebuild still applies `withKotlinMetadataCheck` and the
  `enforceNavigationBarContrast=false` theme item.

**Done when.** `python3 -I scripts/device/check_share_image.py` prints
`1080x1920 <size> KB OK` (written in this slice on top of the harness).

**If stuck.** If `captureRef` returns a blank image, mount the card on screen
behind the hero with `opacity: 0` instead of off-screen, and capture that.
