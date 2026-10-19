---
tags: [fetch, ui-redesign]
source: https://support.google.com/admob/answer/6275335?hl=en
fetched: 2026-10-19
kind: primary
---

# Recommended banner implementations - Google AdMob Help

> Fetched 2026-10-19 · AdMob's compliant banner layouts; read to find how the banner must be separated from the Confirm button and whether space must be reserved.

## What it says

### Ad separated from interactive elements

> "Separating the banner ad from app interactive elements helps reduce user confusion and accidental clicks. Given the limited screen size of mobile devices, it's extremely important to provide some buffer between ads and clickable elements to avoid accidental clicks. It helps to separate the banner ad from the content of the app by creating a non-clickable border or some other separation between the ad and the app's interactive portion. The examples below are sample implementations that separate the banner ad from the interactive content, including custom navigational buttons."

Example captions: "At top of app", "At bottom of app".

### Ad separated from app content by a border

> "Banner ads that remain on the screen while a user scrolls through other content may be placed at the top or the bottom of the screen, as long as there are appropriate borders and/or sufficient separation from the app content, especially from navigational elements such as menu bars. If using a border, it's recommended that the border is non-clickable. The examples below illustrate implementations of a banner ad either at the top or bottom of the app, with the ad separated clearly from the app content and/or custom navigation and menu buttons by a border."

Example captions: "At top of app", "At bottom of app", "With custom navigation buttons".

### Allocate a fixed space for the banner ad

> "Banner ads can load after the app content has loaded on the screen. Sometimes the delay in loading times can bump app content on the screen and the ad will appear where the app content was originally. Users may click on the ad accidentally instead of the actual app content. It is recommended that you allocate a fixed space for the banner ad so that no app content will appear in that space."

### Implement adaptive banners to accommodate multiple device screen sizes

> "Adaptive banners are ad units that render the best size for any device and orientation. To pick the best ad size, adaptive banners use fixed aspect ratios instead of fixed heights. This results in banner ads that occupy a more consistent portion of the screen across devices and screen sizes."

## What it does not say

- "Some buffer", "appropriate borders and/or sufficient separation" — no px/dp value anywhere on the page. The example images (not machine-readable) are the only visual reference.
- Does not say whether the reserved space should be kept when no ad fills (e.g. offline) — only that "no app content will appear in that space".
