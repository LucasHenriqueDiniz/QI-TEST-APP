---
tags: [fetch, ui-redesign]
source: https://www.nngroup.com/articles/animation-duration/
fetched: 2026-10-19
kind: secondary
---

# Executing UX Animations: Duration and Motion Characteristics (NN/g, Page Laubheimer, 2020-02-09)

> Fetched 2026-10-19 · NN/g guidance on animation durations, easing and reduced motion; read to budget the per-question transition (×30 per round) and the one-off result reveal.

## What it says

> "It's important to note that excessive use of motion and animation is an accessibility issue: animations with hard cuts between colors or flashing can trigger seizures in epileptic users. [...] Restraint is important, and you should respect those users who have set their browser or device to "reduce motion" by removing animations."

> "Also, keep in mind how frequently users will encounter the animation: the more frequent the animation, the more subtle and shorter you'll want it to be."

> "In general, the duration of most animations should be in the range of 100–500 ms, depending on complexity and on how far the element is traveling. As a rule of thumb, look for the shortest time that an animation can take without being jarring. It is far more common for animations to be too long than too short."

> "Simple feedback animations, such as showing a checkbox or toggle switch, should be roughly 100 ms (0.10 seconds) in total duration. This duration feels immediate to users and creates the illusion of physically manipulating the object."

> "When animation involves substantial screen changes, such as when a modal window moves into view, a duration of 200–300 ms can be appropriate."

> "At 500ms, animations start to feel like a real drag for users — they become cumbersome and annoying. In most cases, a range of 100–400 ms is appropriate, with 400ms being a very slow animation, to be used only for big movements across large screens."

> "Note that animating objects appearing or entering the screen usually need a subtly longer duration than objects disappearing or exiting the screen: a popup window may take 300ms to appear, but only 200 or 250ms to disappear."

> "Google's Material Design toggle switch uses all the following animations to form a short (100ms) bit of feedback for a microinteraction"

> "When adding an item to the cart in Seamless, a small animated checkmark moves from the Add to Bag to the cart in the bottom right. [...] However, this animation is long and very likely to be annoying with repetition, as it is an exaggerated motion across the entire screen."

> "Most frequently, you'll want to use an ease-out animation, that starts quickly but slows down."

## What it does not say

- Written for duration/easing curves; it predates M3's spring-based physics (springs have no fixed duration — see `ux-m3-motion-physics.md`).
- Gives no guidance for deliberately long "celebration" moments (count-up, curve fill) that happen once; its 500 ms ceiling is for repeated UI motion, so the one-off result reveal is outside its scope.
