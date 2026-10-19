---
tags: [fetch, ui-redesign]
source: https://developers.google.com/admob/android/banner?hl=en
fetched: 2026-10-19
kind: primary
---

# Set up banner ads | Android | Google for Developers

> Fetched 2026-10-19 · Google's Android banner guide (https://developers.google.com/admob/android/banner/anchored-adaptive now 301-redirects here); read for anchored adaptive banner behaviour and height.

## What it says

> "Banner ads are rectangular ads that occupy a portion of an app's layout. Anchored adaptive banners are fixed aspect ratio ads that stay on screen while users are interacting with the app, either anchored at the top or bottom of the screen."

### Set the ad size

> "Large adaptive banners provide a larger format designed for non-scrolling layouts. Compared to standard anchored adaptive banners, these banners allow for a taller maximum height, up to 20% of screen height, and between 50 and 150dp. This increased space is optimized for video content."

> "Set an ad size smaller than or equal to the device screen size. To determine the maximum screen size, use the Resources.getDisplayMetrics method. The AdSize object dimensions use density-independent pixels (dp)."

(The current sample code uses `AdSize.getLargeAnchoredAdaptiveBannerAdSize(this, 360)`.)

### Refresh an ad

> "Note: When setting a refresh rate in the AdMob UI, the automatic refresh occurs only if the banner is visible on screen."

## What it does not say

- The standard (non-large) anchored adaptive height bounds are not stated on this page; they are on the Unity page (policy-dev-unity-anchored-adaptive.md: 50 dp min, max 15% of device height or 90 dp).
- Which size react-native-google-mobile-ads' `ANCHORED_ADAPTIVE_BANNER` maps to (standard vs large) was not verified here — it decides whether the layout must reserve up to 90 dp or up to 150 dp.
- No placement/spacing guidance; that is on the AdMob Help Center pages.
