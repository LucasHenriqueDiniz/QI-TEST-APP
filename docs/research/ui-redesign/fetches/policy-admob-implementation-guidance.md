---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/2936217?hl=en
fetched: 2026-10-19
kind: primary
---

# Implementation guidance - Google AdMob Help

> Fetched 2026-10-19 · AdMob's top-level implementation guidance (parent of the banner and interstitial pages); read for general placement rules, reserved ad space and refresh.

## What it says

### Think about the user

> "Our ads are designed to visually complement the content of your apps. Good ad placement can provide publishers with reliable revenue without sacrificing user experience."

> "Take extreme care when using AdMob ads in cases where your users might be more prone to accidental clicks. For instance, if an app is meant for children, ads might not be an appropriate monetization solution as young children may have difficulty differentiating ads from app content."

> "You should always consider the flow of user engagement within your app when deciding where to place your ads. Implement ads where users are expected to be less engaged with the content of the app, such as in transition points of a reading app, or in between levels of a gaming app."

### Users should not be encouraged to click on ads

> "Phrases such as "click the ads" or similar language are not allowed. Any compensation or other incentives to click ads are strictly prohibited. Additionally, incentivizing users in any way to click on links and/or non-AdMob ads is also prohibited, as it may train users to perform actions (such as clicking on ads) that cause invalid activity."

### Reserve ad space during loading of app pages

> "Make sure to prepare fixed space for ads when loading a new screen in your app. Under certain conditions, such as very low signal strength or phone processing capabilities, ads may not load at the same time as your app content. In this case, ensure that ads do not cover or shift the other content to prevent accidental clicks."

### Refreshing ads

> "We recommend that you have ads persist for 60 seconds or longer, depending on the functionality of your app. Our internal tests have shown that this ensures users have enough time to engage with ads, providing the best performance for both advertisers and publishers. Furthermore, these tests have shown that refreshing ads more often can hurt fill rate for our publishers."

> "If your app is automatically refreshing ads, make sure ad requests are not made when the screen is off. Also, if users navigate to and from pages with ads in an app over a short period of time, a new ad request should not be made sooner than the recommended 60 second rate."

### Use appropriate ad formats

> "Review the different ad formats available (Android, iOS) and consider carefully which experiences will best match the user journeys you'd like to accompany with ads. For instance, banner ads can be a good choice to accompany some other content on the screen, while interstitial and rewarded ads are better suited to show as the user transitions between levels or different activities."

## What it does not say

- "Implement ads where users are expected to be less engaged" argues against a banner on the test screen (where the user is maximally engaged), but the page does not explicitly ban banners on task screens.
- No pixel/dp spacing value.
- The 60-second rule is about re-requesting banners when navigating between screens; it implies that remounting a new banner per question screen would be the wrong pattern, but the page does not discuss single-screen apps vs per-screen banners.
