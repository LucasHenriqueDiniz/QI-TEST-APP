---
tags: [fetch, ui-redesign]
source: https://developers.google.com/admob/unity/banner/anchored-adaptive?hl=en
fetched: 2026-10-19
kind: primary
---

# Integrate anchored adaptive banners | Unity | Google for Developers

> Fetched 2026-10-19 · Google's Unity guide for anchored adaptive banners; read only because it is the Google page that states the anchored adaptive height bounds (needed to size the reserved banner slot).

## What it says

Page summary:

> "Adaptive banners use a user-specified width and a Google-optimized height, with height limits between 50 and 90 density-independent pixels or 15% of the device's height."

> "Adaptive banners function best when they utilize the full available width, while considering safe areas and display cutouts."

Body:

> "Adaptive banners provide a flexible way to display ads, with a user-specified width and a Google-optimized height. The minimum banner height is 50 density-independent pixels, while the maximum is capped at 15% of the device's height or 90 density-independent pixels, whichever is smaller."

> "These banners perform best when they use the full available width, but you should always consider safe areas and display cutouts that might obstruct visibility when setting the banner's width."

## What it does not say

- This is the Unity plugin page; the Android page does not restate the standard anchored bounds (it documents the "large" variant: 50–150 dp, up to 20% of screen height). The bounds come from the same AdMob size API, but this page does not confirm that for Android or React Native.
