---
tags: [fetch, ui-redesign]
source: https://developer.android.com/develop/ui/views/haptics/haptic-feedback
fetched: 2026-10-19
kind: primary
---

# Add haptic feedback to events (Android Developers)

> Fetched 2026-10-19 · Google's how-to for event haptics; read for the recommended API (View.performHapticFeedback) and the CONFIRM/REJECT semantics.

## What it says

> "One of the most basic use cases for haptics is to provide feedback to user interactions. Time pickers, the key press on a virtual keyboard, and text selection are common examples of good use cases for haptic feedback."

> "Use a View (recommended). This approach is action-oriented, has the widest support, and doesn't require the VIBRATE permission."

> "Caution: We strongly discourage using older Vibrator methods employing createOneshot or createWaveform, even if they appear to be supported on the device. These modes are often too loud for regular haptic feedback; use them only as a fallback if you need to highlight an extremely important action."

> "All haptic feedback methods respect the user's touch feedback settings by default."

> "The haptic constants defined by the HapticFeedbackConstants are focused on their functionality in an application, not the type of haptic effect performed."

> "By focusing on the functionality, you can enable haptic feedback for similar interactions. Users learn to associate different meanings to different haptic sensations over time."

CONFIRM / REJECT (Example 2: Submit button):

> "Haptic feedback use cases go beyond simulating a physical interaction with the device. They might also be used to convey an abstract meaning. For example, the general expectation for a CONFIRM effect is a short and light vibration while a REJECT might be a stronger feedback to signal failure. This is illustrated in the following example for a submit button feedback."

Code sample on the page (Kotlin):

```kotlin
submitButton.setOnClickListener { view ->
    val successful = performSubmit()
    if (successful) {
        view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
    } else {
        view.performHapticFeedback(HapticFeedbackConstants.REJECT)
    }
}
```

## What it does not say

- No Jetpack Compose equivalent on this page (the Compose haptics URL I tried, `developer.android.com/develop/ui/compose/touch-input/haptic-feedback`, returned 404; `.../haptics/haptics-ux-design` also 404).
- No guidance on how often to fire CONFIRM in a 30-item flow (habituation/annoyance), beyond the general "less is more" principle.
