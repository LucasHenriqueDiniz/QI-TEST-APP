---
tags: [fetch, ui-redesign]
source: https://developers.google.com/admob/android/banner/collapsible?hl=en
fetched: 2026-10-19
kind: primary
---

# Use collapsible banners | Android | Google for Developers

> Fetched 2026-10-19 · Google's guide to collapsible banners; read to judge whether a collapsible banner is compatible with a test screen that has a pinned Confirm button.

## What it says

> "Collapsible banner ads are banner ads that are initially presented as a larger overlay, with a button to collapse them to the originally requested banner size. Collapsible banner ads are intended to improve performance of anchored ads that are otherwise a smaller size."

> "If the loaded ad is a collapsible banner, the banner shows the collapsible overlay immediately once it's placed in the view hierarchy"

Placement values: "top — The top of the expanded ad aligns to the top of the collapsed ad." / "bottom — The bottom of the expanded ad aligns to the bottom of the collapsed ad."

### Ads refreshing behavior

> "For apps that configure auto-refresh for banner ads in the AdMob web interface, when a collapsible banner ad is requested for a banner slot, subsequent ad refreshes won't request collapsible banner ads. This is because showing a collapsible banner on every refresh could have a negative impact on user experience."

> "Collapsible banner ads are only available for Google demand. Ads served through mediation show as normal, non-collapsible banner ads."

## What it does not say

- No policy statement about where collapsible banners may be used. But because the expanded state is "a larger overlay" that appears "immediately", on the test screen it would overlay the pinned "Confirmar" area — the situation the Publisher Policies forbid ("overlay or are adjacent to navigational or other action items"). The page itself does not draw that conclusion.
