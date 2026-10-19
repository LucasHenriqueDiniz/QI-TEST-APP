---
tags: [fetch, ui-redesign]
source: https://developer.android.com/topic/performance/rendering/overdraw
fetched: 2026-10-19
kind: primary
---

# Reduce overdraw — Android Developers

> Fetched 2026-10-19 · Android's official rendering guide (current, Compose-oriented, not versioned). Read because stacked full-screen gradients, glows, scrims and translucent cards are alpha-heavy on a Mali-G57 MC2.

Quotes extracted with WebFetch; short passages only.

## What it says

- "When an app draws the same pixel more than once within a single frame, this is called _overdraw_."
- "Overdraw becomes a performance problem when it wastes GPU time to render pixels that don't contribute to what the user sees on the screen."
- "On less performant GPUs, available fill-rate—the speed at which the GPU can fill the frame buffer—can be low."
- "Rendering transparent pixels on screen, known as _alpha rendering_, is a key contributor to overdraw."
- "Transparent objects require existing pixels to be drawn first, so that the right blending equation can occur."
- "Visual effects like transparent animations, fade-outs, and drop shadows involve some transparency, and can therefore contribute significantly to overdraw."
- Fixes: "Set the window background to the main background color of your app and leave all containers above it with no background values defined."; "Reduce transparency."
- Debug: "The Debug GPU Overdraw tool uses color-coding to show the number of times your app draws each pixel on the screen."
- Example (paraphrase): an opaque-looking colour (`Color.Black.copy(alpha = 0.5f)` on text) is cheaper than `Modifier.alpha(0.5f)` on the whole composable.

## What it does not say

- Nothing React Native-specific; RN views map to Android Views, so the principle carries over — inference.
- No numbers for how many overdraw layers a given GPU sustains at 60/90 Hz.
- Linear gradients are not discussed specifically (a full-screen opaque gradient is one layer; a translucent gradient overlay adds one).
