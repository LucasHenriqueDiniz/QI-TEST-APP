---
tags: [fetch, ui-redesign]
source: https://developer.android.com/develop/ui/views/haptics/haptics-principles
fetched: 2026-10-19
kind: primary
---

# Haptics design principles (Android Developers)

> Fetched 2026-10-19 · Google's Android guidance on when and how strongly to use haptics; read to decide haptics on answer selection, question advance and the result reveal.

## What it says

> "When it comes to haptic feedback on mobile devices, less is more. Too much vibration can be annoying and even numbing to the hands, as the device is usually in-hand with the user's full attention. It can also be distracting from the user's intended task, which may lead the user to quickly turn off all haptics."

Use cases:

> "To confirm a state change in the device following a user action. Examples include click feedback for a button press, unlocking a phone, fingerprint acceptance or rejection, or activating the camera."

> "To delight the user with effects. Such effects could enhance an ongoing user action or emulate physical interaction. Examples include scroll feedback, a slider snapping into place, or haptic effects in sync with animations, sounds, videos, and games."

Clear vs rich vs buzzy:

> "Clear haptics refers to crisp and clean sensations associated with a discrete event, such as button presses."

> "Android has predefined clear haptic effects in VibrationEffect. However, in general apps should use action-oriented constants from HapticFeedbackConstants to ensure consistency of effect and action across the device."

> "The other advantage of action-oriented constants is that the platform can provide fallback behavior if a more complex effect isn't supported by the user's device."

> "Caution: Rich haptics are supported by fewer devices, so it's important to have a fallback strategy."

> "Important: Given the choice of buzzy haptics or no haptics for touch feedback, choose no haptics."

Guidelines:

> "Favor rich and clear haptics over buzzy haptics. / Be consistent, both with the system and the app design. / Be mindful of frequency of use, and importance."

> "If your action is covered by a predefined action present in HapticFeedbackConstants, use that constant. This ensures a consistent user interaction experience, which is particularly valuable as an accessibility consideration."

> "Haptic effects applied to very frequent events, like scrolling or moving a text handle, should be very subtle to provide a pleasant overall experience. More important events, like refreshing a page or submitting a form, should be stronger than changing a toggle or scrolling on a list, for example."

> "Combine both concepts to create effects that become stronger as the interaction reaches a target, for example gradually increasing the amplitude of a sequence of ticks with dragging, dropping or snapping actions."

> "If a particular interaction, like form submission or in-app navigation, has haptic feedback, make sure the same effect is applied to all similar interactions. This helps users to associate a meaning to a particular haptic feedback."

> "We strongly recommend co-design of visual, audio, and haptic effects. Make it harmonious or congruent with visual animations and sound patterns."

> "Conversely, a haptic feedback that is played out of sync or that feels inconsistent with visual and audio effects can be a bit unsettling to the user. In some cases, the user may perceive the haptic actuator to be broken."

> "A good keyclick haptic feedback signal should last between 10 to 20 milliseconds. However, the actuator may continue to ring for another 20 to 50 milliseconds after a 20-millisecond input to the actuator has ended. Therefore, it's best to avoid single-shot vibrations for this type of feedback."

## What it does not say

- It does not map named constants (CONFIRM, REJECT, SEGMENT_TICK…) to specific scenarios; that is in `ux-android-haptic-feedback.md` and `ux-android-haptic-constants.md`.
- Nothing on quizzes/tests specifically, nor on whether haptics improve engagement or completion (no metrics on this page).
- In a test with no right/wrong feedback during the round, "rejection" haptics have no natural trigger; the page doesn't address feedback for neutral selections.
