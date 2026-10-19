---
tags: [fetch, ui-redesign]
source: https://github.com/lottie-react-native/lottie-react-native
fetched: 2026-10-19
kind: primary
---

# lottie-react-native — README

> Fetched 2026-10-19 · Maintainer README on `master`. The repo now has `MIGRATION-7-TO-8.md` and `example-v8`, so the README describes v8; Expo SDK 57 bundles `lottie-react-native ~7.3.8` (local-expo-bundled-native-modules.md). Version mismatch noted.

Quotes extracted with WebFetch; short passages only.

## What it says

- "Requires **React Native 0.84 or newer** and the New Architecture." Older RN should use 7.3.x (paraphrase).
- dotLottie on native: "You need to modify your `metro.config.js` file accordingly by adding `lottie` extension to the `assetExts` array."
- Web needs "@lottiefiles/dotlottie-react".
- Troubleshooting: "Not all After Effects features are supported by Lottie." Check "the Logcat output on Android".

## What it does not say

- No performance notes, no APK size figure, no Expo/config-plugin notes.
- Does not say whether v7.3.8 (what SDK 57 pins) or v8 should be used with RN 0.86 + Expo 57; `npx expo install` would pick 7.3.8.
