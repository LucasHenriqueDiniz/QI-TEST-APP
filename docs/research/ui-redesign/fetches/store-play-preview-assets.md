---
tags: [fetch, ui-redesign]
source: https://support.google.com/googleplay/android-developer/answer/9866151?hl=en
fetched: 2026-10-19
kind: primary
---

# Add preview assets to showcase your app - Play Console Help

> Fetched 2026-10-19 · Google Play's authoritative spec for store screenshots, feature graphic, icon, short description and preview video; read for counts, sizes, caption/tagline rules and the screenshot conditions for promotion eligibility.

## What it says

> "Feature graphic, screenshots, short description, and videos are used to highlight and promote your app on Google Play and other Google promotional channels."

### Content guidelines: Requirements and recommendations

> "- "Requirements" listed on this page are mandatory; failure to meet requirements may result in removal or suspension from Google Play.
> - Guidelines listed under "Highly recommended" on this page can help make your app or game more eligible for recommendation and promotion throughout Google Play. Failure to comply with these guidelines will not impact your store listing page, but may result in changes to how your preview assets appear on Google Play or limit promotional opportunities.
> - All content must comply with our Developer Program Policies."

### App icon — Requirements

> "- 32-bit PNG (with alpha)
> - Dimensions: 512px by 512px
> - Maximum file size: 1024KB
> - Meets Google Play's icon design specifications
> - Do not include badges or text that suggest ranking, price, Google Play categories, or otherwise mislead users. For more information, see Metadata policy."

### Short description

> "- 80 character limit"

> "Language that reflects or suggests Google Play performance, ranking, accolades or awards, user testimonials, or price and promotional information, for example, "Best," "#1," "Top," "New," "Discount," "Sale," or "Million Downloads.""

> "Call-to-actions, for example, "download now," "install now," "play now," or "try now.""

> "Avoid duplication and redundancy of messaging across your short description, screenshots, feature graphics, or developer video. Keep in mind that these assets may be shown side by side."

### Feature graphic

Requirements:

> "- JPEG or 24-bit PNG (no alpha)
> - Dimensions: 1024px by 500px"

> "Avoid placing key elements (for example, brand logo, app name, primary slogan, and main UI) in the cutoff zones (the red areas in the example below), it may be cut off depending on the UI format."

> "Consider using more vibrant colors in your graphics to build interest and excitement, and avoid using pure white or dark gray. These colors can blend in with the Play Store background."

> "Use a similar or complementary color theme and style in the feature graphic, app icon, and in the app itself, so users can immediately associate them with your app and brand."

> "Avoid any content that reflects or suggests Google Play performance, ranking, user testimonials, accolades or awards, or price and promotional information. For example, do not use words like "Best," "#1," "Top," "New," "Free," "Discount," "Sale," or "Million Downloads.""

### Screenshots

> "Use screenshots to convey capabilities, the look and feel, and the experience of your app to potential users for better app discovery. You can add up to 8 screenshots for each supported device type."

#### Usage

> "Screenshots may be displayed throughout Google Play, for instance in search or on the homepage, in addition to your store listing on Google Play. When Google Play displays both your preview video and screenshots together, for example on your store listing page, and if your preview video is available then your screenshots will be shown after the preview video, followed left-to-right by the screenshots best suited for the device the user is browsing on."

#### Requirements

> "You must provide a minimum of two screenshots across different device types to publish your store listing:
> - JPEG or 24-bit PNG (no alpha)
> - Minimum dimension: 320px
> - Maximum dimension: 3840px
> - The maximum dimension of your screenshot can't be more than twice as long as the minimum dimension."

#### Highly recommended

> "Some sections of Google Play show groups of recommended apps and games in a large format using screenshots. To be eligible for recommendations in formats that use screenshots, the following guidelines are a requirement:
> - For apps, you must provide at least four screenshots with minimum 1080px resolution. These should be 16:9 for landscape (minimum 1920x1080px) screenshots and 9:16 for portrait screenshots (minimum 1080x1920px).
> - For games you must provide at least three 16:9 landscape screenshots (minimum 1920x1080px) or three 9:16 portrait screenshots (minimum 1080x1920px). [...]"

> "- Screenshots must demonstrate the actual in-app or in-game experience, focusing on the core features and content so users can anticipate what the app or game experience will be like.
> - Use captured footage of the app or game itself. Do not include people interacting with the device (for example, fingers tapping on the device), unless the core gameplay or app usage is off-device.
> - Stylized screenshots that break UI across multiple uploaded images are allowed, but prioritize UI in the first three screenshots as much as possible.
> - Add taglines only if necessary to convey the key characteristics of the app or game. Taglines should not take up more than 20% of the image.
> - Do not include any content that reflects or suggests Google Play performance, ranking, accolades or awards, user testimonials, or price and promotional information. For example, do not use words like "Best," "#1," "Top," "New," "Discount," "Sale," or "Million Downloads."
> - Avoid adding any form of call-to-action, for example, "Download now," "Install now," "Play now," or "Try now."
> - Avoid overloading the screenshot with text in small font sizes or backgrounds that compete with the text. These will not be visible on many phone screens.
> - Avoid time-sensitive tagline or content that can become outdated quickly to reduce the need to update."

> "- Localize your graphic and branding text as appropriate for different markets and languages.
> - In-game UI does not need to be localized per market, but any additional taglines or text overlays should be localized.
> - Edit excess elements in the notification bar before submitting. Do not show service providers or notifications. The battery, WiFi, and cell service logos should be full.
> - Use high-quality images with the proper aspect ratio."

> "Avoid inappropriate or repetitive image elements, such as: Third-party trademarked characters or logos without proper permission. Device imagery (as this can become obsolete quickly or alienate some users). Google Play or any other store's badge or icon."

> "Include alt text with each screenshot. [...] Use context to identify the important part of the image, using 140 characters or less."

Large screens:

> "For Chromebook and tablets, you can add a minimum of 4 screenshots to demonstrate your in-app experience. Upload screenshots between 1,080 and 7,680px. Use a 16:9 aspect ratio for landscape and a 9:16 aspect ratio for portrait. Exclude additional text that is not part of your core app experience, as this can get cut off on Play homepages on certain screen sizes"

### Preview video — Highly recommended (relevant to captions/copy)

> "Show the actual in-app or in-game experience, focusing on the core features and content as early as possible within the first 10 seconds of the video."

> "Aim for at least 80% of the video to be representative of the user experience."

> "Keep your videos short and concise because only the first 30 seconds autoplays."

Requirements:

> "Disable ads for your video to be shown on Google Play."

## What it does not say

- Nothing about which screenshot content *converts better* (no data); the guidance is about eligibility and policy, not conversion rates. Conversion testing is via store listing experiments (store-play-ab-tests.md).
- Does not say whether ads (e.g. the AdMob banner) should be visible in screenshots. "Demonstrate the actual in-app ... experience" plus "Use captured footage of the app" is the only relevant wording; it neither requires nor forbids showing the banner.
- No guidance on screenshot order beyond "prioritize UI in the first three screenshots".
