---
status: done
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

**Result (2026-10-29, A15, dev build 68b96b4a).**

`components/ShareCard.tsx` sits off-screen on Results (left −10 000 dp; the
capture works there, no need for the opacity-0 fallback) and is captured at
1080×1920. The card: brand mark and "Teste de QI", "Meu QI estimado", the
score at 140, the band, the tier chip, "Melhor que N%" (from 30% up, as in
the hero), a white bell curve with the `#FFC857` marker, "Ponto forte",
"Faça o seu grátis no Google Play" and the disclaimer.

**Changed from the spec: no message with the image.** expo-sharing 57.0.24
on Android puts only the file in the intent (`EXTRA_STREAM`,
`SharingModule.kt` line 118), no `EXTRA_TEXT`, so the store link cannot
travel with the image; the card names the store instead. If the capture or
the file share fails, the old text share with the link runs. Sending both
needs another native module (e.g. react-native-share) and a new build:
owner's call.

| check | result |
|---|---|
| `scripts/device/check_share_image.py` (new): tap share, the PNG from the dev `[share] image` logcat line, copied out with `run-as` | `1080x1920 275 KB OK`: Sharesheet open with an image preview, not "Compartilhando texto" |
| prebuild: `enforceNavigationBarContrast=false` | in `expo config --type introspect` |
| prebuild: `withKotlinMetadataCheck` | still in `app.json`; the EAS build of today compiled `react-native-google-mobile-ads`, which fails without it (the plugin's own note) |
| WhatsApp self-chat, score readable at thumbnail size | owner's manual check, not done |
