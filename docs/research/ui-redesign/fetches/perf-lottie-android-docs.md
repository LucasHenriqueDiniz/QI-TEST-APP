---
tags: [fetch, ui-redesign]
source: https://raw.githubusercontent.com/airbnb/lottie/master/android.md
fetched: 2026-10-19
kind: primary
---

# Lottie for Android — docs (android.md, Performance section)

> Fetched 2026-10-19 · Source markdown of airbnb.io/lottie's Android page (the docsify site itself is not fetchable; `android/performance.md` does not exist — 404). Not versioned; lottie-react-native 7.3.8 (SDK 57) wraps lottie-android. Read for the Android rendering cost of Lottie.

Quotes extracted with WebFetch; short passages only.

## What it says

- "Masks and mattes on android have the larges performance hit." (sic) Paraphrase: cost scales with the overlap area; smaller masks/mattes cost less. Hardware acceleration can give "a several X performance improvement."
- Hardware acceleration is "disabled out of the box" (lacks anti-aliasing and some features) and depending on the animation it "may actually be less performant."
- Merge paths: KitKat+ only; "There is also some performance overhead in using them."
- Sample app has "a real time render graph that can be enabled from the menu in the top right." with 16.66 ms / 33.333 ms guides (60/30 fps). Per-layer render times available; for slow layers "try optimizing their shapes" and remove masks/mattes/merge paths.
- "For debugging purposes, Lottie can outline all masks and mattes in your animation." (`setOutlineMasksAndMattes`).
- Caching: "All Lottie animations are cached with a LRU cache by default."
- Images: image assets are "an order of magnitude larger than their equivalent vector animation."
- Size (separate section, paraphrase): about 1600 methods and 287 KB uncompressed for lottie-android.

## What it does not say

- No size figure for lottie-react-native as a whole (JS + native + the animation JSON files themselves).
- `RenderMode` values (AUTOMATIC/HARDWARE/SOFTWARE) are not named in this section; they appear in the lottie-react-native API doc (perf-lottie-react-native-api.md). A WebSearch snippet of an older lottie-android commit (#1072) says AUTOMATIC uses a heuristic for >4 masks/mattes — not read first-hand.
- No guidance specific to low-end GPUs like Mali-G57 MC2.
