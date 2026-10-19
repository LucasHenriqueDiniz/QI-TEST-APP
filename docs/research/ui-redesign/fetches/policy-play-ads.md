---
tags: [fetch, ui-redesign]
source: https://support.google.com/googleplay/android-developer/answer/9857753?hl=en
fetched: 2026-10-19
kind: primary
---

# Ads - Play Console Help (Google Play Developer Program Policy)

> Fetched 2026-10-19 · Google Play's binding Ads policy; read for disruptive ads, unexpected interstitials, the 15-second closeability rule, "Made for Ads" and lockscreen rules.

## What it says

Intro:

> "To maintain a quality experience, we take into account your ad's content, audience, user experience, behavior, as well as security and privacy. We consider ads and associated offers as part of your app, they must also follow all other Google Play policies."

### Inappropriate Ads

> "The ads and their associated offers (for example, the ad is promoting the download of another app) shown within your app must be appropriate for the content rating of your app, even if the content by itself is otherwise compliant with our policies."

### Deceptive Ads

> "Ads must not simulate or impersonate the user interface of any app feature, such as notifications or warning elements of an operating system. It must be clear to the user which app is serving each ad."

### Disruptive Ads

> "Disruptive ads are ads that are displayed to users in unexpected ways, that may result in inadvertent clicks, or impairing or interfering with the usability of device functions."

> "Your app cannot force a user to click an ad or submit personal information for advertising purposes before they can fully use an app. Ads may only be displayed inside of the app serving them and must not interfere with other apps, ads, or the operation of the device, including system or device buttons and ports. This includes overlays, companion functionality, and widgetized ad units. If your app displays ads or other ads that interfere with normal use, they must be easily dismissible without penalty."

Examples of common violations:

> "- Ads that take up the entire screen or interfere with normal use and do not provide a clear means to dismiss the ad
> - Ads that force the user to click-through by using a false dismiss button, or by making ads suddenly appear in areas of the app where the user usually taps for another function
>   ② This ad suddenly appears in an area where the user is used to tapping for in-app functions.
> - Ads that display outside of the app serving them
> - Ads that are triggered by the home button or other features explicitly designed for exiting the app
>   ① The user attempts to exit the app and navigate to the home screen, but instead, the expected flow is interrupted by an ad."

### Better Ads Experiences

> "Developers are required to comply with the following ads guidelines to ensure high quality experiences for users when they are using Google Play apps. Your ads may not be shown in the following unexpected ways for users:
> - Full screen interstitial ads of all formats (video, GIF, static, etc.) that show unexpectedly, typically when the user has chosen to do something else, are not allowed.
> - Ads that appear during game play at the beginning of a level or during the beginning of a content segment are not allowed.
> - Full screen video interstitial ads that appear before an app's loading screen (splash screen) are not allowed.
> - Full screen interstitial ads of all formats that are not closeable after 15 seconds are not allowed. Opt-in full screen interstitials or full screen interstitials that do not interrupt users in their actions (for example, after the score screen in a game app) may persist more than 15 seconds."

> "This policy does not apply to rewarded ads which are explicitly opted-in by users (for example, an ad that developers explicitly offer a user to watch in exchange for unlocking a specific game feature or a piece of content). This policy also does not apply to monetization and advertising that does not interfere with normal app use or game play (for example, video content with integrated ads, non-full screen banner ads)."

> "These guidelines are inspired by the Better Ads Standards - Mobile Apps Experiences guidelines."

Examples of common violations:

> "- Unexpected ads that appear during game play or during the beginning of a content segment (for example, after a user has clicked on a button, and before the action intended by the button click has taken effect). These ads are unexpected for users, as users expect to begin a game or engage in content instead.
>   ① Unexpected static ad appears during game play at the beginning of a level.
>   ② Unexpected video ad appears during beginning of a content segment.
> - A full-screen ad that appears during game play and cannot be closed after 15 seconds."

### Made for Ads

> "We don't allow apps that display interstitial ads repeatedly to distract users from interacting with an app and performing in-app tasks."

> "- Apps where an interstitial ad is placed after a user action (including but not limited to clicks, swipes, etc.) in a consecutive manner."

### Lockscreen Monetization

> "Unless the exclusive purpose of the app is that of a lockscreen, apps may not introduce ads or features that monetize the locked display of a device."

## What it does not say

- Does not mention quizzes/tests or "results" screens. The tension for the IQ app: the "after a user has clicked on a button, and before the action intended by the button click has taken effect" example describes exactly a tap on the last "Confirmar" followed by an ad before the results. Play frames that as a violation when the ad is *unexpected* and at the *beginning of a content segment*; its own example of a non-interrupting placement is "after the score screen in a game app". AdMob, in contrast, recommends showing the interstitial "before the break page rather than after" (policy-admob-recommended-interstitials.md). Neither page states which side of a results screen is required; both agree the ad must not be unexpected.
- The 15-second rule constrains the ad, not the layout; the app cannot control the creative's close delay, and AdMob's own help says some third-party bidding video interstitials may take up to 30 seconds to offer a close option (policy-admob-interstitial-guidance.md). The page does not reconcile this.
- No banner spacing value; banners are only mentioned as exempt from "Better Ads Experiences" ("non-full screen banner ads"), not from "Disruptive Ads".
