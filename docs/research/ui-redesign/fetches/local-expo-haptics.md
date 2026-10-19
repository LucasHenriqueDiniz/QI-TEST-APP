---
tags: [fetch, ui-redesign]
source: /Users/maxter/dev/pessoal/QI-TEST-APP/node_modules/expo-haptics (package.json, build/Haptics.d.ts, build/Haptics.types.d.ts, README.md, CHANGELOG.md, android/src/main/AndroidManifest.xml, android/src/main/java/expo/modules/haptics/*.kt)
fetched: 2026-10-19
kind: primary
---

# expo-haptics 57.0.3 (installed copy)

> Fetched 2026-10-19 · The exact expo-haptics build the app ships (`"expo-haptics": "~57.0.3"`, installed `"version": "57.0.3"`). Read to confirm which haptics APIs exist and what they cost on Android, without relying on the `latest` web doc.

## What it says

### Exported API — `build/Haptics.d.ts` (verbatim)

```ts
import { NotificationFeedbackType, ImpactFeedbackStyle, AndroidHaptics } from './Haptics.types';
export declare function notificationAsync(type?: NotificationFeedbackType): Promise<void>;
export declare function impactAsync(style?: ImpactFeedbackStyle): Promise<void>;
export declare function selectionAsync(): Promise<void>;
/**
 * Use the device haptics engine to provide physical feedback to the user.
 *
 * @platform android
 */
export declare function performAndroidHapticsAsync(type: AndroidHaptics): Promise<void>;
export { NotificationFeedbackType, ImpactFeedbackStyle, AndroidHaptics };
```

JSDoc on `notificationAsync` / `impactAsync` (verbatim):

> "A notification feedback type that on Android is simulated using [`Vibrator`](https://developer.android.com/reference/android/os/Vibrator)"

> "@see Android's `Vibrator` API is not recommended for implementing haptics feedback. **Instead, you should use [`performAndroidHapticsAsync`](#hapticsperformandroidhapticsasynctype), which is similar to iOS haptic feedback and does not require `VIBRATE` permission.**"

### Enums — `build/Haptics.types.d.ts` (verbatim, doc comments trimmed)

```ts
export declare enum NotificationFeedbackType { Success = "success", Warning = "warning", Error = "error" }
export declare enum ImpactFeedbackStyle { Light = "light", Medium = "medium", Heavy = "heavy", Soft = "soft", Rigid = "rigid" }
/** @platform android */
export declare enum AndroidHaptics {
    Confirm = "confirm",
    Reject = "reject",
    Gesture_Start = "gesture-start",
    Gesture_End = "gesture-end",
    Toggle_On = "toggle-on",
    Toggle_Off = "toggle-off",
    Clock_Tick = "clock-tick",
    Context_Click = "context-click",
    Drag_Start = "drag-start",
    Keyboard_Tap = "keyboard-tap",
    Keyboard_Press = "keyboard-press",
    Keyboard_Release = "keyboard-release",
    Long_Press = "long-press",
    Virtual_Key = "virtual-key",
    Virtual_Key_Release = "virtual-key-release",
    No_Haptics = "no-haptics",
    Segment_Tick = "segment-tick",
    Segment_Frequent_Tick = "segment-frequent-tick",
    Text_Handle_Move = "text-handle-move"
}
```

Doc comments of interest (verbatim):

- `Confirm`: "A haptic effect to signal the confirmation or successful completion of a user interaction."
- `Reject`: "A haptic effect to signal the rejection or failure of a user interaction."
- `Segment_Frequent_Tick`: "This constant is expected to be very soft, so as not to be uncomfortable when performed a lot in quick succession. If the device can't make a suitably soft vibration, then it may not make any vibration."

### Android implementation — `android/src/main/java/expo/modules/haptics/HapticsModule.kt`

`notificationAsync`, `selectionAsync`, `impactAsync` all call a private `vibrate()` that does:

```kotlin
vibrator.vibrate(VibrationEffect.createWaveform(type.timings, type.amplitudes, -1))
```

`performAndroidHapticsAsync` (native name `performHapticsAsync`) does:

```kotlin
val view = appContext.currentActivity?.findViewById<View>(android.R.id.content)
view?.performHapticFeedback(type.toHapticFeedbackType())
}.runOnQueue(Queues.MAIN)
```

with the comment: "`View.performHapticFeedback` is main-thread affine, and an `AsyncFunction` without a queue runs on the modules dispatcher, where the call is a silent no-op."

`HapticsRecord.kt` resolves the constant by reflection on `HapticFeedbackConstants`: "All are available on api 34 and above, some more are only available on api 30 and above". On a missing constant it falls back to `CLOCK_TICK`, `CONTEXT_CLICK`, `KEYBOARD_TAP`, `LONG_PRESS`, `VIRTUAL_KEY`, otherwise throws `HapticsNotSupportedException` ("A haptics engine is not available on this device").

Waveforms used on Android (from `HapticsNotificationType.kt` / `HapticsImpactType.kt`): `success` = timings `0, 40, 100, 40` amplitudes `0, 50, 0, 60`; `heavy` = timings `0, 60` amplitude `0, 70`; `light`/`soft` = `0, 50` amplitude `0, 30`.

### Permission — `android/src/main/AndroidManifest.xml` (verbatim)

```xml
<uses-permission android:name="android.permission.VIBRATE"/>
```

README: "This module requires permission to control vibration on the device, it's added automatically." `VIBRATE` is a normal (install-time) permission, so no runtime prompt — but it is merged into the app manifest regardless of which function the app calls.

### CHANGELOG (verbatim)

> "## 57.0.2 — 2026-08-26 … [android] Fix `performAndroidHapticsAsync` doing nothing by running it on the main queue. ([#49263](https://github.com/expo/expo/pull/49263) …)"

> "## 57.0.3 — 2026-09-11 _This version does not introduce any user-facing changes._"

## What it does not say

- Whether `performHapticFeedback` respects the user's system "Touch feedback / vibration intensity" setting on Samsung One UI (Android generally does for `performHapticFeedback`, the `Vibrator` path less so) — not stated in the package.
- Which `AndroidHaptics` constants actually produce a distinct effect on the Galaxy A15 (it has a basic ERM/LRA motor; spec not in this package). `Confirm`/`Reject`/`Segment_*` need API 30+/34+; the A15 on Android 16 has them, but the felt quality is device-dependent.
- No guidance about rate-limiting haptics during a count-up animation.
- The README still links the `latest` doc, not an SDK 57-pinned page.
