---
tags: [fetch, ui-redesign]
source: https://developer.android.com/reference/android/view/HapticFeedbackConstants
fetched: 2026-10-19
kind: primary
---

# HapticFeedbackConstants (Android API reference)

> Fetched 2026-10-19 · The API reference for the action-oriented haptic constants; read to pick constants (and their minimum API levels) for option selection, answer commit, milestone and result reveal.

## What it says

Definitions (verbatim), with "Added in API level" as shown on the page:

| Constant | API | Definition |
|---|---|---|
| CONFIRM | 30 | "A haptic effect to signal the confirmation or successful completion of a user interaction." |
| REJECT | 30 | "A haptic effect to signal the rejection or failure of a user interaction." |
| SEGMENT_TICK | 34 | "The user is switching between a series of potential choices, for example items in a list or discrete points on a slider. See also SEGMENT_FREQUENT_TICK for cases where density of choices is high, and the haptics should be lighter or suppressed for a better user experience." |
| SEGMENT_FREQUENT_TICK | 34 | "The user is switching between a series of many potential choices, for example minutes on a clock face, or individual percentages. This constant is expected to be very soft, so as not to be uncomfortable when performed a lot in quick succession." |
| CLOCK_TICK | 21 | "The user has pressed either an hour or minute tick of a Clock." |
| CONTEXT_CLICK | 23 | "The user has performed a context click on an object." |
| TOGGLE_ON | 34 | "The user has toggled a switch or button into the on position." |
| TOGGLE_OFF | 34 | "The user has toggled a switch or button into the off position." |
| GESTURE_START / GESTURE_END | 30 | "The user has started a gesture (e.g. on the soft keyboard)." / "The user has finished a gesture (e.g. on the soft keyboard)." |
| GESTURE_THRESHOLD_ACTIVATE | 34 | "...This constant indicates that the user's motion has just passed the threshold for the action to be activated on release." |
| VIRTUAL_KEY | 5 | "The user has pressed on a virtual on-screen key." |
| LONG_PRESS | 3 | "The user has performed a long press on an object that is resulting in an action being performed." |
| NO_HAPTICS | 34 | "No haptic feedback should be performed." |

Related, from the Android haptics API reference page (https://developer.android.com/develop/ui/views/haptics/haptics-apis, same session):

> "The HapticFeedbackConstants class provides action-based constants to allow apps to add haptic feedback that's consistent across the device experience, rather than each app having different effects for common actions."

> "Using the View.performHapticFeedback method with these constants doesn't require any special permissions for the app."

> "The only compatibility consideration is the SDK-level of the specific constant for the action. There is no need to provide fallback behavior when using HapticFeedbackConstants."

## What it does not say

- No constant is named for "answer selected in a quiz"; mapping is an inference: SEGMENT_TICK (API 34) for moving between a set of options, CONFIRM (API 30) for committing an answer / finishing the test. CLOCK_TICK is specifically defined for clock ticks, so using it for option changes is a reuse, not the documented intent.
- No guidance on how constants feel on low-end actuators common in the Brazilian Android market; the reference does not describe intensity.
- Below API 30, CONFIRM/REJECT are unavailable; the reference does not suggest which older constant to fall back to (VIRTUAL_KEY or CONTEXT_CLICK are plausible choices, not documented ones).
