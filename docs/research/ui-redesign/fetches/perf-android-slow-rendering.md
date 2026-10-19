---
tags: [fetch, ui-redesign]
source: https://developer.android.com/topic/performance/vitals/render
fetched: 2026-10-19
kind: primary
---

# Slow rendering — Android Developers (Android vitals)

> Fetched 2026-10-19 · Android's official doc on frame budget and jank (not versioned). Read for the 60/90 Hz budgets (the A15 panel is 90 Hz) and RenderThread costs relevant to SVG clipPath and large bitmaps.

Quotes extracted with WebFetch; short passages only.

## What it says

- "your app must render frames in under 16ms to achieve 60 frames per second (fps)."
- "If you overrun this window by 1ms, it doesn't mean that the frame is displayed 1ms late, but Choreographer drops the frame entirely."
- "If you are trying to achieve 90 fps, then this window drops to 11ms, and for 120 fps it's 8ms."
- Slow frames: "Between 16ms and 700ms."; "Frozen frames are UI frames that take longer than 700ms to render."
- "Android displays bitmaps as OpenGL textures, and the first time a bitmap is displayed in a frame, it's uploaded to the GPU." / "Ensure that the bitmap being displayed isn't significantly bigger than the area on screen it's showing in."
- "Some Canvas operations are cheap to record but trigger expensive computation on the RenderThread."
- "clipPath(Path) triggers expensive clipping behavior, and must generally be avoided."
- "If you have large paths, avoid editing them from frame to frame, so that they can be cached and drawn efficiently."
- "If significant layout is happening on each frame, it's possible that you're animating layout, which is likely to cause dropped frames."

## What it does not say

- Shadows/elevation are not discussed on this page.
- Does not say how react-native-svg implements `<ClipPath>` on Android (whether it hits `Canvas.clipPath(Path)`); a rectangular clip is the cheap case, an arbitrary path the expensive one — inference.
