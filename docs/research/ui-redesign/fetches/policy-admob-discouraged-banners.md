---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/6275345?hl=en
fetched: 2026-10-19
kind: primary
---

# Discouraged banner implementations - Google AdMob Help

> Fetched 2026-10-19 · AdMob's list of banner placements that cause invalid activity (one of them explicitly "against policy"); the closest match to the current layout (banner directly under a pinned Confirm button).

## What it says

> "Below are examples of poor banner ad implementations that often cause high levels of invalid activity due to the proximity of the ad to app clickable elements."

### Ads adjacent to interactive elements

> "Close proximity of banner ads to other elements within an app is one of the biggest causes of accidental clicks. To avoid accidental clicks, banner ads should not be placed immediately next to interactive elements and app content, which can include (but is not limited to):
> - Navigational buttons, such as a "next" button or a custom app menu bar.
> - Interactive content like a text chat box or an image in an image gallery.
> - On a game play screen where users are continuously interacting with the app."

> "This banner ad placement can put your app or your account at risk if too many accidental clicks occur, and we recommend against such an implementation."

### Ad sandwiched between app items

> "The banner ad example below shows an ad sandwiched between different areas of the app content: the interactive app content and the custom app navigation/menu buttons at the bottom. Users are likely to cross this banner ad multiple times while at a higher level of engagement with the app. Consequently, they are more likely to click on the banner ad in this scenario accidentally. This banner ad placement can put your app or your account at risk if too many accidental clicks occur, and we recommend against such an implementation."

### Ad overlapping with app content (against policy)

> "Banner ads should not float or hover over app content. If an app has a scrolling menu, banner ads should not pop-up or be placed over the content of this menu, as seen in the example below. Also, banner ads should not move as a user scrolls, as users may try to click on the menu but end up clicking on the ad accidentally instead. This specific implementation is against policy and we reserve the right to disable ad serving to your app."

## What it does not say

- No numeric spacing. "Immediately next to" is the only distance language.
- The first two cases are framed as "we recommend against" (risk of invalid activity), while overlap is "against policy". However, the Google Publisher Policies (policy-publisher-ads-interfering.md) make "adjacent to navigational or other action items" a "We do not allow" rule, so adjacency should be treated as a policy risk, not only a best practice.
- Does not discuss the case of a banner placed *below* a pinned bottom CTA (banner at the very bottom, button immediately above). By the "Navigational buttons, such as a 'next' button" wording, a "Confirmar" button directly above the banner is the textbook adjacent case.
