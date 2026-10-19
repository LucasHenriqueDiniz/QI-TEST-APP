---
tags: [fetch, ui-redesign]
source: https://developer.android.com/reference/android/graphics/RenderEffect (and kotlin variant https://developer.android.com/reference/kotlin/android/graphics/RenderEffect) — attempted; WebSearch result snippets for "RenderEffect createBlurEffect Android API 31 performance cost"
fetched: 2026-10-19
kind: secondary
---

# Android RenderEffect (blur) — attempt and search snippets

> Fetched 2026-10-19 · Tried to read Android's own `RenderEffect` reference to quote API level and cost. WebFetch only returned the site navigation (page text 335–392k chars, class body never reached at offsets 0/100k/200k/300k/340k). Kept as a record of what could and could not be established.

## What it says

- From WebSearch result titles for the official reference pages: "Added in API level 31" (title of developer.android.com/reference/android/graphics/RenderEffect and localized variants). That is the only official fact obtained.
- WebSearch summary of the official reference (not read directly): the two-radius `createBlurEffect` overload blurs "the contents of the android.graphics.RenderNode that this RenderEffect is installed on".
- Secondary (Styling Android blog, 2021, via WebSearch summary; the page itself returned HTTP 500 when fetched): the GPU performs the effect, processing happens only when the relevant part of the UI hierarchy is invalidated, and CPU work lands on the RenderThread. The author observed no lag in one informal test on an unspecified device.
- Expo's SDK 57 doc (perf-expo-blur-sdk57.md) is the primary statement relevant to this app: efficient blur needs the RenderNode API from SDK 31.

## What it does not say

- No official cost figure for `RenderEffect` blur, and nothing on how cost scales with radius or blurred area.
- Not verified on the Galaxy A15 (Mali-G57 MC2). The "re-blur on invalidation" behaviour means that any animation underneath a blur (count-up, curve fill, confetti) re-runs the blur every frame — inference, not measured.
