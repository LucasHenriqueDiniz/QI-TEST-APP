---
tags: [fetch, ui-redesign]
source: https://docs.expo.dev/versions/v57.0.0/sdk/haptics/
fetched: 2026-10-19
kind: primary
---

# Haptics — Expo SDK 57 (expo-haptics)

> Fetched 2026-10-19 · Expo's versioned doc for expo-haptics on SDK 57 (installed 57.0.3, see local-expo-haptics.md). Read to cross-check the API and the Android permission story.

Quotes extracted with WebFetch; short passages only.

## What it says

- Android implementation: "Android devices using Vibrator system service."
- "The `VIBRATE` permission is added automatically."
- Under `impactAsync`: "Android's `Vibrator` API is not recommended for implementing haptics feedback." Use `performAndroidHapticsAsync`, which "does not require `VIBRATE` permission."
- `performAndroidHapticsAsync(type)`: "Use the device haptics engine to provide physical feedback to the user." Takes an `AndroidHaptics` value (e.g. `Confirm`, `Reject`, `Toggle_On`, `Keyboard_Tap`).
- Methods listed: `impactAsync(style)`, `notificationAsync(type)`, `performAndroidHapticsAsync(type)`, `selectionAsync()`.
- iOS-only caveats: Taptic Engine does nothing when "Low Power Mode is enabled" or "User disabled the Taptic Engine in settings".

## What it does not say

- No Android-side caveat about the user's touch-feedback setting or battery saver.
- No statement on whether a config plugin or dev build is needed (the module is already in the app's dev build, so no action).
- The doc says `performAndroidHapticsAsync` does not need `VIBRATE`, but the package manifest still merges `android.permission.VIBRATE` (local-expo-haptics.md) — permission is present regardless.
