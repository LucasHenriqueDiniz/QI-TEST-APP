---
tags: [fetch, ui-redesign]
source: https://engineering.atspotify.com/2024/1/exploring-the-animation-landscape-of-2023-wrapped
fetched: 2026-10-19
kind: vendor
---

# Exploring the Animation Landscape of 2023 Wrapped (Spotify Engineering, Zela Taino, 2024-01-24)

> Fetched 2026-10-19 · Spotify's own engineering write-up on how Wrapped's story animations are built; read for how a personalised, data-driven "result story" splits native (data) vs. Lottie (brand) animation. Read via the Browser pane (curl timed out).

## What it says

> "Data visualizations elevate the personalized user experience into engaging narratives, such as in 2021's Audio Aura or 2023's Me in 2023."

> "Leveraging native builds for animations has allowed us to parameterize our animations to inject variables such as localized text, images, and — more interestingly — listening data to dictate appearance, color, motion, etc. For every campaign, we have relied solely on natively built animations for data visualizations since they are, by nature, linked to user data."

> "For example, for 2021's Audio Aura, we mapped the listening frequency of a genre to the intensity of a color. Another example is 2023's Sound Town, where the animation lands on a coordinate on a map, which represents the location of a user's listening preferences."

> "Lottie especially shines when utilized for generic animations. Generic animations are the same visually and behaviorally for all users and don't require parameterization. Brand visual animations fall perfectly into this category"

> "From the technology side, another important question came into play: is the animation experience important enough that we'd feel comfortable with increasing our payload size and risking animation download failures? With natively built animations, everything is baked into client code, and there are no failures upon fetching animation assets for each user."

> "Native animations are responsible for data visualizations and interactions, while Lottie takes the lead for brand visuals and high keyframe animations that don't require parameterization."

> "The card flip was implemented natively since it is triggered by user interaction and the image on the card varies by user."

## What it does not say

- Nothing about share rates, why Wrapped gets shared, or the share-card format (9:16 is claimed only by third-party marketing write-ups I did not fetch).
- No user-research or metrics; purely an engineering-architecture post.
- Analogy for the app (inference): the score count-up, bell-curve fill landing on the user's percentile, and per-category bars are data-driven → native (Compose) animation; a generic celebratory intro could be a bundled asset.
