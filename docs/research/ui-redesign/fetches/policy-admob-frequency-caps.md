---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/6244508?hl=en
fetched: 2026-10-19
kind: primary
---

# Set frequency caps for apps or ad units - Google AdMob Help

> Fetched 2026-10-19 · AdMob frequency-capping setting; read for the "frequency" part of the interstitial question (e.g. a user who retakes the test several times).

## What it says

> "Frequency capping lets you limit the number of times ads appear to the same person. When you set frequency caps for an entire app or a specific ad unit, you specify a limit to the number of impressions allowed for an individual user during a period of time (minutes, hours, or days)."

> "For example, you can set a frequency cap to show no more than 2 impressions per 30 minutes."

> "- Frequency caps apply to Google demand and third-party ad sources.
> - A change to a frequency cap setting can take up to 24 hours to take effect.
> - A slight server delay can occasionally result in the frequency cap that you've set being exceeded.
> - The number of ads a user is served in an app is dependent upon both the ad unit-level and app-level frequency caps and which cap is reached first."

App-level cap: "enter the number of impressions you want to allow to appear per user across all interstitial, rewarded, or app open ad units in this app and select a period of time (the number of minutes, hours, or days)."

## What it does not say

- No recommended cap value; it is a console setting, not a policy threshold.
- Caps are not exact ("can occasionally result in the frequency cap ... being exceeded"), so a client-side guard is still needed if the design relies on "at most one interstitial per test".
