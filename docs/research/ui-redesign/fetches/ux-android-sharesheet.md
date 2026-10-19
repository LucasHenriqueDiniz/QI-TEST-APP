---
tags: [fetch, ui-redesign]
source: https://developer.android.com/training/sharing/send
fetched: 2026-10-19
kind: primary
---

# Send data to other apps (Android Developers)

> Fetched 2026-10-19 · Google's guidance for the Android Sharesheet; read for how to share a generated result-card image to WhatsApp/Instagram/etc. without a custom share UI.

## What it says

> "The Android Sharesheet is primarily designed for sending content outside your app or directly to another user. For example, sharing a URL with a friend."

> "Use the Android Sharesheet to create consistency for your users across apps. Don't display your app's own list of share targets or create your own Sharesheet variations."

> "The Android Sharesheet lets users share information with the right person, with relevant app suggestions, all with a single tap. The Sharesheet can suggest targets unavailable to custom solutions and uses a consistent ranking."

> "Find out when your users complete a share and to where / Add custom targets and app targets / Provide rich text content previews, starting in Android 10 (API level 29) / Exclude targets matching specific component names"

> "For all types of sharing, create an intent and set its action to Intent.ACTION_SEND. To display the Android Sharesheet, call Intent.createChooser(), passing it your Intent object."

> "Share binary data using the ACTION_SEND action. Set the appropriate MIME type and place a URI to the data in the extra EXTRA_STREAM [...] This is commonly used to share an image but can be used to share any type of binary content."

> "[...] ContentProvider like this, use the FileProvider helper class."

> "The Android Sharesheet might show a content preview, depending on the provided MIME type."

> "If you're previewing text, you can set a title, a thumbnail image, or both. Add a description to Intent.EXTRA_TITLE before calling Intent.createChooser(), and add a relevant thumbnail using ClipData."

## What it does not say

- Nothing about image dimensions for a story-format card (see `ux-instagram-sharing-to-stories.md`: minimum 720×1280, 9:16 or 9:18).
- Does not say whether sharing image + text together (EXTRA_STREAM + EXTRA_TEXT) is honoured by WhatsApp or Instagram; behaviour is up to the receiving app.
- No data on share rates or on what content gets shared.
