---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/6201362?hl=en
fetched: 2026-10-19
kind: primary
---

# Disallowed interstitial implementations - Google AdMob Help

> Fetched 2026-10-19 · AdMob's list of interstitial placements that violate policy; read to check whether the "finish test → interstitial → results" flow is allowed.

## What it says

### App load or exit

> "Do not place interstitial ads on app load and when exiting apps as interstitials should only be placed in between pages of app content. Ads should not be placed in applications that are running in the background of the device or outside of the app environment. It should be clear to the user which application the ad is associated with or implemented on. We recommend placing an app open ad when loading an app or switching back to it."

### Repeated or recurring interstitials

> "Don't overwhelm users with interstitial ads. Repeated interstitial ads often lead to poor user experiences and accidental clicks."

> "Examples of non-compliant implementations include but are not limited to:
> - Placing an interstitial ad after every user action, including but not limited to clicks, swipes, etc. You should place no more than one interstitial ad after every two user actions within your app. Please note that this requirement also applies when a user clicks the Back button within the app.
> - Placing an interstitial ad immediately after another interstitial ad was shown to and closed by the user."

Disallowed example: Recurring interstitials

> "Apps should not trigger an interstitial ad every time a user clicks within the app."

Disallowed example: Interstitials that impact navigation

> "Ads should not be placed in a way that prevents viewing the app's core content. Ads should not be placed in a way that interferes with navigating or interacting with the app's core content and functionality."

### Interstitials that unexpectedly launch

> "Don't surprise users with interstitial ads. Placing interstitial ads so that they suddenly appear when a user is focused on a task at hand (e.g. playing a game, filling out a form, reading content) may lead to accidental clicks and often creates a frustrating user experience. For this reason, interstitial ads should only be implemented at logical breaks in between your app's content (e.g. pages, stages, or levels) to ensure that the user is prepared to engage with the ad."

> "A common issue is that even though you may intend for the ad to load in between page content, the ad itself appears shortly after a new page of content has loaded due to carrier latency. To prevent this from happening, we recommend you pre-load the interstitial in advance."

Disallowed examples shown (images only, captions): "Interstitial launches when opening app", "Interstitial launches after page load".

## What it does not say

- Does not mention quiz/test results screens by name. The relevant rules for the IQ app are: no interstitial while the user is "focused on a task at hand" (i.e. mid-test), only "at logical breaks", and never one that pops up *after* the results page has loaded (the "launches after page load" example) — hence pre-load.
- Does not define what counts as a "user action" for the one-per-two-actions rule beyond "clicks, swipes, etc." and the Back button.
- No minimum time between interstitials in seconds; frequency capping is a separate AdMob setting (policy-admob-frequency-caps.md).
