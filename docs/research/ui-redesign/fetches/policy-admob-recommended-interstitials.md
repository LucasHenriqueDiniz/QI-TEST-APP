---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/6201350?hl=en
fetched: 2026-10-19
kind: primary
---

# Recommended interstitial implementations - Google AdMob Help

> Fetched 2026-10-19 · AdMob's positive guidance for interstitial placement; the key page for "is an interstitial before the results screen OK, and should there be a 'calculating' step first?".

## What it says

### In between page content, levels, or stages

> "If your app is a game with different levels or stages, consider placing an interstitial ad in between one or more of these stages. A break between levels provides a natural stopping point for the user and allows them to properly evaluate an interstitial ad. If your app is not a game but has many pages or sections, consider placing an interstitial ad after a number of screens or actions taken. Avoid placing an interstitial ad every single time the user does an action."

> "It is recommended that interstitial ads appear before the break page rather than after. Break pages often require a user to tap a Next button (or equivalent). Ads between levels and after a Next button can be surprising. It is strongly recommended that interstitial ads between levels or stages show explicitly before any Continue or Next level buttons. This behavior may reduce accidental ad clicks from users who unintentionally click the ad instead of the Next button."

> "If an app encourages frequent and/or repeated tapping by users, it is recommended that a delay is inserted after the end of a level and before the display of an interstitial ad. This delay could take the form of a loading or please wait screen, or a progress-bar/wheel. This offers users a chance to stop tapping the screen and consider carefully what appears next, and may help reduce accidental clicks."

### Account for potential ad latency

> "Carrier network latency can potentially affect delivery of interstitial ads in your mobile app. This latency may cause the ad to appear on the user's screen at inopportune or unintended times. Consider what the user may be doing in the time window that the interstitial ad is expected to appear, and consider pre-loading your interstitial ads to reduce latency when displaying them to your users."

## What it does not say

- No duration for the recommended delay / "please wait" screen (no seconds given).
- Does not say whether that delay screen may itself carry a banner. The Publisher Policies say Google-served ads are not allowed on screens "used for alerts, navigation or other behavioral purposes" or "without publisher-content" (policy-publisher-screens-without-content.md), so a pure "calculating…" screen should not show the banner.
- "Before the break page rather than after" is AdMob's preference; Google Play's own example of a non-interrupting interstitial is "after the score screen in a game app" (policy-play-ads.md). The two are not reconciled on either page.
