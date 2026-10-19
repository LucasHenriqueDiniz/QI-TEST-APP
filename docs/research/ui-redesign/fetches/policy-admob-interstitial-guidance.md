---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/6066980?hl=en
fetched: 2026-10-19
kind: primary
---

# Interstitial ad guidance - Google AdMob Help

> Fetched 2026-10-19 · AdMob Help Center entry page for interstitial implementation guidance; read to learn when an interstitial between "finish test" and "results" is acceptable and how long an interstitial can block the close button.

## What it says

Intro:

> "Interstitial ads provide rich interactive ads for users on mobile apps. Interstitial ads are designed to be placed between content, so they are best placed at natural app transition points. AdMob publishers should carefully implement interstitial ads to provide good user experiences and avoid accidental clicks."

> "Not following these guidelines may lead to invalid activity and/or may result in Google disabling ad serving to your app."

### Is an interstitial ad the correct ad format for my app?

> "Interstitial ads are best suited for apps with linear user experiences. There should be very clear starting and stopping points in an app. If you have an app that may not meet this criteria (e.g., utility apps like flashlight apps), consider using another AdMob ad format such as a banner ad."

### Think about the flow

> "Be thoughtful in placing interstitial ads within your mobile app so that they complement the natural flow of user engagement. Surprising users, presenting the users with too many ads, or obstructing their use of the app may lead to an overall poor user experience, an increase of accidental clicks on the ads, and ultimately drive users and advertisers away from your app. Remember that ads should never be the primary focus of the app, so don't compromise on the user experience in order to place interstitial ads within your app."

> "Also, note that some interstitial ads may have up to a 5-second delay before providing a close option. If high-engagement ads are enabled, interstitial video ads may have up to a 12-second delay. Additionally, some interstitial video ads served from third-party bidding sources may have up to a 30-second delay before providing a close option."

### Be mindful of invalid activity

> "When displaying full-screen interstitial ads on mobile devices keep in mind that mobile screens are often limiting in size compared to traditional desktop and laptop computer screens. Interstitial ads present the user with a full-screen ad that can result in accidental clicks if placed at the wrong time."

### Guidelines and best practices for interstitial ad placement

> "There are some questions to consider when implementing interstitial ads:
> - How will the user be engaging with my app at the time?
> - Will the user be surprised by the interstitial ad?
> - Is this the right time for an interstitial?"

> "After considering these questions, you should also review the guidelines for recommended implementations and disallowed implementations before placing an interstitial ad unit in your app."

## What it does not say

- Nothing specific to quizzes, tests or "results" screens; the rules are generic ("natural app transition points", "very clear starting and stopping points").
- Does not give a frequency number (that is on the disallowed-implementations page: one interstitial per two user actions).
- The close-button delays (5 s / 12 s / 30 s) are what Google may serve; the page does not say the app can shorten them. Compare with Google Play's 15-second closeability rule (see policy-play-ads.md), which the 30-second third-party-bidding case appears to exceed; the page does not reconcile the two.
