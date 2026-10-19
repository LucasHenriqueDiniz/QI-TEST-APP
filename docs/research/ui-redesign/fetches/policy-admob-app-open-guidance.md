---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/9341964?hl=en
fetched: 2026-10-19
kind: primary
---

# App open ad guidance and best practices - Google AdMob Help

> Fetched 2026-10-19 · AdMob guidance for app open ads; read for the "pre-roll on app open" question and for its rule about not stacking full-screen ads.

## What it says

> "This is an article about App open ads in AdMob, which are a specialized format for monetizing your app's loading screens. They appear when a user opens the app or switches back to it. App open ads are designed for a seamless user experience during app load times. Also, app open ads may have up to a 2-second delay before providing a close option. If high-engagement ads are enabled, app open ads may have up to a 5-second delay."

### Ad placement

> "- App open ad units should only appear when the user opens or switches back to an app.
> - Integrate app open ads into your splash or loading screens.
> - If you don't have a splash screen, display ads immediately on app open or switch."

### Frequency

> "Apps with frequent opens (more than once every 4 hours) see the best performance from app open ads. Consider other ad formats if your app doesn't meet this usage pattern."

### Avoid conflicts

> "- Don't display ads immediately before or after app open ads.
> - Don't display app open ads on top of other ads (for example, content with banner ads)."

#### Policy compliance

> "App open ads require compliance with AdMob policies and restrictions, including ad placement policies. Apps within Google Play's Designed for Families program can't use app open ads."

Discouraged examples: "the ad is placed after the loading screen and there is no content visible under the ad"; "the ad is placed after the app content is shown. The app open ad should appear before the user can interact with the app's content."

## What it does not say

- Nothing about combining an app open ad with a later end-of-test interstitial in the same session, beyond "Don't display ads immediately before or after app open ads".
- The "more than once every 4 hours" usage pattern suggests app open ads are a poor fit for a take-the-test-once app, but the page does not say so for any specific category.
