---
tags: [fetch, ui-redesign]
source: https://developers.google.com/admob/android/interstitial?hl=en
fetched: 2026-10-19
kind: primary
---

# Interstitial ads | Android | Google for Developers

> Fetched 2026-10-19 · Google's Android developer guide for interstitials (the native SDK that react-native-google-mobile-ads wraps); read for when to call show().

## What it says

Page summary:

> "Interstitial ads are full-screen ads suitable for display at natural transition points in an app, such as between levels in a game."

> "Show the interstitial ad using the show() method, ideally during a pause in the app's flow."

Body:

> "Interstitial ads are full-screen ads that cover the interface of their host app. They're typically displayed at natural transition points in the flow of an app, such as between activities or during the pause between levels in a game. When an app shows an interstitial ad, the user has the choice to either tap on the ad and continue to its destination or close it and return to the app."

### Show the ad

> "Interstitial ads should be displayed during natural pauses in the flow of an app. Between levels of a game is a good example, or after the user completes a task."

Banner at the top of the page: "Google Mobile Ads SDK is in maintenance mode. For the latest updates and features, migrate and set up GMA Next-Gen SDK." (The page is under "Mobile Ads SDK (Legacy) for Android".)

## What it does not say

- No "best practices" section in the current version (older versions had one); the policy detail lives in the AdMob Help Center pages.
- "After the user completes a task" is the closest wording to "after finishing the test", but the page does not say whether the ad should precede or follow the result display.
- Does not cover react-native-google-mobile-ads 16.4.0; which native SDK (legacy vs Next-Gen) that library wraps was not checked here.
